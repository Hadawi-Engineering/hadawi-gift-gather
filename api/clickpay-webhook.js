/**
 * Vercel Serverless Function: ClickPay Webhook
 * POST /api/clickpay-webhook
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

/**
 * Helper function to update occasion statistics
 */
async function updateOccasionStats(occasionId, amount) {
  try {
    const occasionRef = db.collection('occasions').doc(occasionId);
    const occasionDoc = await occasionRef.get();

    if (!occasionDoc.exists) {
      console.error('Occasion not found:', occasionId);
      return;
    }

    const occasion = occasionDoc.data();
    const currentTotal = occasion.totalCollected || 0;
    const currentCount = occasion.contributorCount || 0;

    // Update occasion with new totals
    await occasionRef.update({
      totalCollected: currentTotal + amount,
      contributorCount: currentCount + 1,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Updated occasion ${occasionId}: +${amount} SAR, ${currentCount + 1} contributors`);
  } catch (error) {
    console.error('Error updating occasion stats:', error);
  }
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const paymentData = req.body;
    console.log('ClickPay Webhook received:', JSON.stringify(paymentData, null, 2));

    // Validate webhook data
    if (!paymentData.tran_ref || !paymentData.cart_id) {
      console.error('Invalid webhook data - missing tran_ref or cart_id');
      return res.status(400).json({ error: 'Invalid webhook data' });
    }

    // Get payment document
    const paymentDocRef = db.collection('payments').doc(paymentData.cart_id);
    const paymentDoc = await paymentDocRef.get();

    if (!paymentDoc.exists) {
      console.error('Payment document not found:', paymentData.cart_id);
      return res.status(404).json({ error: 'Payment not found' });
    }

    const payment = paymentDoc.data();

    // Determine payment status based on ClickPay response
    let paymentStatus = 'failed';
    if (paymentData.payment_result && 
        paymentData.payment_result.response_status === 'A' &&
        paymentData.payment_result.response_code === '100') {
      paymentStatus = 'completed';
      console.log('Payment completed successfully:', paymentData.cart_id);
    } else {
      console.log('Payment failed:', paymentData.cart_id, paymentData.payment_result);
    }

    // Update payment document
    await paymentDocRef.update({
      status: paymentStatus,
      clickPayResponse: paymentData,
      clickPayTransactionRef: paymentData.tran_ref,
      completedAt: paymentStatus === 'completed' ? 
        admin.firestore.FieldValue.serverTimestamp() : null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // If payment is completed, update occasion statistics
    if (paymentStatus === 'completed') {
      await updateOccasionStats(payment.occasionId, payment.amount);
    }

    return res.status(200).json({ 
      success: true,
      message: 'Webhook processed successfully',
      status: paymentStatus
    });

  } catch (error) {
    console.error('Error processing ClickPay webhook:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};




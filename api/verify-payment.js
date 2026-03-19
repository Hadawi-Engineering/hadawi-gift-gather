/**
 * Vercel Serverless Function: Verify Payment Status
 * POST /api/verify-payment
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

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentDocId } = req.body;

    if (!paymentDocId) {
      return res.status(400).json({
        success: false,
        message: 'Payment document ID is required'
      });
    }

    // Get payment document
    const paymentDoc = await db.collection('payments').doc(paymentDocId).get();

    if (!paymentDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const payment = paymentDoc.data();

    return res.status(200).json({
      success: true,
      status: payment.status,
      amount: payment.amount,
      occasionId: payment.occasionId,
      transactionRef: payment.transactionRef,
      completedAt: payment.completedAt,
      payerName: payment.payerName,
      payerEmail: payment.payerEmail
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify payment: ' + error.message
    });
  }
};




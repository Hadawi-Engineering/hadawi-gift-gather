/**
 * Vercel Serverless Function: Initiate ClickPay Payment
 * POST /api/initiate-payment
 */

const admin = require('firebase-admin');
const axios = require('axios');

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
    const {
      paymentDocId,
      occasionId,
      amount,
      payerName,
      payerPhone,
      payerEmail,
      message,
      currency,
      language
    } = req.body;

    // Validate input
    if (!paymentDocId || !occasionId || !amount || !payerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment information'
      });
    }

    // Get ClickPay credentials from environment
    const clickPayConfig = {
      serverKey: process.env.CLICKPAY_SERVER_KEY,
      profileId: process.env.CLICKPAY_PROFILE_ID,
      apiUrl: process.env.CLICKPAY_API_URL || 'https://secure.clickpay.com.sa'
    };

    // Validate ClickPay configuration
    if (!clickPayConfig.serverKey || !clickPayConfig.profileId) {
      return res.status(500).json({
        success: false,
        message: 'Payment system configuration error'
      });
    }

    // Generate unique transaction reference
    const transactionRef = `HADAWI-${occasionId}-${Date.now()}`;

    // Get base URL for callbacks
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'https://hadawi.sa';

    // Prepare ClickPay payment request
    const paymentRequest = {
      profile_id: clickPayConfig.profileId,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id: paymentDocId,
      cart_description: `Gift contribution for occasion ${occasionId}`,
      cart_currency: currency || 'SAR',
      cart_amount: amount,
      customer_details: {
        name: payerName,
        email: payerEmail,
        phone: payerPhone,
        street1: 'N/A',
        city: 'Riyadh',
        state: 'Riyadh',
        country: 'SA',
        zip: '00000'
      },
      shipping_details: {
        name: payerName,
        email: payerEmail,
        phone: payerPhone,
        street1: 'N/A',
        city: 'Riyadh',
        state: 'Riyadh',
        country: 'SA',
        zip: '00000'
      },
      callback: `${baseUrl}/payments/return`,
      return: `${baseUrl}/payments/return`,
      hide_shipping: true,
      framed: false,
      language: language || 'ar'
    };

    // Call ClickPay API to create payment session
    const response = await axios.post(
      `${clickPayConfig.apiUrl}/payment/request`,
      paymentRequest,
      {
        headers: {
          'Authorization': clickPayConfig.serverKey,
          'Content-Type': 'application/json'
        }
      }
    );

    // Check response
    if (!response.data || !response.data.redirect_url) {
      console.error('ClickPay API Error:', response.data);
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment session'
      });
    }

    // Update payment document with transaction details
    await db.collection('payments').doc(paymentDocId).update({
      transactionRef: transactionRef,
      clickPayTransactionRef: response.data.tran_ref,
      status: 'initiated',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Return payment URL to client
    return res.status(200).json({
      success: true,
      paymentUrl: response.data.redirect_url,
      transactionRef: transactionRef,
      clickPayTransactionRef: response.data.tran_ref
    });

  } catch (error) {
    console.error('Error initiating payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment initiation failed: ' + error.message
    });
  }
};




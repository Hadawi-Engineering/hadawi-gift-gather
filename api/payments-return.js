/**
 * Vercel Serverless Function: ClickPay Return URL Handler
 * POST /payments/return
 *
 * ClickPay POSTs payment result data here after the customer completes payment.
 * We update the Firestore payment record and redirect to the result page.
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // ClickPay sends data as POST body (form-encoded or JSON)
    // Extract all possible fields from query string and body
    const queryParams = req.query || {};
    const bodyParams = req.body || {};

    // Merge — body takes priority over query params
    const params = { ...queryParams, ...bodyParams };

    console.log('ClickPay return callback received:', JSON.stringify(params));

    // Key ClickPay response fields
    const tranRef = params.tran_ref || params.tranRef || '';
    const cartId = params.cart_id || params.cartId || '';           // This is paymentDocId
    const respStatus = params.resp_status || params.respStatus || '';  // 'A' = Authorised
    const respMessage = params.resp_message || params.respMessage || '';
    const respCode = params.resp_code || params.respCode || '';
    const cartAmount = params.cart_amount || params.cartAmount || '';
    const cartCurrency = params.cart_currency || params.cartCurrency || 'SAR';
    const customerName = params['customer_details.name'] || params.customerName || '';
    const customerEmail = params['customer_details.email'] || params.customerEmail || '';
    const customerPhone = params['customer_details.phone'] || params.customerPhone || '';

    // Determine success
    const isSuccess = respStatus === 'A' || respStatus === 'Authorised' || respCode === '100';

    // Update Firestore if we have a cart_id (paymentDocId)
    if (cartId) {
      try {
        await db.collection('payments').doc(cartId).update({
          clickPayTransactionRef: tranRef,
          status: isSuccess ? 'completed' : 'failed',
          respStatus,
          respMessage,
          respCode,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Payment ${cartId} updated to ${isSuccess ? 'completed' : 'failed'}`);
      } catch (firestoreError) {
        console.error('Firestore update error:', firestoreError);
        // Don't block redirect on Firestore error
      }
    }

    // Build redirect URL to the result page with query params
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://hadawi.sa';

    const resultParams = new URLSearchParams({
      status: respStatus || (isSuccess ? 'A' : 'failed'),
      message: respMessage || (isSuccess ? 'Authorised' : 'Failed'),
      transactionId: tranRef || '',
      amount: cartAmount || '',
      currency: cartCurrency || '',
      ...(customerName && { customerName }),
      ...(customerEmail && { customerEmail }),
      ...(customerPhone && { customerPhone }),
    });

    const redirectUrl = `${baseUrl}/payment/result.html?${resultParams.toString()}`;

    // Redirect the browser to the result page
    res.setHeader('Location', redirectUrl);
    return res.status(302).end();

  } catch (error) {
    console.error('Error handling ClickPay return:', error);
    // Still redirect on error so user isn't left on a blank page
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://hadawi.sa';
    res.setHeader('Location', `${baseUrl}/payment/result.html?status=error&message=Processing+error`);
    return res.status(302).end();
  }
};

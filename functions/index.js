/**
 * Firebase Cloud Functions for Hadawi Gift Collection
 * Handles ClickPay payment integration and webhook processing
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

/**
 * Initiate ClickPay Payment
 * This function creates a payment session with ClickPay and returns the payment URL
 */
exports.initiateClickPayPayment = functions.https.onCall(async (data, context) => {
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
        } = data;

        // Validate input
        if (!paymentDocId || !occasionId || !amount || !payerEmail) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Missing required payment information'
            );
        }

        // Get ClickPay credentials from environment
        const clickPayConfig = {
            serverKey: process.env.CLICKPAY_SERVER_KEY,
            profileId: process.env.CLICKPAY_PROFILE_ID,
            apiUrl: process.env.CLICKPAY_API_URL || 'https://secure.clickpay.com.sa'
        };

        // Validate ClickPay configuration
        if (!clickPayConfig.serverKey || !clickPayConfig.profileId) {
            throw new functions.https.HttpsError(
                'failed-precondition',
                'ClickPay configuration is missing'
            );
        }

        // Generate unique transaction reference
        const transactionRef = `HADAWI-${occasionId}-${Date.now()}`;

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
            callback: `${process.env.VITE_APP_RETURN_URL || 'https://hadawi.sa/payment/result.html'}`,
            return: `${process.env.VITE_APP_RETURN_URL || 'https://hadawi.sa/payment/result.html'}`,
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
            throw new functions.https.HttpsError(
                'internal',
                'Failed to create payment session with ClickPay'
            );
        }

        // Update payment document with transaction details
        await db.collection('payments').doc(paymentDocId).update({
            transactionRef: transactionRef,
            clickPayTransactionRef: response.data.tran_ref,
            status: 'initiated',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Return payment URL to client
        return {
            success: true,
            paymentUrl: response.data.redirect_url,
            transactionRef: transactionRef,
            clickPayTransactionRef: response.data.tran_ref
        };

    } catch (error) {
        console.error('Error initiating ClickPay payment:', error);
        
        // Return appropriate error
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        
        throw new functions.https.HttpsError(
            'internal',
            'Failed to initiate payment: ' + error.message
        );
    }
});

/**
 * ClickPay Webhook Handler
 * Processes payment callbacks from ClickPay
 */
exports.clickPayWebhook = functions.https.onRequest(async (req, res) => {
    try {
        // Only accept POST requests
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }

        const paymentData = req.body;
        console.log('ClickPay Webhook received:', paymentData);

        // Validate webhook data
        if (!paymentData.tran_ref || !paymentData.cart_id) {
            res.status(400).send('Invalid webhook data');
            return;
        }

        // Get payment document
        const paymentDocRef = db.collection('payments').doc(paymentData.cart_id);
        const paymentDoc = await paymentDocRef.get();

        if (!paymentDoc.exists) {
            console.error('Payment document not found:', paymentData.cart_id);
            res.status(404).send('Payment not found');
            return;
        }

        const payment = paymentDoc.data();

        // Determine payment status based on ClickPay response
        let paymentStatus = 'failed';
        if (paymentData.payment_result && 
            paymentData.payment_result.response_status === 'A' &&
            paymentData.payment_result.response_code === '100') {
            paymentStatus = 'completed';
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

        res.status(200).send('Webhook processed successfully');

    } catch (error) {
        console.error('Error processing ClickPay webhook:', error);
        res.status(500).send('Internal server error');
    }
});

/**
 * Verify Payment Status
 * Allows client to verify payment status
 */
exports.verifyPaymentStatus = functions.https.onCall(async (data, context) => {
    try {
        const { paymentDocId } = data;

        if (!paymentDocId) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Payment document ID is required'
            );
        }

        // Get payment document
        const paymentDoc = await db.collection('payments').doc(paymentDocId).get();

        if (!paymentDoc.exists) {
            throw new functions.https.HttpsError(
                'not-found',
                'Payment not found'
            );
        }

        const payment = paymentDoc.data();

        return {
            success: true,
            status: payment.status,
            amount: payment.amount,
            occasionId: payment.occasionId,
            transactionRef: payment.transactionRef,
            completedAt: payment.completedAt
        };

    } catch (error) {
        console.error('Error verifying payment:', error);
        
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        
        throw new functions.https.HttpsError(
            'internal',
            'Failed to verify payment: ' + error.message
        );
    }
});

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

    } catch (error) {
        console.error('Error updating occasion stats:', error);
    }
}





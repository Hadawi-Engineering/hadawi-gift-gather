# Hadawi Gift Collection - Firebase Setup Guide

This folder contains the gift collection pages that integrate with Firebase and ClickPay for payment processing.

## 📁 File Structure

```
collect/
├── [id].html              # Main HTML page for gift collection
├── main-firebase.js       # Firebase-integrated JavaScript (ES6 modules)
├── firebase-config.js     # Firebase configuration and initialization
├── main.js                # Legacy version (REST API)
└── README.md              # This file
```

## 🔧 Setup Instructions

### 1. Firebase Project Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Cloud Functions
4. Get your Firebase configuration from Project Settings

### 2. Environment Variables

Create a `.env` file in the root directory based on `env.example`:

```bash
cp env.example .env
```

Fill in your Firebase credentials and ClickPay keys:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# ClickPay Configuration
CLICKPAY_SERVER_KEY=your_clickpay_server_key
CLICKPAY_CLIENT_KEY=your_clickpay_client_key
CLICKPAY_PROFILE_ID=your_clickpay_profile_id
```

### 3. Firestore Database Structure

#### Collections:

**occasions**
```javascript
{
  id: "auto-generated",
  url: "unique-url-slug",
  occasionName: "Birthday Party",
  receiverName: "Ahmed",
  occasionDate: Timestamp,
  type: "Birthday",
  giftType: "Cash",
  giftName: "Gift Card",
  giftPrice: 500,
  amountForEveryone: 50,
  note: "Optional note",
  totalCollected: 0,
  contributorCount: 0,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**payments**
```javascript
{
  id: "auto-generated",
  occasionId: "reference-to-occasion",
  amount: 50,
  payerName: "Mohammed",
  payerPhone: "+966500000000",
  payerEmail: "email@example.com",
  message: "Happy Birthday!",
  currency: "SAR",
  status: "pending|initiated|completed|failed",
  transactionRef: "HADAWI-xxx-timestamp",
  clickPayTransactionRef: "clickpay-ref",
  clickPayResponse: {},
  createdAt: Timestamp,
  updatedAt: Timestamp,
  completedAt: Timestamp
}
```

### 4. Deploy Firebase Functions

Install Firebase CLI if you haven't:

```bash
npm install -g firebase-tools
```

Login to Firebase:

```bash
firebase login
```

Initialize Firebase in your project:

```bash
firebase init
```

Select:
- ✅ Firestore
- ✅ Functions
- ✅ Hosting

Deploy functions:

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

Set environment variables for Cloud Functions:

```bash
firebase functions:config:set \
  clickpay.server_key="your_server_key" \
  clickpay.profile_id="your_profile_id" \
  clickpay.api_url="https://secure.clickpay.com.sa" \
  app.return_url="https://hadawi.sa/payment/result.html"
```

### 5. Deploy Firestore Rules & Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 6. Deploy Hosting

```bash
firebase deploy --only hosting
```

## 🔐 Security Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **ClickPay keys** are only used in Cloud Functions (server-side)
3. **Firebase config** in client-side is safe to expose (it's not a secret)
4. **Firestore rules** protect data access

## 🧪 Testing Locally

### Test Firebase Functions Locally:

```bash
firebase emulators:start
```

This will start:
- Firestore Emulator
- Functions Emulator
- Hosting Emulator

Update `firebase-config.js` to use emulators in development:

```javascript
if (window.location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
```

## 🌐 How It Works

### Payment Flow:

1. **User visits** `/collect/{occasion-id}`
2. **Page loads** occasion details from Firestore
3. **User fills** payment form
4. **Form submits** → Creates pending payment in Firestore
5. **Calls Cloud Function** `initiateClickPayPayment`
6. **Function creates** ClickPay payment session
7. **User redirects** to ClickPay hosted page
8. **User completes** payment on ClickPay
9. **ClickPay calls** webhook `/clickPayWebhook`
10. **Function updates** payment status in Firestore
11. **User redirects** back to success page

### Data Security:

- ✅ Payment data stored in Firestore with proper rules
- ✅ Sensitive ClickPay keys only in Cloud Functions
- ✅ Server-side validation of all payments
- ✅ Webhook verification from ClickPay
- ✅ Transaction references for tracking

## 📝 Cloud Functions Available

1. **initiateClickPayPayment** - Creates ClickPay payment session
2. **clickPayWebhook** - Handles ClickPay payment callbacks
3. **verifyPaymentStatus** - Verifies payment completion

## 🔄 Switching Between Versions

### Use Firebase Backend (Recommended):
- Keep `main-firebase.js` linked in HTML
- Requires Firebase setup

### Use REST API Backend:
- Switch to `main.js` in HTML
- Requires your existing API at `api.hadawi.sa`

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [ClickPay API Documentation](https://clickpay.com.sa/developers/)

## 🐛 Troubleshooting

### Issue: Firebase not connecting
- Check Firebase config in `.env`
- Verify Firebase project is active
- Check browser console for errors

### Issue: Payment not initiating
- Check Cloud Functions logs: `firebase functions:log`
- Verify ClickPay credentials
- Check network tab in browser DevTools

### Issue: Webhook not receiving
- Ensure Cloud Function URL is publicly accessible
- Configure webhook URL in ClickPay dashboard
- Check Cloud Functions logs for errors

## 📞 Support

For issues or questions, refer to the main project documentation.





# 🚀 Hadawi Gift Gather - Setup Guide

Complete step-by-step guide to set up the project from scratch.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Firebase account created
- [ ] ClickPay merchant account
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `hadawi-gift-gather` (or your choice)
4. Enable Google Analytics (recommended)
5. Click "Create project"

### 1.2 Enable Firestore Database

1. In Firebase Console, go to **Build > Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (we have custom rules)
4. Select region closest to your users (e.g., `asia-south1` for Saudi Arabia)
5. Click "Enable"

### 1.3 Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon `</>`
4. Register app with nickname: `hadawi-web`
5. Copy the `firebaseConfig` object
6. You'll need these values later

## Step 2: Clone and Configure Project

### 2.1 Clone Repository

```bash
git clone <your-repo-url>
cd hadawi-gift-gather
```

### 2.2 Install Dependencies

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Install project dependencies
npm install

# Install function dependencies
cd functions
npm install
cd ..
```

### 2.3 Configure Firebase Settings

Open `collect/firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456",
    measurementId: "G-XXXXXXXXXX"
};
```

## Step 3: ClickPay Setup

### 3.1 Get ClickPay Credentials

1. Log in to [ClickPay Dashboard](https://merchant.clickpay.com.sa/)
2. Go to **Developers > API Keys**
3. Copy the following:
   - Server Key
   - Profile ID
   - Client Key (optional)

### 3.2 Configure ClickPay in Firebase Functions

```bash
firebase functions:config:set \
  clickpay.server_key="YOUR_CLICKPAY_SERVER_KEY" \
  clickpay.profile_id="YOUR_PROFILE_ID" \
  clickpay.api_url="https://secure.clickpay.com.sa"
```

Verify configuration:

```bash
firebase functions:config:get
```

## Step 4: Firebase CLI Setup

### 4.1 Login to Firebase

```bash
firebase login
```

This will open a browser for authentication.

### 4.2 Initialize Firebase Project

```bash
firebase use --add
```

Select your Firebase project from the list.

### 4.3 Verify Configuration

```bash
firebase projects:list
```

Your project should show as active (marked with *).

## Step 5: Deploy Firestore Rules and Indexes

### 5.1 Review Firestore Rules

Check `firestore.rules` to understand security rules:

```bash
cat firestore.rules
```

### 5.2 Deploy Rules

```bash
firebase deploy --only firestore:rules
```

### 5.3 Deploy Indexes

```bash
firebase deploy --only firestore:indexes
```

This may take a few minutes. Firebase will create composite indexes.

## Step 6: Deploy Cloud Functions

### 6.1 Test Functions Locally (Optional)

```bash
firebase emulators:start --only functions,firestore
```

Access emulator UI at http://localhost:4000

Press `Ctrl+C` to stop.

### 6.2 Deploy Functions to Production

```bash
firebase deploy --only functions
```

This will deploy:
- `initiateClickPayPayment`
- `clickPayWebhook`
- `verifyPaymentStatus`

Note the webhook URL from deployment output. You'll need it for ClickPay.

## Step 7: Configure ClickPay Webhook

### 7.1 Get Webhook URL

After deploying functions, find the webhook URL:

```bash
firebase functions:log
```

Or check Firebase Console > Functions.

The webhook URL will look like:
```
https://us-central1-your-project-id.cloudfunctions.net/clickPayWebhook
```

### 7.2 Set Webhook in ClickPay

1. Log in to ClickPay Dashboard
2. Go to **Developers > Webhooks**
3. Add new webhook URL (from above)
4. Select events:
   - ✅ Payment Success
   - ✅ Payment Failed
5. Save

## Step 8: Seed Test Data

### 8.1 Create Sample Occasion

In Firebase Console > Firestore Database, create a document in `occasions` collection:

```javascript
{
  url: "test-birthday",
  occasionName: "Ahmed's Birthday",
  receiverName: "Ahmed",
  occasionDate: (select Timestamp, set future date),
  type: "Birthday",
  giftType: "Cash",
  giftName: "Gift Card",
  giftPrice: 500,
  amountForEveryone: 50,
  note: "Help us celebrate Ahmed's birthday!",
  totalCollected: 0,
  contributorCount: 0,
  createdAt: (auto-generated),
  updatedAt: (auto-generated)
}
```

### 8.2 Test the Page

Deploy hosting:

```bash
firebase deploy --only hosting
```

Visit: `https://your-project-id.web.app/collect/test-birthday`

## Step 9: Testing

### 9.1 Test Payment Flow

1. Visit collection page
2. Fill in contributor details
3. Submit payment
4. Should redirect to ClickPay
5. Complete test payment
6. Verify redirect back to success page
7. Check Firestore for payment record

### 9.2 Test with ClickPay Test Cards

Use ClickPay test card numbers:
- **Success**: 4111 1111 1111 1111
- **Decline**: 4000 0000 0000 0002

## Step 10: Production Deployment

### 10.1 Final Deployment

```bash
# Deploy everything
firebase deploy
```

This deploys:
- Hosting
- Functions
- Firestore rules
- Firestore indexes

### 10.2 Custom Domain (Optional)

1. Firebase Console > Hosting
2. Click "Add custom domain"
3. Enter your domain (e.g., `hadawi.sa`)
4. Follow DNS configuration steps
5. Wait for SSL certificate provisioning (automatic)

### 10.3 Update URLs

Update return URLs in:
1. `functions/index.js` - callback/return URLs
2. ClickPay Dashboard - return URL
3. Firebase Functions config

```bash
firebase functions:config:set \
  app.return_url="https://hadawi.sa/payment/result.html"
```

Redeploy functions:

```bash
firebase deploy --only functions
```

## Step 11: Monitoring

### 11.1 Enable Monitoring

In Firebase Console:
1. **Analytics** - Enable and configure
2. **Performance** - Enable monitoring
3. **Crashlytics** - Enable error reporting

### 11.2 View Logs

```bash
# All function logs
firebase functions:log

# Specific function
firebase functions:log --only initiateClickPayPayment

# Follow logs (realtime)
firebase functions:log --follow
```

### 11.3 Firestore Usage

Monitor in Firebase Console > Firestore Database > Usage tab

## Troubleshooting

### Issue: Functions not deploying

```bash
# Check Node version
node --version  # Should be 18+

# Reinstall dependencies
cd functions
rm -rf node_modules package-lock.json
npm install
cd ..
firebase deploy --only functions
```

### Issue: Firebase config not loading

1. Verify `firebase-config.js` has correct values
2. Check browser console for errors
3. Ensure Firebase SDK version is correct

### Issue: Payments not processing

1. Check Cloud Functions logs
2. Verify ClickPay credentials
3. Test webhook with ClickPay test tool
4. Check Firestore rules

### Issue: CORS errors

1. Add CORS headers in Cloud Functions
2. Verify domain is allowed in Firebase Console
3. Check ClickPay allowed domains

## Security Checklist

- [ ] Firestore rules deployed and tested
- [ ] ClickPay keys secured in Functions config
- [ ] HTTPS enforced (automatic with Firebase Hosting)
- [ ] No sensitive data in client-side code
- [ ] Webhook endpoint secured
- [ ] Input validation in Cloud Functions
- [ ] Rate limiting configured (optional)

## Performance Optimization

- [ ] Enable CDN caching (automatic)
- [ ] Minimize JavaScript bundle size
- [ ] Optimize images in `assets/`
- [ ] Enable compression (automatic)
- [ ] Monitor function cold starts

## Next Steps

1. ✅ Create more test occasions
2. ✅ Invite test users
3. ✅ Monitor first transactions
4. ✅ Set up email notifications
5. ✅ Create admin dashboard
6. ✅ Add analytics tracking

## Support

If you encounter issues:

1. Check [Firebase Documentation](https://firebase.google.com/docs)
2. Check [ClickPay Documentation](https://clickpay.com.sa/developers/)
3. Review Cloud Functions logs
4. Check Firestore rules debugger

## Quick Reference

### Useful Commands

```bash
# Login
firebase login

# List projects
firebase projects:list

# Use project
firebase use project-id

# Deploy everything
firebase deploy

# Deploy specific service
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore

# Start emulators
firebase emulators:start

# View logs
firebase functions:log

# Get function config
firebase functions:config:get

# Set function config
firebase functions:config:set key="value"
```

---

🎉 **Congratulations!** Your Hadawi Gift Gather platform is now live!

Visit your site at: `https://your-project-id.web.app`





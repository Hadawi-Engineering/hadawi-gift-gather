# 🚀 Vercel Deployment Guide - Hadawi Gift Gather

Complete guide to deploy your gift collection platform on Vercel with Firebase Firestore and ClickPay integration.

## 📋 Prerequisites

- ✅ Vercel account (free tier is enough)
- ✅ Firebase project created
- ✅ ClickPay merchant account
- ✅ Git repository (GitHub, GitLab, or Bitbucket)

## 🎯 Architecture Overview

```
Vercel Hosting
├── Static Files (HTML, CSS, JS)
├── Vercel Serverless Functions (/api)
│   ├── initiate-payment.js
│   ├── clickpay-webhook.js
│   └── verify-payment.js
└── Firebase Firestore (Database)
```

---

## Step 1: Prepare Firebase

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: `hadawi-gift-gather`
3. Enable Firestore Database (production mode)
4. Get Firebase credentials

### 1.2 Update Firebase Config

Edit `collect/firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456:web:abc123",
    measurementId: "G-XXXXXXXXXX"
};
```

### 1.3 Deploy Firestore Rules

```bash
# Install Firebase CLI (optional, for rules deployment)
npm install -g firebase-tools

# Login
firebase login

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

**Or manually** copy rules from `firestore.rules` to Firebase Console.

---

## Step 2: Connect to Vercel

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Login to Vercel

```bash
vercel login
```

Follow the email verification process.

### 2.3 Link Project

```bash
# From project root
vercel
```

Answer the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `hadawi-gift-gather`
- Directory? `.` (current directory)
- Override settings? **N**

---

## Step 3: Configure Environment Variables

### 3.1 Firebase Service Account

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download JSON file
4. Extract these values:
   - `project_id`
   - `client_email`
   - `private_key`

### 3.2 Add to Vercel

```bash
# Firebase credentials (from service account JSON)
vercel env add FIREBASE_PROJECT_ID
# Enter: your-project-id

vercel env add FIREBASE_CLIENT_EMAIL
# Enter: firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

vercel env add FIREBASE_PRIVATE_KEY
# Enter: -----BEGIN PRIVATE KEY-----\nMIIE...

# ClickPay credentials
vercel env add CLICKPAY_SERVER_KEY
# Enter: your_clickpay_server_key

vercel env add CLICKPAY_PROFILE_ID
# Enter: your_profile_id

vercel env add CLICKPAY_API_URL
# Enter: https://secure.clickpay.com.sa

# Add for all environments (production, preview, development)
```

**Alternative: Via Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Settings → Environment Variables
4. Add each variable:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `CLICKPAY_SERVER_KEY`
   - `CLICKPAY_PROFILE_ID`
   - `CLICKPAY_API_URL`

---

## Step 4: Deploy to Vercel

### 4.1 Deploy via Git (Recommended)

```bash
# Push to GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push origin main

# Import to Vercel
# Go to vercel.com/new
# Import your repository
# Vercel will auto-deploy on every push
```

### 4.2 Deploy via CLI

```bash
# Production deployment
vercel --prod

# Preview deployment (for testing)
vercel
```

### 4.3 Deployment Complete! 🎉

Vercel will give you a URL like:
```
https://hadawi-gift-gather.vercel.app
```

---

## Step 5: Configure ClickPay Webhook

### 5.1 Get Webhook URL

Your webhook URL will be:
```
https://your-project.vercel.app/api/clickpay-webhook
```

### 5.2 Add to ClickPay Dashboard

1. Login to [ClickPay Dashboard](https://merchant.clickpay.com.sa/)
2. Go to **Developers → Webhooks**
3. Add new webhook:
   - URL: `https://your-project.vercel.app/api/clickpay-webhook`
   - Events: ✅ Payment Success, ✅ Payment Failed
4. Save

---

## Step 6: Test Your Deployment

### 6.1 Create Test Occasion

In Firebase Console → Firestore:

```javascript
Collection: occasions
Document ID: auto
Fields:
  url: "test-gift"
  occasionName: "Test Birthday"
  receiverName: "Ahmed"
  occasionDate: (future date)
  type: "Birthday"
  giftType: "Cash"
  giftPrice: 100
  amountForEveryone: 10
  totalCollected: 0
  contributorCount: 0
```

### 6.2 Visit Collection Page

```
https://your-project.vercel.app/collect/test-gift
```

### 6.3 Test Payment Flow

1. Fill in contributor form
2. Submit payment
3. Use ClickPay test card: **4111 1111 1111 1111**
4. Complete payment
5. Verify redirect to success page
6. Check Firestore for updated payment

---

## Step 7: Custom Domain (Optional)

### 7.1 Add Domain in Vercel

1. Go to Project Settings → Domains
2. Add your domain: `hadawi.sa`
3. Follow DNS configuration instructions

### 7.2 Update DNS

Add these records to your domain:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 7.3 Wait for SSL

Vercel automatically provisions SSL certificate (5-10 minutes).

---

## 📊 Project Structure

```
hadawi-gift-gather/
├── collect/
│   ├── [id].html          # Collection page
│   ├── main-vercel.js     # Vercel integration
│   ├── firebase-config.js # Firebase setup
│   └── main-firebase.js   # Firebase Functions version (backup)
│
├── api/                    # Vercel Serverless Functions
│   ├── initiate-payment.js    # Create ClickPay session
│   ├── clickpay-webhook.js    # Process payment callbacks
│   ├── verify-payment.js      # Verify payment status
│   └── package.json           # API dependencies
│
├── vercel.json            # Vercel configuration
├── firestore.rules        # Database security rules
└── firestore.indexes.json # Database indexes
```

---

## 🔐 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `FIREBASE_PROJECT_ID` | Firebase project ID | `hadawi-gift-gather` |
| `FIREBASE_CLIENT_EMAIL` | Service account email | `firebase-adminsdk-xxxxx@...` |
| `FIREBASE_PRIVATE_KEY` | Service account private key | `-----BEGIN PRIVATE KEY-----\n...` |
| `CLICKPAY_SERVER_KEY` | ClickPay server key | `SxxxxxxxxxxxxxxxxxxJN` |
| `CLICKPAY_PROFILE_ID` | ClickPay profile ID | `12345` |
| `CLICKPAY_API_URL` | ClickPay API endpoint | `https://secure.clickpay.com.sa` |

---

## 🚀 Vercel CLI Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel

# View logs
vercel logs

# List deployments
vercel ls

# View environment variables
vercel env ls

# Pull environment variables locally
vercel env pull

# Remove project
vercel remove
```

---

## 🐛 Troubleshooting

### Issue: API Functions Not Working

**Check logs:**
```bash
vercel logs --follow
```

**Verify environment variables:**
```bash
vercel env ls
```

### Issue: Firebase Connection Failed

1. Verify `FIREBASE_PRIVATE_KEY` has `\n` newlines
2. Check service account has Firestore permissions
3. Verify project ID is correct

### Issue: ClickPay Webhook Not Receiving

1. Verify webhook URL is publicly accessible
2. Check Vercel function logs
3. Test webhook with ClickPay test tool
4. Verify webhook URL in ClickPay dashboard

### Issue: CORS Errors

Already configured in `vercel.json`. If still occurring:
1. Check browser console for specific error
2. Verify API endpoint is correct
3. Try clearing browser cache

---

## 💰 Vercel Pricing

### Free Tier (Hobby)
- ✅ 100GB bandwidth/month
- ✅ 100 serverless function executions/day
- ✅ Custom domains
- ✅ SSL certificates
- ✅ Perfect for testing & small scale

### Pro Tier ($20/month)
- ✅ 1TB bandwidth/month
- ✅ Unlimited serverless functions
- ✅ Team collaboration
- ✅ Analytics
- ✅ Recommended for production

### Estimated Costs

For **500 transactions/month**:
- Vercel: Free (under limits)
- Firebase: $5-10/month
- **Total: $5-10/month**

For **2,000 transactions/month**:
- Vercel: $20/month (Pro tier)
- Firebase: $10-20/month
- **Total: $30-40/month**

---

## 📈 Monitoring

### Vercel Analytics

Enable in Project Settings → Analytics

Tracks:
- Page views
- API function invocations
- Response times
- Error rates

### Firebase Console

Monitor in Firebase Console:
- Firestore usage
- Read/write operations
- Storage usage

### Custom Logging

View logs:
```bash
vercel logs --follow
```

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

Vercel automatically deploys when you push to your repository:

```bash
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys!
```

### Branch Deployments

- `main` branch → Production
- Other branches → Preview deployments

---

## 🎯 Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure custom domain
3. ✅ Test payment flow
4. ✅ Enable analytics
5. ✅ Monitor performance
6. ✅ Set up alerts

---

## 📞 Support Resources

- 🚀 [Vercel Documentation](https://vercel.com/docs)
- 🔥 [Firebase Documentation](https://firebase.google.com/docs)
- 💳 [ClickPay Documentation](https://clickpay.com.sa/developers/)
- 🐛 [Vercel Support](https://vercel.com/support)

---

## ✅ Deployment Checklist

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Firebase credentials configured
- [ ] Vercel account created
- [ ] Repository connected to Vercel
- [ ] Environment variables added
- [ ] Initial deployment successful
- [ ] Test occasion created
- [ ] Collection page loads correctly
- [ ] Payment flow tested
- [ ] ClickPay webhook configured
- [ ] Webhook tested
- [ ] Custom domain added (optional)
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Monitoring set up

---

**🎉 Congratulations! Your platform is live on Vercel!**

Your URL: `https://your-project.vercel.app`

Made with ❤️ by the Hadawi Team




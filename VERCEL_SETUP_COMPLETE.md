# ✅ Vercel Setup Complete! 

Your Hadawi Gift Gather project is now ready for Vercel deployment!

## 📦 What's Been Created

### ✨ Vercel Serverless Functions (`/api`)

Three production-ready serverless functions:

1. **`api/initiate-payment.js`**
   - Creates ClickPay payment sessions
   - Validates payment data
   - Updates Firestore payment records
   - Returns payment URL for redirect

2. **`api/clickpay-webhook.js`**
   - Receives payment notifications from ClickPay
   - Updates payment status in Firestore
   - Updates occasion statistics
   - Handles success/failure scenarios

3. **`api/verify-payment.js`**
   - Verifies payment completion
   - Returns payment status to client
   - Used on result/success pages

4. **`api/package.json`**
   - Dependencies: firebase-admin, axios
   - Auto-installed by Vercel

### 🎨 Frontend Integration

1. **`collect/main-vercel.js`**
   - Vercel-optimized version
   - Calls Vercel API endpoints
   - Firebase Firestore integration
   - Full payment flow handling

2. **`collect/[id].html`**
   - Updated to use `main-vercel.js`
   - Ready for Vercel deployment

### ⚙️ Configuration Files

1. **`vercel.json`** - Enhanced with:
   - URL rewrites for `/collect/:id`
   - CORS headers
   - Environment variable references

2. **`.vercelignore`**
   - Excludes unnecessary files from deployment
   - Reduces deployment size

3. **`env.vercel.example`**
   - Template for environment variables
   - Instructions for adding to Vercel

### 📚 Documentation

1. **`VERCEL_DEPLOYMENT.md`** (1000+ lines)
   - Complete step-by-step guide
   - Troubleshooting section
   - Pricing information
   - Monitoring setup

2. **`VERCEL_QUICKSTART.md`**
   - 5-minute deployment guide
   - Essential steps only
   - Quick commands reference

3. **`README_VERCEL.md`**
   - Project overview for Vercel
   - Tech stack
   - Features list
   - Quick deploy button

---

## 🚀 Deployment Steps

### Step 1: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create new)
3. Enable Firestore Database
4. Go to: **Project Settings → Service Accounts**
5. Click: **"Generate New Private Key"**
6. Download the JSON file
7. Extract these values:
   - `project_id`
   - `client_email`
   - `private_key`

### Step 2: Update Firebase Client Config

Edit `collect/firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456:web:abc123",
    measurementId: "G-XXXXXXXXXX"
};
```

### Step 3: Deploy Firestore Rules (Optional but Recommended)

```bash
# Install Firebase CLI (if needed)
npm install -g firebase-tools

# Login
firebase login

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

**Or** manually copy `firestore.rules` to Firebase Console.

### Step 4: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel
```

Answer the prompts:
- Set up and deploy? **Y**
- Which scope? **Select your account**
- Link to existing project? **N**
- Project name? **hadawi-gift-gather**
- Directory? **. (current)**
- Override settings? **N**

### Step 5: Add Environment Variables

```bash
# Firebase credentials
vercel env add FIREBASE_PROJECT_ID
# Enter: your-project-id

vercel env add FIREBASE_CLIENT_EMAIL
# Enter: firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

vercel env add FIREBASE_PRIVATE_KEY
# Enter: -----BEGIN PRIVATE KEY-----\n... (paste full key)

# ClickPay credentials
vercel env add CLICKPAY_SERVER_KEY
# Enter: your_server_key

vercel env add CLICKPAY_PROFILE_ID
# Enter: your_profile_id

vercel env add CLICKPAY_API_URL
# Enter: https://secure.clickpay.com.sa
```

**Important**: Select **"Production", "Preview", and "Development"** for each variable.

### Step 6: Deploy to Production

```bash
vercel --prod
```

### Step 7: Configure ClickPay Webhook

1. Go to [ClickPay Dashboard](https://merchant.clickpay.com.sa/)
2. Navigate to: **Developers → Webhooks**
3. Add webhook URL: `https://your-project.vercel.app/api/clickpay-webhook`
4. Select events: ✅ Payment Success, ✅ Payment Failed
5. Save

### Step 8: Test!

1. Create test occasion in Firestore:
   ```
   Collection: occasions
   Document: auto-generated
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

2. Visit: `https://your-project.vercel.app/collect/test-gift`

3. Test payment with ClickPay test card: `4111 1111 1111 1111`

---

## 📊 Project Overview

### File Structure

```
hadawi-gift-gather/
│
├── collect/                      # Collection pages
│   ├── [id].html                # Main page ✨
│   ├── main-vercel.js           # Vercel integration ✨
│   ├── firebase-config.js       # Firebase setup
│   ├── main-firebase.js         # Firebase Functions version (backup)
│   └── main.js                  # REST API version (backup)
│
├── api/                          # Vercel Functions ✨
│   ├── initiate-payment.js      # Create payment
│   ├── clickpay-webhook.js      # Process webhook
│   ├── verify-payment.js        # Verify status
│   └── package.json             # Dependencies
│
├── occasion/                     # Occasion pages
├── payment/                      # Payment result pages
├── s/                           # Short URLs
├── assets/                      # Static assets
│
├── vercel.json                  # Vercel config ✨
├── .vercelignore                # Deployment ignore ✨
├── firestore.rules              # Database security
├── firestore.indexes.json       # Database indexes
│
├── VERCEL_DEPLOYMENT.md         # Full guide ✨
├── VERCEL_QUICKSTART.md         # Quick guide ✨
├── README_VERCEL.md             # Vercel README ✨
├── env.vercel.example           # Env template ✨
│
└── package.json                 # Updated with Vercel scripts ✨
```

✨ = New files for Vercel

---

## 🎯 npm Scripts

```bash
# Vercel Commands
npm run dev              # Start Vercel dev server
npm run deploy           # Deploy to production
npm run deploy:preview   # Deploy preview
npm run logs             # View function logs

# Firebase Commands  
npm run firebase:dev     # Start Firebase emulators
npm run firebase:deploy  # Deploy to Firebase
npm run firebase:rules   # Deploy Firestore rules
```

---

## 🔐 Environment Variables

### Required Variables

| Variable | Location | Secret? |
|----------|----------|---------|
| `FIREBASE_PROJECT_ID` | Vercel | ✅ Server-side |
| `FIREBASE_CLIENT_EMAIL` | Vercel | ✅ Server-side |
| `FIREBASE_PRIVATE_KEY` | Vercel | ✅ Server-side |
| `CLICKPAY_SERVER_KEY` | Vercel | ✅ Server-side |
| `CLICKPAY_PROFILE_ID` | Vercel | ✅ Server-side |
| `CLICKPAY_API_URL` | Vercel | ✅ Server-side |
| Firebase Web Config | `firebase-config.js` | ❌ Client-side (safe) |

---

## 🌐 API Endpoints

After deployment, you'll have:

- **`POST /api/initiate-payment`**
  - Creates ClickPay payment session
  - Input: occasion, amount, payer details
  - Output: payment URL

- **`POST /api/clickpay-webhook`**
  - Receives ClickPay callbacks
  - Updates payment status
  - Updates occasion stats

- **`POST /api/verify-payment`**
  - Verifies payment completion
  - Input: paymentDocId
  - Output: payment details & status

---

## 💰 Pricing

### Vercel Costs

| Tier | Cost | Bandwidth | Functions | Best For |
|------|------|-----------|-----------|----------|
| **Hobby (Free)** | $0 | 100GB/month | 100/day | Testing |
| **Pro** | $20/month | 1TB/month | Unlimited | Production |

### Firebase Costs

- Free: 50K reads, 20K writes/day
- Paid: ~$5-20/month for 1000 transactions

### Total Estimate

- **Testing**: $0/month (free tiers)
- **Production** (500 transactions): $25-35/month
- **Scale** (2000 transactions): $30-50/month

---

## 📈 Next Steps

1. ✅ Deploy to Vercel
2. ✅ Add environment variables
3. ✅ Configure ClickPay webhook
4. ✅ Test payment flow
5. ✅ Add custom domain (optional)
6. ✅ Enable analytics
7. ✅ Monitor performance

---

## 🐛 Troubleshooting

### Issue: Vercel CLI not found

```bash
npm install -g vercel
```

### Issue: Function errors

```bash
# Check logs
vercel logs --follow

# Verify env vars
vercel env ls
```

### Issue: Firebase connection failed

1. Verify `FIREBASE_PRIVATE_KEY` format (includes `\n`)
2. Check service account permissions
3. Ensure Firestore is enabled

### Issue: ClickPay webhook not working

1. Verify URL: `https://your-project.vercel.app/api/clickpay-webhook`
2. Check ClickPay dashboard configuration
3. View logs: `vercel logs`

---

## 📚 Documentation Index

1. **VERCEL_QUICKSTART.md** - 5-minute deployment
2. **VERCEL_DEPLOYMENT.md** - Complete guide
3. **README_VERCEL.md** - Project overview
4. **ARCHITECTURE.md** - System design
5. **env.vercel.example** - Environment variables template

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Service account JSON downloaded
- [ ] `firebase-config.js` updated
- [ ] ClickPay credentials ready
- [ ] Vercel account created

During deployment:
- [ ] `vercel login` successful
- [ ] Initial deployment complete
- [ ] Environment variables added (all 6)
- [ ] Production deployment: `vercel --prod`

After deployment:
- [ ] ClickPay webhook configured
- [ ] Test occasion created in Firestore
- [ ] Collection page loads correctly
- [ ] Payment flow tested end-to-end
- [ ] Webhook receiving callbacks
- [ ] Firestore updating correctly

---

## 🎉 You're Ready to Deploy!

Everything is configured for Vercel deployment. Just follow the steps above!

**Quick Deploy Commands:**

```bash
# 1. Login
vercel login

# 2. Deploy
vercel

# 3. Add env vars (6 total)
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_CLIENT_EMAIL
vercel env add FIREBASE_PRIVATE_KEY
vercel env add CLICKPAY_SERVER_KEY
vercel env add CLICKPAY_PROFILE_ID
vercel env add CLICKPAY_API_URL

# 4. Production deploy
vercel --prod
```

---

**Need Help?** Read the full guides:
- Quick Start: [VERCEL_QUICKSTART.md](VERCEL_QUICKSTART.md)
- Full Guide: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

Made with ❤️ for the Hadawi Team




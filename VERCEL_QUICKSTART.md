# ⚡ Vercel Quick Start - 5 Minutes

Deploy your Hadawi Gift Gather to Vercel in 5 minutes!

## Step 1: Prepare Firebase (2 min)

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key" (download JSON)
5. Update `collect/firebase-config.js` with your config

## Step 2: Deploy to Vercel (1 min)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

Answer prompts:
- Deploy? **Y**
- Project name? `hadawi-gift-gather`
- Directory? **.**
- Override settings? **N**

## Step 3: Add Environment Variables (2 min)

```bash
# From the JSON file you downloaded
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_CLIENT_EMAIL
vercel env add FIREBASE_PRIVATE_KEY

# Your ClickPay credentials
vercel env add CLICKPAY_SERVER_KEY
vercel env add CLICKPAY_PROFILE_ID
vercel env add CLICKPAY_API_URL
```

**Or** add via Vercel Dashboard:
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project → Settings → Environment Variables
3. Add all 6 variables above

## Step 4: Redeploy

```bash
vercel --prod
```

## Step 5: Test! 🎉

1. Create test occasion in Firestore
2. Visit: `https://your-project.vercel.app/collect/test-gift`
3. Test payment flow

## Done! ✅

Your site is live at: `https://your-project.vercel.app`

---

## Quick Commands

```bash
# Deploy to production
vercel --prod

# View logs
vercel logs

# View deployments
vercel ls

# Add env variable
vercel env add VARIABLE_NAME
```

## Need Help?

Read the full guide: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

---

**Tip**: Connect your GitHub repo to Vercel for auto-deployments on every push!




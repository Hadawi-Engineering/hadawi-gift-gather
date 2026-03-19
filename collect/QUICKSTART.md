# 🚀 Quick Start - Collect Page

Get the collect page up and running in 5 minutes!

## Prerequisites

- Firebase project created
- ClickPay account ready
- 10 minutes of time

## Step 1: Configure Firebase (2 min)

Open `firebase-config.js` and replace these values:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",           // From Firebase Console
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456:web:abc123",
    measurementId: "G-XXXXXXXXXX"
};
```

💡 **Where to find these?**  
Firebase Console → Project Settings → Your Apps → Web App

## Step 2: Deploy to Firebase (3 min)

```bash
# Login
firebase login

# Select project
firebase use --add

# Deploy Firestore
firebase deploy --only firestore

# Deploy Functions
cd functions && npm install && cd ..
firebase deploy --only functions

# Deploy Hosting
firebase deploy --only hosting
```

## Step 3: Configure ClickPay (2 min)

```bash
# Set ClickPay credentials
firebase functions:config:set \
  clickpay.server_key="YOUR_SERVER_KEY" \
  clickpay.profile_id="YOUR_PROFILE_ID"

# Redeploy functions
firebase deploy --only functions
```

## Step 4: Create Test Occasion (2 min)

In Firebase Console → Firestore Database:

1. Create collection: `occasions`
2. Add document with:

```javascript
{
  url: "test-birthday",                    // URL slug
  occasionName: "Test Birthday",
  receiverName: "Ahmed",
  occasionDate: (select future date),
  type: "Birthday",
  giftType: "Cash",
  giftPrice: 500,
  amountForEveryone: 50,
  totalCollected: 0,
  contributorCount: 0
}
```

## Step 5: Test! (1 min)

Visit: `https://YOUR_PROJECT.web.app/collect/test-birthday`

🎉 **Done!** You should see the collection page.

## Common Issues

### "Firebase not defined"
→ Check `firebase-config.js` has correct values

### "Function not found"
→ Run: `firebase deploy --only functions`

### "Occasion not found"
→ Check Firestore has occasion with matching `url` field

### "Payment fails"
→ Check Functions logs: `firebase functions:log`

## File Overview

```
collect/
├── [id].html          ← Main HTML page (loads occasion by URL)
├── main-firebase.js   ← Firebase integration (recommended)
├── main.js            ← REST API version (legacy)
└── firebase-config.js ← Firebase credentials (⚠️ UPDATE THIS!)
```

## Next Steps

1. ✅ Test payment flow
2. ✅ Configure webhook in ClickPay dashboard
3. ✅ Add custom domain
4. ✅ Enable analytics
5. ✅ Add more occasions

## Need Help?

- 📖 Read `SETUP.md` for detailed instructions
- 🏗️ Read `ARCHITECTURE.md` for system overview
- 📝 Check Firebase Functions logs
- 🔍 Check browser console for errors

---

**Quick Tip**: Use `firebase emulators:start` to test locally before deploying!





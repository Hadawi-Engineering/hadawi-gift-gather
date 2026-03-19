# 🎁 Hadawi Gift Gather - Vercel Deployment

Beautiful gift collection platform with Firebase Firestore + ClickPay, hosted on Vercel.

## 🌟 Features

- 🎉 **Collaborative Gift Giving** - Share occasions, collect contributions
- 💳 **ClickPay Integration** - Secure payment processing for MENA region
- 🌍 **Bilingual** - Full Arabic and English support with RTL
- 🔥 **Firebase Firestore** - Real-time database
- ⚡ **Vercel Serverless** - Auto-scaling API functions
- 📱 **Mobile Responsive** - Beautiful on all devices

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/hadawi-gift-gather)

## 📁 Project Structure

```
hadawi-gift-gather/
├── collect/                # Collection pages
│   ├── [id].html          # Main page
│   ├── main-vercel.js     # Vercel integration
│   └── firebase-config.js # Firebase setup
├── api/                    # Vercel Serverless Functions
│   ├── initiate-payment.js
│   ├── clickpay-webhook.js
│   └── verify-payment.js
└── vercel.json            # Vercel configuration
```

## ⚡ Quick Start

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd hadawi-gift-gather
npm install
```

### 2. Setup Firebase

1. Create Firebase project
2. Enable Firestore
3. Get service account JSON
4. Update `collect/firebase-config.js`

### 3. Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel
```

### 4. Add Environment Variables

```bash
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_CLIENT_EMAIL
vercel env add FIREBASE_PRIVATE_KEY
vercel env add CLICKPAY_SERVER_KEY
vercel env add CLICKPAY_PROFILE_ID
vercel env add CLICKPAY_API_URL
```

### 5. Deploy Production

```bash
vercel --prod
```

## 📚 Documentation

- 📖 [Full Deployment Guide](VERCEL_DEPLOYMENT.md) - Complete setup instructions
- ⚡ [Quick Start](VERCEL_QUICKSTART.md) - 5-minute deployment
- 🏗️ [Architecture](ARCHITECTURE.md) - System design

## 🔧 Local Development

```bash
# Install Vercel CLI
npm install -g vercel

# Pull environment variables
vercel env pull

# Start dev server
vercel dev
```

Visit: `http://localhost:3000`

## 🌐 API Endpoints

Your Vercel deployment provides these APIs:

- `POST /api/initiate-payment` - Create ClickPay session
- `POST /api/clickpay-webhook` - Payment callbacks
- `POST /api/verify-payment` - Verify payment status

## 📊 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Database**: Firebase Firestore
- **Backend**: Vercel Serverless Functions (Node.js)
- **Hosting**: Vercel (CDN + SSL)
- **Payment**: ClickPay Gateway

## 🔐 Security

- ✅ Server-side payment processing
- ✅ Firestore security rules
- ✅ Environment variables for secrets
- ✅ HTTPS enforced
- ✅ CORS configured

## 💰 Cost

### Free Tier (Perfect for Testing)
- Vercel: 100GB bandwidth, 100 functions/day
- Firebase: 50K reads, 20K writes/day
- **Total: $0/month**

### Production Scale
- Vercel Pro: $20/month (unlimited)
- Firebase: ~$10-20/month
- **Total: $30-40/month** for 1000+ transactions

## 📈 Monitoring

```bash
# View logs
vercel logs --follow

# List deployments
vercel ls

# Check status
vercel inspect
```

## 🐛 Troubleshooting

### Functions Not Working?

```bash
# Check logs
vercel logs

# Verify environment variables
vercel env ls
```

### Firebase Connection Issues?

1. Verify service account credentials
2. Check Firestore rules
3. Ensure indexes are deployed

### ClickPay Webhook Not Receiving?

1. Verify webhook URL in ClickPay dashboard
2. Check function logs: `vercel logs`
3. Test with ClickPay test tool

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Push and create PR

## 📝 License

Proprietary - All rights reserved

## 📞 Support

For support: support@hadawi.sa

## 🎯 Roadmap

- [ ] Apple Pay integration
- [ ] STC Pay integration
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Admin dashboard
- [ ] Analytics dashboard

---

Made with ❤️ by the Hadawi Team

**Live Demo**: [hadawi-gift-gather.vercel.app](https://hadawi-gift-gather.vercel.app)




# 🎁 Hadawi Gift Gather

A beautiful web platform for collaborative gift giving, powered by Firebase and integrated with ClickPay for seamless payment processing.

## 🌟 Features

- 🎉 **Occasion Management** - Create and share gift occasions
- 💳 **Payment Integration** - Secure payments via ClickPay
- 🌍 **Bilingual Support** - Full Arabic and English support with RTL
- 🔥 **Firebase Backend** - Real-time data with Firestore
- 📱 **Mobile Responsive** - Beautiful UI on all devices
- 🔐 **Secure** - Server-side payment processing with Cloud Functions

## 📁 Project Structure

```
hadawi-gift-gather/
├── collect/              # Gift collection pages (Firebase-powered)
│   ├── [id].html        # Main collection page
│   ├── main-firebase.js # Firebase integration
│   ├── main.js          # Legacy REST API version
│   └── firebase-config.js
├── occasion/            # Occasion detail pages
│   └── [id].html
├── payment/             # Payment result pages
│   ├── result.html
│   └── success.html
├── s/                   # Short URLs
│   └── [id].html
├── functions/           # Firebase Cloud Functions
│   ├── index.js         # ClickPay integration
│   └── package.json
├── assets/              # Static assets
├── firebase.json        # Firebase configuration
├── firestore.rules      # Database security rules
├── firestore.indexes.json
├── env.example          # Environment variables template
└── index.html           # Landing page
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created
- ClickPay account with API credentials

### 1. Clone and Install

```bash
git clone <repository-url>
cd hadawi-gift-gather
```

### 2. Configure Environment

```bash
# Copy environment template
cp env.example .env

# Edit .env with your credentials
# - Firebase configuration
# - ClickPay API keys
```

### 3. Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize project (if not already)
firebase init

# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Install function dependencies
cd functions
npm install
cd ..

# Configure Cloud Functions environment
firebase functions:config:set \
  clickpay.server_key="YOUR_SERVER_KEY" \
  clickpay.profile_id="YOUR_PROFILE_ID"
```

### 4. Deploy

```bash
# Deploy everything
firebase deploy

# Or deploy individually
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore
```

## 🔧 Development

### Local Development

```bash
# Start Firebase emulators
firebase emulators:start

# This starts:
# - Firestore Emulator (port 8080)
# - Functions Emulator (port 5001)
# - Hosting Emulator (port 5000)
```

### Project runs at:
- **Hosting**: http://localhost:5000
- **Firestore UI**: http://localhost:4000
- **Functions**: http://localhost:5001

## 🔑 Environment Variables

Create a `.env` file based on `env.example`:

```env
# Firebase (Client-side - safe to expose)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# ClickPay (Server-side only)
CLICKPAY_SERVER_KEY=
CLICKPAY_PROFILE_ID=
CLICKPAY_API_URL=https://secure.clickpay.com.sa
```

## 🗄️ Database Structure

### Firestore Collections

#### `occasions`
Stores gift occasion information
```javascript
{
  url: "unique-slug",
  occasionName: "Birthday Party",
  receiverName: "Ahmed",
  occasionDate: Timestamp,
  type: "Birthday",
  giftType: "Cash",
  giftPrice: 500,
  amountForEveryone: 50,
  totalCollected: 0,
  contributorCount: 0
}
```

#### `payments`
Tracks payment transactions
```javascript
{
  occasionId: "occasion-ref",
  amount: 50,
  payerName: "Mohammed",
  payerEmail: "email@example.com",
  status: "completed",
  transactionRef: "HADAWI-xxx",
  clickPayTransactionRef: "xxx"
}
```

## 💳 Payment Flow

1. User visits collection page
2. Fills contribution form
3. Submits payment
4. Cloud Function creates ClickPay session
5. User redirects to ClickPay
6. Completes payment
7. ClickPay webhook notifies our backend
8. Payment status updated in Firestore
9. User redirects to success page

## 🔐 Security

- ✅ Firestore security rules protect data
- ✅ ClickPay keys secured in Cloud Functions
- ✅ Server-side payment validation
- ✅ HTTPS only in production
- ✅ CORS configured properly

## 🌍 Deployment

### Production Deployment

```bash
# Build and deploy
firebase deploy --only hosting,functions,firestore

# Deploy specific parts
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

### Custom Domain

1. Add domain in Firebase Console
2. Update DNS records
3. SSL certificates auto-generated

## 📱 Features

### ✨ Bilingual Support
- Full Arabic and English translations
- RTL layout support
- Dynamic language switching

### 🎨 Beautiful UI
- Modern gradient backgrounds
- Smooth animations
- Mobile-first responsive design
- Animated blob backgrounds

### 🔄 Real-time Updates
- Live payment statistics
- Instant goal achievement display
- Contributor count updates

### 💰 Payment Features
- Secure ClickPay integration
- Multiple payment methods
- Receipt generation
- Payment verification

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 Modules), HTML5, CSS3
- **Backend**: Firebase Cloud Functions (Node.js)
- **Database**: Cloud Firestore
- **Hosting**: Firebase Hosting
- **Payment**: ClickPay Payment Gateway
- **CDN**: Firebase CDN with global distribution

## 📊 Monitoring

### View Logs

```bash
# Function logs
firebase functions:log

# Realtime logs
firebase functions:log --only initiateClickPayPayment
```

### Performance Monitoring

Enable in Firebase Console:
- Performance Monitoring
- Analytics
- Crashlytics (for mobile apps)

## 🧪 Testing

### Test Payment Flow

1. Use ClickPay test credentials
2. Run local emulators
3. Test with various scenarios:
   - Successful payment
   - Failed payment
   - Cancelled payment
   - Network errors

### Test Firestore Rules

```bash
firebase emulators:exec --only firestore "npm test"
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is proprietary and confidential.

## 📞 Support

For support, email support@hadawi.sa or visit our website.

## 🎯 Roadmap

- [ ] Add Apple Pay support
- [ ] Add STC Pay integration
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Admin dashboard
- [ ] Analytics dashboard
- [ ] Gift recommendations
- [ ] Social sharing features

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- ClickPay for payment processing
- Google Fonts for typography
- Contributors and supporters

---

Made with ❤️ by the Hadawi Team





# 🏗️ Hadawi Gift Gather - System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          User Browser                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Hadawi Collection Page                       │  │
│  │         /collect/[id].html + main-firebase.js            │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────┬─────────────────────────────────┬─────────────────┘
             │                                   │
             │ 1. Fetch Occasion                │ 3. Initiate Payment
             │    Data (Firestore)               │    (Cloud Function)
             ▼                                   ▼
┌─────────────────────────┐         ┌──────────────────────────┐
│                         │         │   Firebase Functions      │
│   Cloud Firestore       │         │                          │
│                         │         │  ┌────────────────────┐  │
│  ┌──────────────────┐  │◄────────┼──┤ initiateClickPay   │  │
│  │   occasions      │  │ Update  │  │ Payment            │  │
│  │   - url          │  │ Stats   │  └─────────┬──────────┘  │
│  │   - giftPrice    │  │         │            │              │
│  │   - contributors │  │         │  ┌─────────▼──────────┐  │
│  └──────────────────┘  │         │  │ clickPayWebhook    │  │
│                         │         │  │ (Payment callback) │  │
│  ┌──────────────────┐  │         │  └─────────┬──────────┘  │
│  │   payments       │  │◄────────┼────────────┘              │
│  │   - status       │  │ Update  │                           │
│  │   - amount       │  │         │  ┌────────────────────┐  │
│  │   - transactionRef│ │         │  │ verifyPayment      │  │
│  └──────────────────┘  │         │  │ Status             │  │
│                         │         │  └────────────────────┘  │
└─────────────────────────┘         └──────────┬───────────────┘
                                               │
                                               │ 4. Create Payment
                                               │    Session
                                               ▼
                                    ┌──────────────────────────┐
                                    │    ClickPay Gateway       │
                                    │                          │
                                    │  - Payment Processing    │
                                    │  - Card Validation       │
                                    │  - 3DS Authentication    │
                                    │                          │
                                    └──────────┬───────────────┘
                                               │
                                               │ 5. Webhook
                                               │    Notification
                                               ▼
                                    ┌──────────────────────────┐
                                    │   Success/Failure        │
                                    │   /payment/result.html   │
                                    └──────────────────────────┘
```

## Data Flow

### 1️⃣ Load Occasion Details

```javascript
User visits: /collect/birthday-123

→ main-firebase.js extracts "birthday-123"
→ Queries Firestore: WHERE url == "birthday-123"
→ Fetches occasion data
→ Queries payments: WHERE occasionId == occasion.id AND status == "completed"
→ Calculates statistics (totalPayments, contributorCount)
→ Renders page with data
```

### 2️⃣ User Submits Payment

```javascript
User fills form (name, email, phone, message)

→ Validates form data
→ Creates pending payment in Firestore
→ Calls Cloud Function: initiateClickPayPayment()
→ Function creates ClickPay session
→ Returns payment URL
→ Browser redirects to ClickPay
```

### 3️⃣ Payment Processing

```javascript
User completes payment on ClickPay

→ ClickPay processes transaction
→ ClickPay POSTs to webhook: /clickPayWebhook
→ Function validates webhook data
→ Updates payment status in Firestore
→ Updates occasion statistics
→ ClickPay redirects user back
```

### 4️⃣ Payment Verification

```javascript
User returns to result page

→ Retrieves paymentDocId from sessionStorage
→ Calls: verifyPaymentStatus()
→ Function fetches payment from Firestore
→ Returns status (completed/failed/pending)
→ Displays appropriate message
```

## Database Schema

### Firestore Structure

```
hadawi-gift-gather (database)
│
├── occasions/
│   └── {occasionId}
│       ├── url: string                    # Unique URL slug
│       ├── occasionName: string           # "Ahmed's Birthday"
│       ├── receiverName: string           # "Ahmed"
│       ├── occasionDate: Timestamp        # Event date
│       ├── type: string                   # "Birthday", "Wedding", etc.
│       ├── giftType: string               # "Cash", "Gift Card"
│       ├── giftName: string               # Optional gift name
│       ├── giftPrice: number              # Total gift price (500)
│       ├── amountForEveryone: number      # Per-person amount (50)
│       ├── note: string                   # Optional message
│       ├── totalCollected: number         # Sum of completed payments
│       ├── contributorCount: number       # Number of contributors
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
│
└── payments/
    └── {paymentId}
        ├── occasionId: string             # Reference to occasion
        ├── amount: number                 # Payment amount
        ├── payerName: string              # Contributor name
        ├── payerPhone: string             # Phone number
        ├── payerEmail: string             # Email address
        ├── message: string                # Personal message
        ├── currency: string               # "SAR"
        ├── status: string                 # "pending|initiated|completed|failed"
        ├── transactionRef: string         # Our reference
        ├── clickPayTransactionRef: string # ClickPay reference
        ├── clickPayResponse: object       # Full webhook data
        ├── createdAt: Timestamp
        ├── updatedAt: Timestamp
        └── completedAt: Timestamp         # When payment completed
```

## Security Architecture

### Client-Side Security

```javascript
✅ Firebase config exposed (safe - not a secret)
✅ Read-only access to occasions collection
✅ Limited write access to payments (pending only)
❌ No ClickPay keys in client-side code
❌ Cannot update payment status from client
❌ Cannot modify occasion data from client
```

### Server-Side Security (Cloud Functions)

```javascript
✅ ClickPay keys secured in environment
✅ Payment validation before ClickPay call
✅ Webhook signature verification
✅ Transaction amount validation
✅ Duplicate payment prevention
✅ Rate limiting (Firebase built-in)
```

### Firestore Security Rules

```javascript
// Occasions: Read-only for everyone
match /occasions/{occasionId} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.token.admin == true;
}

// Payments: Limited access
match /payments/{paymentId} {
  allow read: if resource.data.payerEmail == request.auth.token.email;
  allow create: if request.resource.data.status == 'pending';
  allow update, delete: if false;  // Only Cloud Functions can update
}
```

## API Endpoints

### Cloud Functions

#### `initiateClickPayPayment`
- **Type**: Callable Function
- **Input**: 
  ```javascript
  {
    paymentDocId: string,
    occasionId: string,
    amount: number,
    payerName: string,
    payerPhone: string,
    payerEmail: string,
    message: string,
    currency: string,
    language: string
  }
  ```
- **Output**:
  ```javascript
  {
    success: true,
    paymentUrl: string,
    transactionRef: string,
    clickPayTransactionRef: string
  }
  ```

#### `clickPayWebhook`
- **Type**: HTTP Function
- **Method**: POST
- **URL**: `https://region-project.cloudfunctions.net/clickPayWebhook`
- **Input**: ClickPay webhook payload
- **Output**: Status code 200/400/500

#### `verifyPaymentStatus`
- **Type**: Callable Function
- **Input**: 
  ```javascript
  {
    paymentDocId: string
  }
  ```
- **Output**:
  ```javascript
  {
    success: true,
    status: string,
    amount: number,
    occasionId: string,
    transactionRef: string,
    completedAt: Timestamp
  }
  ```

## Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **JavaScript (ES6+)** - ES Modules, async/await
- **Firebase SDK** - Firestore, Functions, Analytics

### Backend
- **Firebase Cloud Functions** - Serverless Node.js 18
- **Cloud Firestore** - NoSQL database
- **Firebase Hosting** - Static site hosting + CDN

### Payment Gateway
- **ClickPay** - Payment processing for MENA region
- **Supported Methods**: Visa, Mastercard, Mada, Apple Pay (future)

### DevOps
- **Firebase CLI** - Deployment and management
- **Git** - Version control
- **GitHub Actions** - CI/CD (optional)

## Scalability Considerations

### Performance

```
Expected Load:
├── Concurrent Users: 1,000+
├── Transactions/Day: 500-1,000
└── Database Reads: 10,000+/day

Optimizations:
├── Firebase CDN (automatic)
├── Firestore indexes for queries
├── Cloud Functions auto-scaling
└── Client-side caching
```

### Cost Optimization

```
Firebase Free Tier:
├── Firestore: 50K reads/day, 20K writes/day
├── Functions: 125K invocations/month
├── Hosting: 10GB storage, 360MB/day transfer

Estimated Monthly Cost (paid tier):
├── Firestore: $5-20 (depends on usage)
├── Functions: $10-30 (depends on traffic)
├── Hosting: Free (under 10GB)
└── Total: $15-50/month for moderate usage
```

## Monitoring & Observability

### Key Metrics to Monitor

1. **Payment Success Rate**
   - Target: >95%
   - Alert if: <90%

2. **Function Execution Time**
   - Target: <2 seconds
   - Alert if: >5 seconds

3. **Database Reads/Writes**
   - Monitor for quota limits
   - Optimize queries if high

4. **Error Rate**
   - Target: <1%
   - Alert on spikes

### Logging Strategy

```javascript
// Function logs
console.log('Info: Payment initiated', { occasionId, amount });
console.warn('Warning: High payment amount', { amount });
console.error('Error: ClickPay API failed', { error });

// View logs
firebase functions:log --only initiateClickPayPayment
```

## Disaster Recovery

### Backup Strategy

```
Firestore Backups:
├── Automatic daily backups (Firebase)
├── Point-in-time recovery (7 days)
└── Export to Cloud Storage (weekly)

Function Versioning:
├── Git version control
├── Function deployment history
└── Rollback capability
```

### Incident Response

```
Payment Failure:
1. Check Cloud Functions logs
2. Verify ClickPay status
3. Check Firestore records
4. Contact user if needed
5. Manual refund if required

System Outage:
1. Check Firebase Status
2. Check ClickPay Status
3. Enable maintenance mode
4. Communicate with users
5. Post-mortem after resolution
```

## Future Enhancements

### Phase 2
- [ ] Apple Pay integration
- [ ] STC Pay integration
- [ ] Email notifications
- [ ] SMS notifications via Twilio

### Phase 3
- [ ] Admin dashboard
- [ ] Analytics dashboard
- [ ] User accounts
- [ ] Recurring payments

### Phase 4
- [ ] Mobile app (Flutter)
- [ ] Gift recommendations
- [ ] Social sharing
- [ ] Multi-currency support

---

Last Updated: 2025-10-26





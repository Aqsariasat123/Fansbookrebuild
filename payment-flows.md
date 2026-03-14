# Payment Flows — Complete Analysis

## All Payment-Related Features

### 1. Coin Purchase (Fan buys coins)

- **Route**: `POST /api/wallet/purchase`
- **File**: `apps/server/src/routes/wallet.ts`
- **Status**: DEMO — instantly credits, no real payment
- **Packages**: 100/€5, 250/€10, 500/€20, 1000/€35, 2500/€75, 5000/€125
- **Needs**: Real payment gateway (CCBill/MirexPay/Stripe)

### 2. Subscriptions (Fan subscribes to creator tier)

- **Route**: `POST /api/subscriptions`
- **File**: `apps/server/src/routes/subscriptions.ts`
- **Status**: IMPLEMENTED — deducts from wallet, 20% platform fee
- **Price range**: $1 - $1,000, Duration: 30 days

### 3. Tips (Fan tips creator)

- **Route**: `POST /api/tips`
- **File**: `apps/server/src/routes/tips.ts`
- **Status**: IMPLEMENTED — wallet deduction, 20% fee
- **Range**: $1 - $10,000

### 4. PPV Content (Fan unlocks paid post)

- **Route**: `POST /api/posts/:id/ppv-unlock`
- **File**: `apps/server/src/routes/posts-ppv.ts`
- **Status**: IMPLEMENTED — wallet deduction, 20% fee
- **Range**: $1 - $500

### 5. Paid Messages (Fan pays to DM creator)

- **Route**: `POST /api/messages/:conversationId/unlock`
- **File**: `apps/server/src/routes/messages-paid.ts`
- **Status**: IMPLEMENTED — first message only, creator sets price

### 6. Marketplace Fixed Price

- **Route**: `POST /api/marketplace/:id/buy`
- **File**: `apps/server/src/routes/marketplace.ts`
- **Status**: IMPLEMENTED — wallet deduction

### 7. Marketplace Auction (Bidding)

- **Route**: `POST /api/marketplace/:id/bid`
- **File**: `apps/server/src/routes/marketplace-bids.ts`
- **Status**: IMPLEMENTED — bid hold/release, anti-sniping (5min extension)

### 8. Creator Withdrawals

- **Route**: `POST /api/creator/wallet/withdraw`
- **File**: `apps/server/src/routes/creator-wallet.ts`
- **Status**: PARTIAL — request saved, admin approves, NO real bank payout
- **Min**: $20

### 9. Payment Gateway

- **Route**: `POST /api/payments/initiate`
- **File**: `apps/server/src/routes/payment-gateway.ts`
- **Status**: SIMULATED — creates record, returns fake checkout URL
- **Gateways**: CCBill, MirexPay (both simulated)

### 10. Payment Webhooks

- **Route**: `POST /api/payments/webhook/ccbill` & `/mirexpay`
- **File**: `apps/server/src/routes/payment-webhooks.ts`
- **Status**: SIMULATED — accepts data, no signature verification

### 11. Referral Earnings

- **File**: `apps/server/src/routes/creator-referrals.ts`
- **Status**: INCOMPLETE — code generation works, no commission calculation

### 12. Admin Finance

- **Routes**: `/api/admin/finance/withdrawals`, `/earnings`, `/subscriptions`
- **Status**: IMPLEMENTED — view, search, bulk approve/reject

## Fee Structure (from shared constants)

- Platform fee: 20% on all creator earnings
- Min subscription: $1, Max: $1,000
- Min tip: $1, Max: $10,000
- Min PPV: $1, Max: $500
- Min listing: $1, Max: $50,000
- Min withdrawal: $20

## Transaction Types (11)

DEPOSIT, SUBSCRIPTION, TIP_SENT, TIP_RECEIVED, PPV_PURCHASE, PPV_EARNING, WITHDRAWAL, REFUND, BID_HOLD, BID_RELEASE, MARKETPLACE_PURCHASE, MARKETPLACE_EARNING

## What Client Must Provide

1. **Payment Gateway**: CCBill/MirexPay/Stripe account + API keys
2. **Payout Processor**: Stripe Connect/Wise/PayPal for creator bank payouts
3. **Business Decisions**: Fee %, coin pricing, withdrawal min, payout schedule
4. **SMTP** (DONE): catalyst@theredstone.ai configured on production

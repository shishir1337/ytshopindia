# YouTube Channel Purchase Flow

## Overview
This document outlines the complete flow when a user wants to buy a YouTube channel through the YT SHOP INDIA platform.

## Current Flow

### Step 1: Browse Channels
- **Location**: `/buy-channel`
- User browses available channels
- Can filter by category, subscribers, monetization status, etc.
- Only channels with `status: "approved"` are displayed

### Step 2: View Channel Details
- **Location**: `/buy-channel/[id]`
- User clicks on a channel card to view full details
- Page shows:
  - Channel images (carousel)
  - Title, description, listing ID
  - Channel stats (subscribers, views, videos, etc.)
  - Monetization status
  - Revenue details
  - Channel health (strikes)
  - Expected price

### Step 3: Choose Purchase Method
User has **TWO options**:

#### Option A: Buy with Crypto (Recommended)
- **Button**: "Buy with Crypto"
- **Action**: Redirects to `/checkout/[listingId]`
- Goes through automated checkout and payment

#### Option B: Buy with WhatsApp
- **Button**: "Buy with WhatsApp"
- **Action**: Opens WhatsApp chat with pre-filled message
- **Phone**: Currently hardcoded to `919999999999` (needs update)
- **Message**: Includes channel title and listing ID
- Manual process - no automated checkout

---

## Automated Crypto Purchase Flow (Option A)

### Step 4: Checkout Page
**Location**: `/checkout/[listingId]`

**For Logged-in Users:**
- Displays user's name and email (auto-filled)
- Shows "Logged in as: [name/email]"

**For Guest Users:**
- Requires:
  - Full Name (required)
  - Email Address (required, validated)
- Email stored in localStorage for later order access

**Validation:**
- Email format validation (regex)
- Real-time validation feedback
- Link to login if user has account

### Step 5: Create Order
**API**: `POST /api/orders`

**Process:**
1. Validates listing exists and is approved
2. Checks if channel is already sold (looks for existing paid orders)
3. Gets user session (if logged in)
4. Validates email (required for guests)
5. **Price Conversion**:
   - Converts INR to USD using exchange rate API
   - Formats amount for Cryptomus payment gateway
6. Creates order in database with status: `pending`
7. Creates Cryptomus invoice with:
   - Amount in USD
   - Order ID
   - Return URLs (success, callback, return)
   - Payment expiration: 60 minutes
8. Updates order with Cryptomus payment details:
   - Invoice ID
   - Order ID
   - Payment URL
   - Payment network (TRC20, BSC, ETH, etc.)
   - Payment address (crypto wallet)
   - Payment amount (in crypto)
   - Expiration timestamp

**Response:**
- Returns order ID
- Redirects to `/payment/[orderId]`

### Step 6: Payment Page
**Location**: `/payment/[orderId]`

**Features:**
- Displays payment details:
  - Order ID
  - Amount (USD)
  - Payment network
  - Payment amount (crypto)
  - Payment address (wallet)
  - Expiration time
- Copy address button
- "Pay with Cryptomus" button (opens Cryptomus payment page)
- "Check Payment Status" button (manual check)
- Auto-polls payment status every 10 seconds

**Access Control:**
- Logged-in users: Access via session
- Guest users: Requires email verification (stored in localStorage)
- If email not found: Prompts user to enter email

**Payment Status Checking:**
- API: `POST /api/orders/[id]/check-payment`
- Queries Cryptomus API for payment status
- Updates order status in database

### Step 7: Payment Processing

**Payment Status Flow:**
1. User sends crypto to payment address
2. Cryptomus detects payment
3. Cryptomus sends webhook to `/api/webhooks/cryptomus`

**Webhook Processing:**
- Verifies webhook signature
- Updates order status based on payment status:
  - `paid` → Order status: `paid`
  - `expired` → Order status: `expired`
  - `cancelled` → Order status: `cancelled`
- Marks channel listing as `sold`
- Sends emails:
  - Order confirmation to customer
  - Order completed to customer
  - Payment notification to admin

### Step 8: Post-Payment

**After Payment Confirmed:**
- Order status: `paid`
- Channel status: `sold`
- User sees success message on payment page
- Email notifications sent
- Link to dashboard appears

**Next Steps** (Manual - Admin Process):
- Admin marks order as `delivered`
- Delivery details added (credentials, access info)
- Customer receives delivery details via email

---

## Manual WhatsApp Purchase Flow (Option B)

1. User clicks "Buy with WhatsApp"
2. WhatsApp opens with pre-filled message
3. User communicates with seller/admin manually
4. Payment arranged outside platform
5. No automated order tracking
6. Manual delivery process

---

## Order Status Flow

```
pending → paid → delivered → completed
   ↓        ↓
expired  cancelled
```

**Status Definitions:**
- `pending`: Order created, waiting for payment
- `paid`: Payment confirmed, awaiting delivery
- `delivered`: Channel access provided to buyer
- `completed`: Order fully processed
- `expired`: Payment window expired (60 minutes)
- `cancelled`: Payment cancelled

---

## Database Models

### ChannelListing
- Must have `status: "approved"` to be purchasable
- `expectedPrice` and `currency` required for checkout
- Status changes to `sold` after first paid order

### Order
- Links to `channelListingId`
- Can have `userId` (logged-in) or `guestEmail` (guest)
- Stores original price (INR) and converted amount (USD)
- Stores Cryptomus payment details
- Tracks payment and order status

---

## Issues & Improvements Needed

### 1. Hardcoded WhatsApp Number
- **Location**: `app/buy-channel/[id]/page.tsx` line 109
- **Current**: `919999999999`
- **Needs**: Dynamic number from site settings or environment variable

### 2. No Order History for Guests
- Guest users can't easily access their orders
- Relies on email links or manual order ID lookup

### 3. Missing Delivery Workflow
- No admin interface for marking orders as delivered
- No automated delivery notification system
- Delivery details field exists but no UI

### 4. No Duplicate Order Prevention
- Users can create multiple pending orders for same channel
- Should prevent multiple pending orders per channel

### 5. Exchange Rate Caching
- Exchange rate fetched on each order creation
- Should cache rates to avoid API limits

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/orders` | POST | Create new order |
| `/api/orders` | GET | List user's orders (logged-in only) |
| `/api/orders/[id]` | GET | Get order details |
| `/api/orders/[id]/check-payment` | POST | Check payment status |
| `/api/webhooks/cryptomus` | POST | Payment webhook from Cryptomus |

---

## Security Features

1. **Order Access Control**:
   - Logged-in users: Can only access their own orders
   - Guest users: Must provide email for verification

2. **Webhook Verification**:
   - Cryptomus webhooks verified with signature

3. **Email Validation**:
   - Regex validation on frontend and backend
   - Required for guest checkout

4. **Listing Validation**:
   - Only approved listings can be purchased
   - Sold listings cannot be purchased again

---

## Email Notifications

1. **Order Confirmation** (when payment confirmed)
   - Sent to customer
   - Contains order ID and channel details

2. **Order Completed** (when payment confirmed)
   - Sent to customer
   - Confirms payment received

3. **Payment Admin Notification** (when payment confirmed)
   - Sent to admin
   - Notifies of new paid order

4. **Order Delivered** (when admin marks as delivered)
   - Sent to customer
   - Contains delivery details and channel access info


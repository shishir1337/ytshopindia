# Implementation Plan: Channel Access Email Dialog

## Overview
Add an email selection dialog before checkout that collects the "channel access email" - the email address where the buyer wants to receive channel access. This email will be used by admins to assign channel access after purchase.

## Changes Required

### 1. Database Schema Changes
**File**: `prisma/schema.prisma`

Add new field to Order model:
```prisma
channelAccessEmail  String?  // Email designated for channel access (separate from user/guest email)
```

**Migration**: Create new migration for this field

---

### 2. New Component: Channel Access Email Dialog
**File**: `app/buy-channel/[id]/components/channel-access-dialog.tsx` (NEW)

**Features**:
- Dialog/modal component
- For logged-in users:
  - Dropdown showing account email (from session)
  - Option to enter custom email
  - Radio buttons or select: "Use my account email" vs "Use different email"
- For guest users:
  - Simple email input field
- Email validation
- "Continue" button that:
  - Validates email
  - Stores email (localStorage or query param)
  - Navigates to `/checkout/[listingId]?accessEmail=[email]`

**Props**:
- `listingId: string`
- `isOpen: boolean`
- `onClose: () => void`
- `userEmail?: string` (for logged-in users)

---

### 3. Update Buy Channel Page
**File**: `app/buy-channel/[id]/page.tsx`

**Changes**:
- Convert "Buy with Crypto" button from Link to Button with onClick
- Add state for dialog open/close
- Pass user session email to dialog (if logged in)
- Import and render ChannelAccessDialog component

**Flow**:
```
Click "Buy with Crypto" → Open Dialog → Select/Enter Email → Click Continue → Navigate to Checkout
```

---

### 4. Update Checkout Page
**File**: `app/checkout/[listingId]/page.tsx`

**Changes**:
- Remove name and email input fields (for both guest and logged-in)
- Get `channelAccessEmail` from query params (`?accessEmail=...`)
- If no email in query params, redirect back to listing page with error
- Simplify checkout to just show:
  - Order summary (channel details, price)
  - Payment method info
  - "Proceed to Payment" button
- Pass `channelAccessEmail` to order creation API

**Simplified UI**:
- Remove guest name/email fields
- Remove logged-in user info display
- Just show order summary and proceed button

---

### 5. Update Order Creation API
**File**: `app/api/orders/route.ts`

**Changes**:
- Accept `channelAccessEmail` in request body
- Validate `channelAccessEmail` (required, valid email format)
- Store `channelAccessEmail` in order record
- Keep existing `guestEmail`/`userEmail` logic for order notifications
- `channelAccessEmail` is separate - used for channel access assignment

**Request Body**:
```typescript
{
  listingId: string
  channelAccessEmail: string  // NEW - required
  guestEmail?: string  // Still needed for guest order notifications
  guestName?: string   // Still needed for guest order notifications
}
```

**Logic**:
- For logged-in users: `userId` set, `guestEmail`/`guestName` null
- For guest users: `userId` null, `guestEmail`/`guestName` set
- `channelAccessEmail` set for both (from dialog)

---

### 6. Update Order Model Usage
**Files**: All files that read/display orders

**Changes**:
- Display `channelAccessEmail` in admin order views
- Use `channelAccessEmail` for delivery/access assignment
- Keep `guestEmail`/`userEmail` for notifications

**Files to update**:
- `app/(admin)/admin/orders/page.tsx` - Show channel access email
- `app/(admin)/admin/orders/[id]/page.tsx` - Display and allow editing
- `app/api/admin/orders/[id]/route.ts` - Handle channel access email updates

---

### 7. Update Email Notifications
**File**: `lib/email.ts` and related email components

**Changes**:
- Keep using `userEmail`/`guestEmail` for order notifications
- Add `channelAccessEmail` to delivery emails
- Update delivery email template to mention channel access email

---

### 8. Update Order Access Logic
**File**: `lib/order-access.ts`

**Changes**:
- Keep existing logic (userId or guestEmail for access)
- `channelAccessEmail` is for admin use only, not for access control

---

## Implementation Steps

### Phase 1: Database & Schema
1. ✅ Add `channelAccessEmail` field to Order model
2. ✅ Create and run migration
3. ✅ Regenerate Prisma client

### Phase 2: Dialog Component
1. ✅ Create `channel-access-dialog.tsx` component
2. ✅ Add email validation
3. ✅ Handle logged-in vs guest states
4. ✅ Implement navigation to checkout with email

### Phase 3: Buy Channel Page Updates
1. ✅ Convert "Buy with Crypto" to open dialog
2. ✅ Add dialog state management
3. ✅ Pass user email to dialog (if logged in)
4. ✅ Test dialog flow

### Phase 4: Checkout Page Simplification
1. ✅ Remove name/email fields
2. ✅ Get email from query params
3. ✅ Add validation/redirect if no email
4. ✅ Simplify UI to payment-focused

### Phase 5: API Updates
1. ✅ Update order creation to accept `channelAccessEmail`
2. ✅ Validate and store `channelAccessEmail`
3. ✅ Update order response to include `channelAccessEmail`

### Phase 6: Admin Updates
1. ✅ Display `channelAccessEmail` in admin order views
2. ✅ Allow editing `channelAccessEmail` in admin
3. ✅ Use `channelAccessEmail` for delivery process

### Phase 7: Testing & Cleanup
1. ✅ Test logged-in user flow
2. ✅ Test guest user flow
3. ✅ Test email validation
4. ✅ Test order creation
5. ✅ Test admin order management
6. ✅ Remove unused code

---

## Data Flow

### Logged-in User:
```
Buy Channel Page → Click "Buy with Crypto" → Dialog opens
→ Shows account email + option for custom email
→ User selects/enters email → Continue
→ Navigate to /checkout/[id]?accessEmail=[email]
→ Checkout page gets email from query
→ Create order with userId + channelAccessEmail
```

### Guest User:
```
Buy Channel Page → Click "Buy with Crypto" → Dialog opens
→ Shows email input field
→ User enters email → Continue
→ Navigate to /checkout/[id]?accessEmail=[email]
→ Checkout page gets email from query
→ Create order with guestEmail + channelAccessEmail
```

---

## Key Points

1. **channelAccessEmail is separate from user/guest email**:
   - Used specifically for channel access assignment
   - Admin will use this to transfer channel ownership
   - Can be different from order notification email

2. **Checkout page is simplified**:
   - No more name/email collection
   - Just order summary and payment
   - Email comes from dialog via query param

3. **Backward compatibility**:
   - Existing orders won't have `channelAccessEmail` (nullable)
   - Admin can manually add it for old orders
   - New orders will always have it

4. **Validation**:
   - Email required in dialog
   - Email validated before proceeding
   - API validates email format

---

## Files to Create/Modify

### New Files:
- `app/buy-channel/[id]/components/channel-access-dialog.tsx`

### Modified Files:
- `prisma/schema.prisma`
- `app/buy-channel/[id]/page.tsx`
- `app/checkout/[listingId]/page.tsx`
- `app/api/orders/route.ts`
- `app/(admin)/admin/orders/page.tsx` (if exists)
- `app/(admin)/admin/orders/[id]/page.tsx` (if exists)
- `lib/validation.ts` (add channelAccessEmail validation if needed)

### Migration:
- `prisma/migrations/[timestamp]_add_channel_access_email/migration.sql`


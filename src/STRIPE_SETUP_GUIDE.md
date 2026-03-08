# Stripe Payment Setup Guide for Medboro

## 🎯 Overview
This guide explains how to set up Stripe payments so that money from patient bookings flows to your bank account.

## 📋 Prerequisites
- A business or personal bank account
- Valid government ID
- Business/tax information
- Phone number for verification

## 🚀 Step-by-Step Setup

### Step 1: Create Stripe Account
1. Go to https://stripe.com
2. Click "Start now" or "Sign up"
3. Enter your email and create a password
4. Choose your country (India for UPI support)

### Step 2: Complete Business Profile
1. **Business Details:**
   - Business name: "Medboro" or your legal entity name
   - Business type: Healthcare/Medical Services
   - Website: Your website URL (if available)

2. **Personal Information:**
   - Full legal name
   - Date of birth
   - Address
   - Phone number

3. **Tax Information:**
   - PAN card (for India)
   - GST number (if applicable)
   - Business registration documents

### Step 3: Add Bank Account for Payouts
1. Go to Stripe Dashboard
2. Navigate to: **Settings → Bank accounts and scheduling**
3. Click "Add bank account"
4. Enter your bank details:
   - Account holder name
   - Account number
   - IFSC code (for India)
   - Account type (Savings/Current)

5. Verify your bank account:
   - Stripe will make 2 small test deposits
   - Verify the amounts in Stripe Dashboard
   - Bank account will be confirmed

### Step 4: Configure Payout Schedule
1. In the same Bank accounts section
2. Choose payout schedule:
   - **Daily** - Funds transferred every day
   - **Weekly** - Funds transferred once per week
   - **Monthly** - Funds transferred once per month
   - **Manual** - You trigger transfers manually

### Step 5: Get Your API Keys

#### For Testing (Development):
1. Ensure you're in **Test Mode** (toggle in dashboard)
2. Go to: **Developers → API keys**
3. Copy these keys:
   - **Publishable key:** `pk_test_...`
   - **Secret key:** `sk_test_...`

#### For Production (Live Payments):
1. Switch to **Live Mode** (toggle in dashboard)
2. Complete all verification requirements
3. Go to: **Developers → API keys**
4. Copy these keys:
   - **Publishable key:** `pk_live_...`
   - **Secret key:** `sk_live_...`

### Step 6: Add Keys to Medboro

#### Backend (Secret Key):
- The secret key is already configured in Supabase environment variables
- Make sure `STRIPE_SECRET_KEY` is set with your `sk_test_...` or `sk_live_...` key

#### Frontend (Publishable Key):
1. Open `/pages/Payment.tsx`
2. Find line ~51: `const stripe = (window as any).Stripe('pk_test_YOUR_PUBLISHABLE_KEY');`
3. Replace `pk_test_YOUR_PUBLISHABLE_KEY` with your actual publishable key

Example:
```typescript
const stripe = (window as any).Stripe('pk_test_51234567890abcdefghijklmnop');
```

### Step 7: Enable UPI Payments (For India)
1. Go to Stripe Dashboard
2. Navigate to: **Settings → Payment methods**
3. Find "UPI" in the list
4. Click "Enable"
5. Configure UPI settings:
   - Minimum amount: ₹1
   - Maximum amount: ₹100,000
   - Statement descriptor: "Medboro Appointment"

## 💰 Payment Flow

### How Money Moves:
```
Patient makes payment
    ↓
Stripe processes payment (card/UPI)
    ↓
Money appears in Stripe Balance
    ↓
Stripe transfers to your bank (per schedule)
    ↓
Money arrives in your bank account
```

### Timeline:
- **Card payments:** Available in 2-7 days
- **UPI payments:** Available in 2-7 days
- **First payout:** May take longer due to verification

### Fees:
**India Pricing:**
- Domestic cards: 2.9% + ₹2 per transaction
- UPI: 2% (capped at ₹4,000 per transaction)
- International cards: 4.9% + ₹2 per transaction

**Example:**
- Patient pays ₹500 for appointment
- Stripe fee: ₹500 × 2% = ₹10
- You receive: ₹490
- Transferred to your bank account

## 🧪 Testing Payments

### Test Mode:
- Use test keys (`pk_test_...` and `sk_test_...`)
- No real money is charged
- Use test card numbers:
  - **Success:** `4242 4242 4242 4242`
  - **Decline:** `4000 0000 0000 0002`
  - **3D Secure:** `4000 0027 6000 3184`
  - Any future expiry date (e.g., 12/34)
  - Any 3-digit CVC

### Test UPI:
- In test mode, UPI payments are simulated
- Use any UPI ID format: `test@paytm`
- Payment will complete after 3 seconds

## 🔒 Security Best Practices

### Protect Your Secret Key:
- ✅ Store in Supabase environment variables
- ✅ Never commit to Git
- ✅ Never expose in frontend code
- ❌ Don't share publicly
- ❌ Don't store in plain text files

### Publishable Key:
- ✅ Safe to use in frontend
- ✅ Can be committed to Git
- ✅ Only creates payment intents (doesn't charge)

## 📊 Monitoring Payments

### Stripe Dashboard:
1. **Payments:** View all transactions
2. **Balance:** See available funds
3. **Payouts:** Track bank transfers
4. **Customers:** Manage customer data
5. **Disputes:** Handle chargebacks

### In Medboro:
- Check `/dashboard` for appointment history
- Each appointment shows payment status
- QR codes contain payment IDs

## 🚨 Going Live Checklist

Before switching to live mode:

- [ ] Complete Stripe account verification
- [ ] Add and verify bank account
- [ ] Set payout schedule
- [ ] Enable required payment methods (card, UPI)
- [ ] Update secret key in Supabase (`sk_live_...`)
- [ ] Update publishable key in `/pages/Payment.tsx` (`pk_live_...`)
- [ ] Test a small live payment
- [ ] Verify payout arrives in bank account
- [ ] Set up email notifications in Stripe
- [ ] Configure receipt emails for customers

## ❓ Common Questions

**Q: How long until I receive money?**
A: 2-7 business days for first payout, then according to your schedule.

**Q: Can I refund a payment?**
A: Yes, through Stripe Dashboard → Payments → Select payment → Refund

**Q: What if a payment fails?**
A: Patient sees error message, no money is charged, they can try again.

**Q: Do I need a registered business?**
A: Not required, but recommended for higher limits and better tax handling.

**Q: Can I use multiple bank accounts?**
A: Yes, you can add multiple accounts and choose which receives payouts.

**Q: What about taxes?**
A: You're responsible for reporting income. Stripe provides tax documents (Form 16A/TDS for India).

## 🆘 Support

- **Stripe Support:** https://support.stripe.com
- **Documentation:** https://stripe.com/docs
- **API Reference:** https://stripe.com/docs/api
- **Community:** https://stackoverflow.com/questions/tagged/stripe-payments

## 📱 Next Steps

1. Create Stripe account
2. Complete verification
3. Add bank account
4. Get API keys
5. Update Medboro with your keys
6. Test in test mode
7. Go live when ready!

---

**Remember:** Start with test mode, verify everything works, then switch to live mode for real payments. The money will flow directly to your configured bank account! 💰

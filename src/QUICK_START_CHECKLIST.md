# ⚡ Medboro Stripe Setup - Quick Start Checklist

Print this page and check off each step as you complete it!

---

## 🎯 30-Minute Setup Checklist

### □ PHASE 1: Create Stripe Account (10 min)

- [ ] Go to https://stripe.com
- [ ] Click "Sign up" 
- [ ] Enter email, name, password
- [ ] Verify email (check inbox)
- [ ] Select country: **India**
- [ ] Fill business details
- [ ] Enter PAN card number
- [ ] Add phone number
- [ ] Complete profile (100%)

---

### □ PHASE 2: Add Bank Account (5 min)

- [ ] Go to: Settings → Bank accounts and scheduling
- [ ] Click "Add bank account"
- [ ] Enter account number
- [ ] Enter IFSC code
- [ ] Select account type (Savings/Current)
- [ ] Save bank account
- [ ] Set payout schedule: **Daily** (recommended)

---

### □ PHASE 3: Get API Keys (2 min)

- [ ] Toggle to "Test mode" (top right)
- [ ] Click: Developers → API keys
- [ ] Copy **Publishable key** (`pk_test_...`)
  - Write it here: ________________________________
- [ ] Copy **Secret key** (`sk_test_...`)
  - Write it here: ________________________________
- [ ] Keep these keys safe!

---

### □ PHASE 4: Enable UPI (1 min)

- [ ] Go to: Settings → Payment methods
- [ ] Find "UPI" in the list
- [ ] Toggle to **Enable**
- [ ] Set statement descriptor: **MEDBORO**
- [ ] Click Save

---

### □ PHASE 5: Connect to Medboro (3 min)

**A) Add Secret Key to Supabase:**
- [ ] System will prompt for `STRIPE_SECRET_KEY`
- [ ] Paste your secret key (`sk_test_...`)
- [ ] Click Save

**B) Add Publishable Key to Code:**
- [ ] Open `/pages/Payment.tsx`
- [ ] Find line 51: `'pk_test_YOUR_PUBLISHABLE_KEY'`
- [ ] Replace with your actual key
- [ ] Save file

---

### □ PHASE 6: Test Payments (5 min)

**Test Card Payment:**
- [ ] Start Medboro app
- [ ] Book an appointment
- [ ] Select "Credit / Debit Card"
- [ ] Use card: `4242 4242 4242 4242`
- [ ] Expiry: `12/34`, CVC: `123`
- [ ] Click "Pay Now"
- [ ] ✅ See QR code confirmation

**Test UPI Payment:**
- [ ] Book another appointment
- [ ] Select "UPI"
- [ ] Enter: `test@paytm`
- [ ] Click "Pay Now"
- [ ] Wait 3 seconds
- [ ] ✅ See QR code confirmation

---

### □ PHASE 7: Verify in Stripe (2 min)

- [ ] Go to Stripe Dashboard
- [ ] Click "Payments" in sidebar
- [ ] See your 2 test payments listed
- [ ] Both show status: "Succeeded"
- [ ] Click on a payment to see details

---

## ✅ SETUP COMPLETE!

If all boxes are checked, your payment system is live (in test mode)!

---

## 📋 Important Information

**Your Stripe Account Email:**
_________________________________

**Your Stripe Dashboard URL:**
https://dashboard.stripe.com

**Your Bank Account (last 4 digits):**
_________________________________

**Payout Schedule:**
_________________________________

---

## 🧪 Test Mode vs Live Mode

### Currently: TEST MODE ✅
- No real money
- Use test cards
- Perfect for development

### Later: LIVE MODE 💰
- Real money
- Real cards
- Real bank transfers

**Switch to live mode ONLY after thorough testing!**

---

## 🚨 Before Going Live

- [ ] Test at least 10 successful payments
- [ ] Test failed payments
- [ ] Test refunds
- [ ] Verify QR codes generate correctly
- [ ] Check all appointment data saves
- [ ] Complete Stripe account verification
- [ ] Verify bank account
- [ ] Update keys to live mode
- [ ] Test with real ₹10 payment
- [ ] Monitor first 5 real payments

---

## 🆘 Quick Troubleshooting

**Error: "Payment system not configured"**
→ Check `STRIPE_SECRET_KEY` in Supabase

**Error: "Failed to create payment intent"**
→ Check browser console, verify UPI enabled

**No QR code showing**
→ Check console for errors, verify payment success

**Can't see payments in Stripe**
→ Make sure you're in "Test mode"

---

## 📞 Support

**Stripe Help:** https://support.stripe.com  
**Stripe Docs:** https://stripe.com/docs  
**Test Cards:** https://stripe.com/docs/testing

---

## 🎯 Quick Reference

### Test Card Numbers:
```
✅ Success:    4242 4242 4242 4242
❌ Decline:    4000 0000 0000 0002
🔐 3D Secure:  4000 0027 6000 3184

Expiry: Any future date (12/34)
CVC: Any 3 digits (123)
```

### Test UPI IDs:
```
test@paytm
demo@upi
anything@okaxis
```

### Where Keys Go:
```
SECRET KEY (sk_test_...)
→ Supabase Environment Variable

PUBLISHABLE KEY (pk_test_...)
→ /pages/Payment.tsx line 51
```

---

## 💰 Payment Flow Reminder

```
Patient pays ₹500
    ↓
Stripe processes
    ↓
Your Stripe account
    ↓
Your bank account
    ↓
You receive ~₹490 (after 2% fee)
```

---

**Date Setup Completed:** _______________

**Tested By:** _______________

**Ready for Live Mode:** ☐ Yes  ☐ Not Yet

---

🎉 **Congratulations on setting up Medboro payments!**

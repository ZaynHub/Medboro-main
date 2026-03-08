# 🚀 START HERE - Stripe Payment Setup for Medboro

## ⚡ 30-Minute Quick Start

Follow these 8 simple steps to get payments working!

---

## Step 1️⃣: Create Stripe Account (5 min)

1. Open: **https://stripe.com**
2. Click: **"Sign up"**
3. Fill in:
   - Email: _____________________________
   - Name: _____________________________
   - Country: **India**
   - Password: _____________________________
4. Click: **"Create account"**
5. Verify your email (check inbox)

✅ **Done!** You now have a Stripe account.

---

## Step 2️⃣: Complete Profile (3 min)

1. Fill in business details:
   - Business name: **Medboro**
   - Industry: **Healthcare**
2. Enter personal info:
   - Phone number
   - Address
   - PAN card number
3. Click **"Save"**

✅ **Done!** Profile is complete.

---

## Step 3️⃣: Add Bank Account (3 min)

1. In Stripe Dashboard, click:
   - **Settings** → **Bank accounts and scheduling**
2. Click: **"Add bank account"**
3. Fill in:
   - Account holder name: ___________________
   - Account number: ___________________
   - IFSC code: ___________________
   - Account type: **Savings** or **Current**
4. Click: **"Add bank account"**
5. Set payout schedule: **Daily**

✅ **Done!** Your bank is connected.

---

## Step 4️⃣: Get Your API Keys (2 min)

1. Make sure **"Test mode"** is ON (toggle at top right should be blue)
2. Click: **Developers** → **API keys**
3. Copy **Publishable key** (starts with `pk_test_`):
   ```
   pk_test_________________________________________
   ```
   Write it here: ________________________________

4. Copy **Secret key** (starts with `sk_test_`):
   ```
   sk_test_________________________________________
   ```
   Write it here: ________________________________

⚠️ **Keep these safe!** You'll need them in the next steps.

✅ **Done!** You have your API keys.

---

## Step 5️⃣: Enable UPI (1 min)

1. Click: **Settings** → **Payment methods**
2. Find **"UPI"**
3. Toggle it **ON** (should turn blue)
4. Enter statement descriptor: **MEDBORO**
5. Click: **"Save"**

✅ **Done!** UPI is enabled.

---

## Step 6️⃣: Add Secret Key to Medboro (1 min)

1. **You should be prompted automatically** when you run Medboro
2. When prompted for `STRIPE_SECRET_KEY`:
   - Paste your **Secret key** from Step 4 (`sk_test_...`)
   - Click **"Save"**

**OR** if you missed it:
- The system will show a modal asking for the key
- Just paste it when prompted

✅ **Done!** Backend is connected to Stripe.

---

## Step 7️⃣: Add Publishable Key to Code (2 min)

1. **Open your code editor**
2. **Navigate to:** `/pages/Payment.tsx`
3. **Find line 51** (or use Find: `pk_test_YOUR_PUBLISHABLE_KEY`)
4. **You'll see:**
   ```typescript
   const stripe = (window as any).Stripe('pk_test_YOUR_PUBLISHABLE_KEY');
   ```
5. **Replace with YOUR key:**
   ```typescript
   const stripe = (window as any).Stripe('pk_test_51ABC123XYZ...');
   ```
   (Use the Publishable key from Step 4)

6. **Save the file**

✅ **Done!** Frontend is connected to Stripe.

---

## Step 8️⃣: Test It! (5 min)

### Test Card Payment:

1. **Start Medboro** and go through booking flow
2. **Select:** Credit / Debit Card
3. **Use test card:**
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/34`
   - CVC: `123`
4. **Click:** "Pay Now"
5. **You should see:** ✅ QR code with appointment details!

### Test UPI Payment:

1. **Book another appointment**
2. **Select:** UPI
3. **Enter:** `test@paytm`
4. **Click:** "Pay Now"
5. **Wait 3 seconds**
6. **You should see:** ✅ QR code with appointment details!

### Verify in Stripe:

1. **Go to Stripe Dashboard**
2. **Click:** Payments
3. **You should see:** 2 test payments with status "Succeeded" ✅

✅ **Done!** Everything is working! 🎉

---

## 🎯 Quick Reference

### Your Stripe Login:
- **URL:** https://dashboard.stripe.com
- **Email:** ________________________________

### Your API Keys (Test Mode):
- **Publishable:** `pk_test_...` → Goes in `/pages/Payment.tsx`
- **Secret:** `sk_test_...` → Goes in Supabase env

### Test Payment Details:
- **Card:** `4242 4242 4242 4242`
- **Expiry:** Any future date (`12/34`)
- **CVC:** Any 3 digits (`123`)
- **UPI:** Any format (`test@paytm`)

### Where Money Goes:
```
Patient pays → Stripe → Your Stripe Account → Your Bank
```

---

## 📚 Full Guides Available

If you need more details, read:

1. **`STRIPE_SETUP_INSTRUCTIONS.md`** - Complete step-by-step guide
2. **`QUICK_START_CHECKLIST.md`** - Printable checklist
3. **`STRIPE_DASHBOARD_GUIDE.md`** - Visual dashboard guide
4. **`STRIPE_SETUP_GUIDE.md`** - Detailed reference

---

## 🆘 Troubleshooting

### Error: "Payment system not configured"
→ Check that Step 6 is complete (Secret key in Supabase)

### Error: "Failed to create payment intent"
→ Verify UPI is enabled (Step 5)

### Stripe.js loading error
→ Check internet connection, clear browser cache

### QR code not showing
→ Check browser console for errors

### Can't see payments in Stripe
→ Make sure you're in "Test mode" (blue toggle)

---

## 🚦 Status Checklist

After completing all 8 steps:

- [ ] ✅ Stripe account created
- [ ] ✅ Bank account added
- [ ] ✅ API keys obtained
- [ ] ✅ UPI enabled
- [ ] ✅ Secret key added to Supabase
- [ ] ✅ Publishable key added to Payment.tsx
- [ ] ✅ Card payment tested successfully
- [ ] ✅ UPI payment tested successfully

**All checked? You're ready to accept payments! 🎉**

---

## 🔄 Going Live (Later)

When you're ready for real payments:

1. Complete Stripe verification
2. Switch to "Live mode" in Stripe
3. Get live API keys (`pk_live_...` and `sk_live_...`)
4. Replace test keys with live keys
5. Test with small real payment
6. Launch! 🚀

---

## 💡 Pro Tips

- **Always start in Test Mode** - No risk, unlimited testing
- **Test thoroughly** - Try 10+ test payments before going live
- **Keep secret key safe** - Never share or commit to Git
- **Check Stripe Dashboard daily** - Monitor payments
- **Enable email notifications** - Get alerts for payments

---

## 📞 Need Help?

- **Stripe Support:** https://support.stripe.com
- **Stripe Docs:** https://stripe.com/docs
- **Test Cards:** https://stripe.com/docs/testing

---

**Last Updated:** January 31, 2026

---

# 🎉 You're All Set!

Once you complete Step 8 and see the QR codes, your payment system is working!

**Patients can now:**
- ✅ Book appointments
- ✅ Pay with Card/UPI
- ✅ Get verification QR codes
- ✅ Check in at hospital

**You can:**
- ✅ Track payments in Stripe Dashboard
- ✅ Receive money in your bank account
- ✅ Monitor all transactions
- ✅ Issue refunds if needed

**Start testing and good luck with Medboro! 🏥💰**

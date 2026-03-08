# 🎨 Stripe Dashboard Visual Guide

This guide shows you exactly where to click in the Stripe Dashboard.

---

## 📱 Accessing Stripe Dashboard

**URL:** https://dashboard.stripe.com

**Login with:**
- Email: (the one you used to sign up)
- Password: (your Stripe password)
- 2FA code: (if enabled, check SMS/authenticator app)

---

## 🎛️ Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  🟦 Stripe Logo    [Test mode ⚡]     👤 Your Name     🔔   │ ← Top Bar
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────────────────────────────┐ │
│  │              │  │                                        │ │
│  │  🏠 Home     │  │                                        │ │
│  │              │  │         MAIN CONTENT AREA              │ │
│  │  💳 Payments │  │                                        │ │
│  │              │  │    (This is where you'll see          │ │
│  │  👥 Customers│  │     different pages based on          │ │
│  │              │  │     what you click in sidebar)        │ │
│  │  💰 Balance  │  │                                        │ │
│  │              │  │                                        │ │
│  │  📊 Reports  │  │                                        │ │
│  │              │  └────────────────────────────────────────┘ │
│  │  ⚙️ Settings │                                            │
│  │              │                                            │
│  │  🔧 Developer│                                            │
│  │              │                                            │
│  └──────────────┘                                            │
│   Left Sidebar                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 STEP 1: Getting Your API Keys

### Location: Developers → API keys

**Click Path:**
```
1. Look at LEFT SIDEBAR
2. Scroll down to find "Developers" section
3. Click "Developers" (🔧 icon)
4. In submenu, click "API keys"
```

**What You'll See:**
```
┌────────────────────────────────────────────────┐
│  API keys                                       │
├────────────────────────────────────────────────┤
│                                                 │
│  Standard keys                                  │
│                                                 │
│  Publishable key                                │
│  pk_test_51AbC...                    [📋 Copy] │
│  [Reveal test key token]                       │
│                                                 │
│  Secret key                                     │
│  sk_test_51XyZ...                    [📋 Copy] │
│  [Reveal test key token]                       │
│                                                 │
└────────────────────────────────────────────────┘
```

**Actions:**
1. ✅ Click "Reveal test key token" for Publishable key
2. ✅ Click [📋 Copy] button to copy it
3. ✅ Paste it somewhere safe (Notepad, Notes app)
4. ✅ Do the same for Secret key
5. ✅ Keep Secret key PRIVATE!

---

## 🏦 STEP 2: Adding Your Bank Account

### Location: Settings → Bank accounts and scheduling

**Click Path:**
```
1. Look at LEFT SIDEBAR
2. Scroll down to bottom
3. Click "Settings" (⚙️ icon)
4. In the settings menu that opens, click:
   "Bank accounts and scheduling"
```

**What You'll See:**
```
┌────────────────────────────────────────────────────────┐
│  Bank accounts and scheduling                           │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Bank accounts for payouts                             │
│  ┌──────────────────────────────────────┐             │
│  │  No bank accounts added yet           │             │
│  │                                        │             │
│  │  [+ Add bank account] ← Click this!   │             │
│  └──────────────────────────────────────┘             │
│                                                         │
│  Payout schedule                                       │
│  ○ Daily                                               │
│  ○ Weekly                                              │
│  ○ Monthly                                             │
│  ○ Manual                                              │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**When you click "Add bank account", a form appears:**
```
┌────────────────────────────────────────────────┐
│  Add bank account                               │
├────────────────────────────────────────────────┤
│                                                 │
│  Account holder name *                         │
│  [_________________________________]           │
│                                                 │
│  Country                                        │
│  [India ▼]                                     │
│                                                 │
│  Currency                                       │
│  [INR - Indian Rupee ▼]                        │
│                                                 │
│  Account number *                              │
│  [_________________________________]           │
│                                                 │
│  Confirm account number *                      │
│  [_________________________________]           │
│                                                 │
│  IFSC code *                                   │
│  [_________________________________]           │
│                                                 │
│  Account type                                   │
│  ○ Savings   ○ Current                        │
│                                                 │
│        [Cancel]  [Add bank account]            │
└────────────────────────────────────────────────┘
```

**Fill in:**
1. ✅ Account holder name: YOUR LEGAL NAME
2. ✅ Country: India
3. ✅ Currency: INR
4. ✅ Account number: Your bank account number
5. ✅ Confirm: Re-enter account number
6. ✅ IFSC code: Your bank's IFSC (e.g., SBIN0001234)
7. ✅ Account type: Savings (or Current)
8. ✅ Click "Add bank account"

---

## 💳 STEP 3: Enabling UPI Payments

### Location: Settings → Payment methods

**Click Path:**
```
1. Click "Settings" in LEFT SIDEBAR
2. Click "Payment methods"
3. Scroll to find "UPI"
```

**What You'll See:**
```
┌────────────────────────────────────────────────────────┐
│  Payment methods                                        │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Cards                                                  │
│  [●] Enabled                                           │
│                                                         │
│  ─────────────────────────────────────────────         │
│                                                         │
│  UPI                                      [○] Disabled │ ← Toggle this!
│  Accept payments via UPI in India                      │
│                                                         │
│  ─────────────────────────────────────────────         │
│                                                         │
│  Digital wallets                                       │
│  [○] Disabled                                          │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Actions:**
1. ✅ Find "UPI" in the list
2. ✅ Click the toggle button to turn it ON
3. ✅ You'll see a settings panel open:

```
┌────────────────────────────────────────┐
│  UPI settings                           │
├────────────────────────────────────────┤
│                                         │
│  Statement descriptor                  │
│  [MEDBORO___________]                  │
│  (appears on bank statements)          │
│                                         │
│  Minimum amount: ₹1                    │
│  Maximum amount: ₹100,000              │
│                                         │
│          [Cancel]  [Save]              │
└────────────────────────────────────────┘
```

4. ✅ Enter "MEDBORO" in statement descriptor
5. ✅ Click "Save"
6. ✅ UPI is now ENABLED! ✓

---

## 👀 STEP 4: Viewing Test Payments

### Location: Payments

**Click Path:**
```
1. Click "Payments" in LEFT SIDEBAR
2. You'll see a list of all payments
```

**What You'll See (after testing):**
```
┌─────────────────────────────────────────────────────────────────┐
│  Payments                                        [Export ▼]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  🔍 [Search payments...]     📅 All time ▼    ⚙️ More filters  │
│                                                                   │
├────────┬──────────────┬──────────┬───────────┬─────────────────┤
│ Amount │ Customer     │ Status   │ Date      │ Description     │
├────────┼──────────────┼──────────┼───────────┼─────────────────┤
│ ₹500   │ Guest User   │ ✓ Paid   │ Jan 31    │ Appointment     │
│ ₹500   │ Guest User   │ ✓ Paid   │ Jan 31    │ Appointment     │
│        │              │          │           │                 │
└────────┴──────────────┴──────────┴───────────┴─────────────────┘
```

**Click any payment to see details:**
```
┌────────────────────────────────────────┐
│  ₹500.00 INR                           │
│  ✓ Succeeded                           │
├────────────────────────────────────────┤
│                                         │
│  Payment details                       │
│  ID: pi_123456789                      │
│  Amount: ₹500.00                       │
│  Fee: ₹10.00                           │
│  Net: ₹490.00                          │
│                                         │
│  Customer                              │
│  Name: Guest User                      │
│  Email: guest@example.com              │
│                                         │
│  Payment method                        │
│  UPI: test@paytm                       │
│                                         │
│  Timeline                              │
│  ✓ Succeeded   2:45 PM                │
│  ✓ Created     2:45 PM                │
│                                         │
│  [Issue refund]  [More...]            │
└────────────────────────────────────────┘
```

---

## 💰 STEP 5: Checking Your Balance

### Location: Balance

**Click Path:**
```
1. Click "Balance" in LEFT SIDEBAR
```

**What You'll See:**
```
┌─────────────────────────────────────────────────┐
│  Balance                                         │
├─────────────────────────────────────────────────┤
│                                                  │
│  Available for payout                           │
│  ₹0.00 INR                                      │
│  (In test mode, always shows 0)                 │
│                                                  │
│  Pending                                        │
│  ₹980.00 INR                                    │
│  (Test payments pending)                        │
│                                                  │
│  Next payout                                    │
│  ₹980.00 on Feb 1, 2026                        │
│  to Bank •••• 1234                             │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 🔄 STEP 6: Test Mode vs Live Mode Toggle

### Location: Top right corner of dashboard

**What It Looks Like:**
```
┌──────────────────────────────────────┐
│  [⚡ Test mode]   ← Currently in test│
│                                      │
│  Click to see menu:                 │
│  ┌────────────────────┐            │
│  │ ⚡ Test mode       │            │
│  │ 💰 Live mode       │            │
│  └────────────────────┘            │
└──────────────────────────────────────┘
```

**Colors:**
- 🟦 Blue = Test mode (safe, no real money)
- 🟩 Green = Live mode (REAL money!)

**Important:**
- ⚠️ Start in TEST MODE
- ⚠️ Only switch to LIVE MODE when ready
- ⚠️ Test mode and live mode have separate data

---

## 📊 Dashboard Home Page Overview

**When you first log in, you see:**

```
┌──────────────────────────────────────────────────────┐
│  Welcome to Stripe                                    │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Get started                                         │
│  ☐ Activate your account                            │
│  ☐ Add a bank account                               │
│  ☐ Make your first payment                          │
│                                                       │
│  ───────────────────────────────────────────         │
│                                                       │
│  Revenue overview (Test mode)                        │
│  ┌────────────────────────────────────┐            │
│  │         📈                          │            │
│  │       ₹1,000                       │            │
│  │    (Test payments)                 │            │
│  └────────────────────────────────────┘            │
│                                                       │
│  Recent payments                                     │
│  ₹500  •  Guest User  •  Succeeded  •  2:45 PM    │
│  ₹500  •  Guest User  •  Succeeded  •  2:43 PM    │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## 🎯 Quick Navigation Cheat Sheet

| What You Want | Where to Click |
|--------------|----------------|
| **Get API keys** | Developers → API keys |
| **Add bank account** | Settings → Bank accounts and scheduling |
| **Enable UPI** | Settings → Payment methods |
| **View payments** | Payments (sidebar) |
| **Check balance** | Balance (sidebar) |
| **See payouts** | Balance → Payouts tab |
| **Refund payment** | Payments → Click payment → Issue refund |
| **Export data** | Payments → Export button |
| **Switch test/live** | Toggle at top right |
| **Get help** | Question mark icon (?) at top |

---

## 🔔 Setting Up Notifications

### Location: Settings → Emails

**Click Path:**
```
1. Settings (left sidebar)
2. Click "Emails"
3. Enable notifications you want
```

**Recommended to enable:**
- ✅ Successful payments
- ✅ Failed payments
- ✅ Payouts
- ✅ Disputes

---

## 📱 Mobile App

Stripe also has mobile apps!

**Download:**
- iOS: App Store → Search "Stripe Dashboard"
- Android: Play Store → Search "Stripe Dashboard"

**Features:**
- View payments on the go
- Get push notifications
- Check balance
- Issue refunds

---

## 🆘 Getting Help in Dashboard

**Help Button Location:**
```
Top right corner: [❓] icon

Click it to:
- Search documentation
- Contact support
- View guides
- Check system status
```

---

## ✅ Visual Checklist

After reading this guide, you should know how to:

- [ ] Log into Stripe Dashboard
- [ ] Navigate the sidebar
- [ ] Find API keys
- [ ] Add bank account
- [ ] Enable payment methods
- [ ] View payments list
- [ ] Check payment details
- [ ] View balance
- [ ] Toggle test/live mode
- [ ] Access settings
- [ ] Get help

---

## 🎓 Pro Tips

1. **Bookmark the dashboard:** https://dashboard.stripe.com
2. **Enable 2FA** for security: Settings → Security
3. **Set up email notifications** for all payments
4. **Check dashboard daily** when going live
5. **Use test mode** extensively before live mode
6. **Explore each section** to get familiar
7. **Read the tooltips** - hover over (?) icons
8. **Download mobile app** for on-the-go access

---

**Last Updated:** January 31, 2026

Now you know exactly where everything is in Stripe Dashboard! 🎉

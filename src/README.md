# 🏥 Medboro - Healthcare Appointment Booking System

A comprehensive healthcare management platform built with React, TypeScript, Supabase, and Stripe.

## 🌟 Features

### Patient Features
- ✅ **Authentication** - Email/phone login with Supabase Auth
- ✅ **Hospital Search** - Search and book appointments with hospitals
- ✅ **Specialty Search** - Find doctors by medical specialty
- ✅ **Symptom Checker** - AI-powered symptom analysis and recommendations
- ✅ **Appointment Booking** - Complete booking flow with real-time availability
- ✅ **Payment Processing** - Stripe integration (Card + UPI with QR codes)
- ✅ **Medical Records** - Upload, view, print, and download medical documents
- ✅ **Insurance Claims** - Coverage checking and claim filing assistance
- ✅ **AI Chatbot Support** - 24/7 intelligent customer support
- ✅ **Patient Dashboard** - Comprehensive health management hub
- ✅ **Subscription Plans** - Premium membership tiers

### Technical Features
- 🎨 **Cyan-to-Teal Gradient Theme** - Modern, cohesive design system
- 📱 **Fully Responsive** - Mobile, tablet, and desktop optimized
- 🔐 **Secure Authentication** - Case-insensitive email + phone support
- 💾 **Persistent Storage** - Supabase PostgreSQL + KV Store
- 📄 **File Management** - Supabase Storage for medical documents
- 💳 **Payment Gateway** - Stripe with UPI QR code generation
- 🤖 **AI Integration** - Intelligent chatbot and symptom analysis

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Supabase account** ([Sign up free](https://supabase.com))
- **Stripe account** (optional, for payments) ([Sign up](https://stripe.com))

### Installation

1. **Extract the project files** to your desired location

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase** (see detailed instructions below)

4. **Configure environment variables** (see Configuration section)

5. **Deploy backend function**
   ```bash
   supabase functions deploy server
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser** to `http://localhost:5173`

---

## 🔧 Configuration

### 1. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up (2-3 minutes)
3. Note your project credentials from Settings → API:
   - `Project URL` (SUPABASE_URL)
   - `anon/public key` (SUPABASE_ANON_KEY)
   - `service_role key` (SUPABASE_SERVICE_ROLE_KEY)

#### Update Frontend Configuration
Edit `/utils/supabase/info.tsx`:
```typescript
export const projectId = 'your-project-id'; // Extract from your Supabase URL
export const publicAnonKey = 'your-anon-key-here';
```

#### Create Storage Bucket
Run this in your Supabase SQL Editor (Database → SQL Editor):
```sql
-- Medical records storage bucket is created automatically by the server
-- on first startup, but you can create it manually if needed:
INSERT INTO storage.buckets (id, name, public)
VALUES ('make-51d2d2e2-medical-records', 'make-51d2d2e2-medical-records', false);
```

#### Database Table
The KV store table (`kv_store_51d2d2e2`) is automatically created and managed by Supabase.

### 2. Deploy Supabase Edge Function

#### Install Supabase CLI
```bash
npm install -g supabase
```

#### Login and Link Project
```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref
```

Your project ref is in your Supabase URL: `https://YOUR-PROJECT-REF.supabase.co`

#### Set Environment Variables
```bash
# Set Stripe secret key (if using payments)
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_stripe_key

# The following are automatically available in Supabase Functions:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

#### Deploy the Function
```bash
supabase functions deploy server
```

The function will be available at: `https://your-project-ref.supabase.co/functions/v1/make-server-51d2d2e2`

### 3. Stripe Setup (Optional)

If you want to enable payment features:

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from Dashboard → Developers → API Keys
3. Use **Test mode** keys for development:
   - `pk_test_...` (publishable key)
   - `sk_test_...` (secret key)
4. Add secret key to Supabase:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

**Note:** UPI payments generate QR codes for testing purposes. In production, integrate with a real UPI payment gateway.

### 4. Environment Variables Summary

**Frontend** (`/utils/supabase/info.tsx`):
```typescript
export const projectId = 'your-project-id';
export const publicAnonKey = 'your-anon-key';
```

**Backend** (Supabase Secrets):
```bash
STRIPE_SECRET_KEY=sk_test_...
SUPABASE_URL=https://xxx.supabase.co  # Auto-provided
SUPABASE_ANON_KEY=eyJ...              # Auto-provided
SUPABASE_SERVICE_ROLE_KEY=eyJ...      # Auto-provided
```

---

## 📁 Project Structure

```
medboro/
├── App.tsx                           # Main application entry
├── routes.tsx                        # React Router configuration
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── README.md                         # This file
│
├── styles/
│   └── globals.css                   # Tailwind CSS + custom styles
│
├── pages/                            # Application pages
│   ├── Dashboard.tsx                 # Patient dashboard
│   ├── SignIn.tsx                    # Authentication - Sign in
│   ├── SignUp.tsx                    # Authentication - Sign up
│   ├── HospitalSearch.tsx            # Search hospitals & doctors
│   ├── SpecialtySearch.tsx           # Search by medical specialty
│   ├── SymptomChecker.tsx            # AI symptom analysis
│   ├── AppointmentBooking.tsx        # Appointment booking flow
│   ├── PaymentPage.tsx               # Stripe/UPI payment processing
│   ├── MedicalRecords.tsx            # Medical document management
│   ├── Support.tsx                   # AI chatbot support
│   └── insurance/                    # Insurance features
│       ├── InsurancePlans.tsx
│       ├── ClaimSubmission.tsx
│       ├── ClaimStatus.tsx
│       ├── CoverageChecker.tsx
│       ├── AIAnalysis.tsx
│       └── ClaimGuidance.tsx
│
├── components/                       # Reusable components
│   ├── Button.tsx
│   └── figma/
│       └── ImageWithFallback.tsx     # Protected - do not modify
│
├── utils/                            # Utilities
│   ├── api.ts                        # Frontend API helpers
│   └── supabase/
│       └── info.tsx                  # Supabase configuration
│
└── supabase/functions/server/        # Backend API
    ├── index.tsx                     # Hono web server + routes
    └── kv_store.tsx                  # Protected - do not modify
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v7** - Navigation (Data mode)
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **Motion** (Framer Motion) - Animations
- **Recharts** - Data visualization
- **React Hook Form** - Form management
- **Sonner** - Toast notifications

### Backend
- **Deno** - JavaScript runtime
- **Hono** - Web framework
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Storage
  - Edge Functions

### Payments
- **Stripe API** - Card payments
- **UPI** - QR code generation (demo mode)

---

## 🎨 Design System

The application uses a modern **cyan-to-teal gradient** color scheme:

- **Primary Gradient:** `from-cyan-500 to-teal-600`
- **Secondary Gradient:** `from-cyan-600 to-teal-700`
- **Interactive Elements:** Cyan-teal hover states
- **Background:** Subtle cyan-teal patterns

Custom cursor effect and animations create an engaging user experience.

---

## 📡 API Routes

The backend server provides the following endpoints:

**Base URL:** `https://your-project.supabase.co/functions/v1/make-server-51d2d2e2`

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/signin` - Sign in existing user

### Appointments
- `POST /appointments` - Create new appointment
- `GET /appointments` - Get user's appointments
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment

### Medical Records
- `POST /medical-records/upload` - Upload document
- `GET /medical-records` - List user's records
- `DELETE /medical-records/:id` - Delete record
- `GET /medical-records/:id/url` - Get signed URL

### Insurance
- `POST /insurance/check-coverage` - Check insurance coverage
- `POST /insurance/claims` - Submit insurance claim
- `GET /insurance/claims` - Get user's claims
- `PUT /insurance/claims/:id` - Update claim status

### Payments
- `POST /payments/create-intent` - Create Stripe payment
- `POST /payments/upi` - Generate UPI QR code
- `GET /payments/verify/:id` - Verify payment status

### Subscriptions
- `POST /subscriptions` - Create subscription
- `GET /subscriptions/:userId` - Get subscription status

---

## 🔐 Authentication Flow

1. **Sign Up:**
   - User enters email/phone and password
   - Backend creates Supabase user with `email_confirm: true`
   - User profile stored in KV store
   - Auto-login after successful signup

2. **Sign In:**
   - Supports email (case-insensitive) or phone number
   - Supabase Auth validates credentials
   - Returns access token for API requests
   - Session persists across page reloads

3. **Protected Routes:**
   - Dashboard and features require authentication
   - Access token passed in `Authorization: Bearer <token>` header
   - Server validates token with Supabase Auth

---

## 💾 Data Storage

### KV Store (Key-Value Table)
Stores user data, appointments, claims, etc.:
```typescript
import * as kv from './supabase/functions/server/kv_store';

// Set data
await kv.set('user:123', { name: 'John', email: 'john@example.com' });

// Get data
const user = await kv.get('user:123');

// Get by prefix (e.g., all user records)
const allUsers = await kv.getByPrefix('user:');
```

### Supabase Storage
Medical records stored in private bucket:
- Bucket: `make-51d2d2e2-medical-records`
- Private access (signed URLs)
- Supports PDF, images (PNG, JPG)
- Automatic file management

---

## 🧪 Testing

### Test Accounts
Create test accounts through the Sign Up page, or use:
```
Email: test@medboro.com
Phone: +919876543210
Password: Test@123
```

### Test Payments (Stripe)
Use Stripe test cards:
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
```

### Test UPI
UPI generates QR codes in demo mode. No real payment processing.

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Import GitHub repository at [vercel.com](https://vercel.com)
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - No environment variables needed (uses Supabase client-side)

3. **Deploy to Netlify:**
   - Import GitHub repository at [netlify.com](https://netlify.com)
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### Backend (Already on Supabase)

Backend is automatically deployed when you run:
```bash
supabase functions deploy server
```

No additional deployment needed!

---

## 📱 Features Guide

### For Patients

#### Book Appointments
1. Search for hospitals or doctors by name/specialty
2. View available time slots
3. Select date and time
4. Complete payment
5. Receive confirmation (email/QR code)

#### Manage Medical Records
1. Navigate to Dashboard → My Health Hub → Medical Records
2. View hospital-uploaded documents (prescriptions, lab reports)
3. Upload your own documents
4. Search and filter records
5. Print or download PDFs

#### Check Insurance Coverage
1. Go to Dashboard → My Health Hub → Insurance
2. Select "Check Coverage"
3. Enter procedure or treatment name
4. Get AI-powered coverage analysis
5. Submit claims if needed

#### Get Support
1. Click Support in navigation
2. Select your issue category
3. Chat with AI assistant
4. Escalate to human support if needed

---

## 🐛 Troubleshooting

### Common Issues

**"Failed to fetch" errors:**
- Ensure Supabase function is deployed
- Check CORS headers in server code
- Verify project URL in `/utils/supabase/info.tsx`

**Authentication not working:**
- Confirm SUPABASE_ANON_KEY is correct
- Check email confirmation is set to `true`
- Verify access token is being sent in headers

**File uploads failing:**
- Ensure storage bucket exists
- Check bucket permissions (should be private)
- Verify signed URL generation

**Payments not processing:**
- Add STRIPE_SECRET_KEY to Supabase secrets
- Use Stripe test mode keys
- Check Stripe dashboard for logs

### Debug Mode

Enable console logging:
```typescript
// Frontend (utils/api.ts)
console.log('API Request:', url, options);

// Backend (supabase/functions/server/index.tsx)
app.use('*', logger(console.log));
```

---

## 📄 License

This project is for educational and prototyping purposes.

---

## 🤝 Support

For questions or issues:
1. Check this README thoroughly
2. Review Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
3. Check Stripe documentation: [stripe.com/docs](https://stripe.com/docs)
4. Review React Router docs: [reactrouter.com](https://reactrouter.com)

---

## 🎯 Next Steps

After setup, consider:
- [ ] Customize branding and colors
- [ ] Add email notifications (Supabase Email)
- [ ] Integrate real UPI payment gateway
- [ ] Add doctor/hospital admin portal
- [ ] Implement video consultation feature
- [ ] Add multi-language support
- [ ] Set up automated backups
- [ ] Configure custom domain
- [ ] Add analytics (Google Analytics, Mixpanel)
- [ ] Implement push notifications

---

## 🙏 Credits

Built with:
- React + TypeScript
- Supabase (Database, Auth, Storage, Functions)
- Stripe (Payments)
- Tailwind CSS (Styling)
- Lucide (Icons)
- Motion (Animations)

---

**Happy Coding! 🚀**

For the latest updates and documentation, visit your project repository.

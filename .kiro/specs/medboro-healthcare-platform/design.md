# Design Document

## Overview

Medboro is a full-stack healthcare management platform that provides end-to-end appointment booking, medical records management, insurance processing, and patient support services. The system follows a modern three-tier architecture with a React frontend, Supabase backend services, and Stripe payment integration.

### Key Design Principles

1. **User-Centric Design**: Intuitive interfaces with cyan-to-teal gradient theme for visual consistency
2. **Security First**: Private storage buckets, signed URLs, and secure authentication
3. **Scalability**: Key-value store design for efficient data access and horizontal scaling
4. **Real-time Responsiveness**: Optimistic UI updates with backend synchronization
5. **Accessibility**: WCAG-compliant components and keyboard navigation support

### Technology Stack

- **Frontend**: React 18, TypeScript, React Router v7, Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Edge Functions**: Deno runtime with Hono web framework
- **Payments**: Stripe API (Card, UPI)
- **AI/ML**: OpenAI integration for symptom analysis and chatbot
- **State Management**: React hooks with localStorage persistence
- **UI Components**: Radix UI primitives with custom styling

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React SPA (Vite)                                     │  │
│  │  - Pages (Dashboard, Booking, Records, etc.)         │  │
│  │  - Components (UI, Forms, Modals)                    │  │
│  │  - Utils (API client, helpers)                       │  │
│  │  - State (localStorage, React hooks)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Edge Functions                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Hono Server (/make-server-51d2d2e2)                 │  │
│  │  - Auth Routes (signup, signin)                      │  │
│  │  - Appointment Routes (CRUD)                         │  │
│  │  - Medical Records Routes (upload, list, delete)     │  │
│  │  - Insurance Routes (policy, coverage, claims)       │  │
│  │  - Payment Routes (Stripe integration)               │  │
│  │  - Support Routes (AI chatbot)                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   Supabase Storage       │  │   Supabase Database      │
│  ┌────────────────────┐  │  │  ┌────────────────────┐  │
│  │ medical-records    │  │  │  │ kv_store_51d2d2e2  │  │
│  │ bucket (private)   │  │  │  │ (key-value table)  │  │
│  │ - PDFs             │  │  │  │ - users            │  │
│  │ - Images           │  │  │  │ - appointments     │  │
│  │ - Signed URLs      │  │  │  │ - policies         │  │
│  └────────────────────┘  │  │  │ - records          │  │
└──────────────────────────┘  │  │ - chats            │  │
                              │  └────────────────────┘  │
                              └──────────────────────────┘
                                          │
                                          ▼
                              ┌──────────────────────────┐
                              │   External Services      │
                              │  - Stripe API            │
                              │  - OpenAI API            │
                              │  - Geolocation API       │
                              └──────────────────────────┘
```

### Data Flow Patterns

1. **Authentication Flow**:
   - User submits credentials → Frontend validates → API call to /auth/signin
   - Backend queries KV_Store by email/phone → Validates password → Returns user data
   - Frontend stores user in localStorage → Redirects to dashboard

2. **Appointment Booking Flow**:
   - User selects doctor/slot → Frontend stores in sessionStorage → Navigate to payment
   - User completes payment → Stripe confirms → Backend creates appointment in KV_Store
   - Backend returns appointment with QR code → Frontend displays confirmation

3. **Medical Records Flow**:
   - User uploads file → Frontend validates → FormData POST to /medical-records/upload
   - Backend validates → Uploads to Storage_Bucket → Generates signed URL
   - Backend stores metadata in KV_Store → Returns record object → Frontend displays

4. **Insurance Coverage Flow**:
   - User selects policy/treatment → Frontend sends to /insurance/check-coverage
   - Backend retrieves policy → Runs AI simulation → Calculates coverage
   - Backend stores report in KV_Store → Returns coverage details → Frontend displays

## Components and Interfaces

### Frontend Components

#### Core Pages
- **Landing**: Marketing page with feature highlights
- **SignUp/SignIn**: Authentication forms with validation
- **Dashboard**: Main hub with search, quick actions, and health hub
- **HospitalSearch**: Search interface with filters and results
- **DoctorList**: List of doctors for a hospital with booking CTA
- **SlotSelection**: Calendar view with available time slots
- **Payment**: Multi-method payment form with Stripe integration
- **AppointmentConfirmation**: QR code display with print/download
- **MedicalRecords**: Document list with upload, view, delete actions
- **InsuranceDashboard**: Policy management and coverage checking
- **Support**: AI chatbot interface with message history
- **PatientDashboard**: Comprehensive health management view
- **SubscriptionPlans**: Pricing cards with feature comparison

#### Reusable Components
- **Header**: Navigation bar with logo, search, location, notifications, user menu
- **Button**: Styled button with variants (primary, outline, ghost) and sizes
- **SOSButton**: Floating emergency button with red styling
- **AppointmentQRCode**: QR code generator with appointment details
- **GoogleMap**: Map component for location visualization
- **ProtectedRoute**: Route wrapper requiring authentication

#### UI Primitives (Radix UI)
- Dialog, Dropdown, Popover, Tooltip, Accordion, Tabs
- Calendar, Select, Checkbox, Radio, Switch
- Alert, Badge, Card, Separator, Skeleton

### Backend API Endpoints

#### Authentication
```typescript
POST /make-server-51d2d2e2/auth/signup
Request: { name, email, phone, password }
Response: { id, name, email, phone, createdAt }

POST /make-server-51d2d2e2/auth/signin
Request: { email, password }
Response: { id, name, email, phone, createdAt }
```

#### Appointments
```typescript
GET /make-server-51d2d2e2/appointments/user/:userId
Response: Appointment[]

GET /make-server-51d2d2e2/appointments/:appointmentId
Response: Appointment

POST /make-server-51d2d2e2/appointments
Request: AppointmentData
Response: Appointment

PUT /make-server-51d2d2e2/appointments/:appointmentId
Request: Partial<AppointmentData>
Response: Appointment

DELETE /make-server-51d2d2e2/appointments/:userId/:appointmentId
Response: { success: true }
```

#### Medical Records
```typescript
GET /make-server-51d2d2e2/medical-records/:userId
Response: MedicalRecord[]

POST /make-server-51d2d2e2/medical-records/upload
Request: FormData { file, name, category, userId }
Response: MedicalRecord

DELETE /make-server-51d2d2e2/medical-records/:recordId
Response: { success: true }

POST /make-server-51d2d2e2/medical-records/hospital-upload
Request: { userId, name, category, hospitalName, doctorName, fileUrl, fileType, size }
Response: MedicalRecord
```

#### Insurance
```typescript
POST /make-server-51d2d2e2/insurance/policy
Request: PolicyData
Response: Policy

GET /make-server-51d2d2e2/insurance/policies/:userId
Response: Policy[]

GET /make-server-51d2d2e2/insurance/policy/:policyId
Response: Policy

POST /make-server-51d2d2e2/insurance/check-coverage
Request: { userId, policyId, treatmentType, treatmentName, estimatedCost, hospitalType, roomType }
Response: CoverageReport

GET /make-server-51d2d2e2/insurance/reports/:userId
Response: CoverageReport[]

GET /make-server-51d2d2e2/insurance/report/:reportId
Response: CoverageReport
```

#### Payments
```typescript
POST /make-server-51d2d2e2/payments/create-intent
Request: { amount, currency, metadata, paymentMethod }
Response: { clientSecret, paymentIntentId }

GET /make-server-51d2d2e2/payments/:paymentIntentId
Response: { status, amount, currency }
```

#### Support
```typescript
POST /make-server-51d2d2e2/support/chat
Request: { userId, message, chatHistory }
Response: { message, shouldEscalate }

GET /make-server-51d2d2e2/support/history/:userId
Response: ChatMessage[]
```

#### Subscriptions
```typescript
GET /make-server-51d2d2e2/subscriptions/:userId
Response: Subscription

POST /make-server-51d2d2e2/subscriptions
Request: SubscriptionData
Response: Subscription
```

## Data Models

### User
```typescript
interface User {
  id: string;                    // Timestamp-based unique ID
  name: string;                  // Full name
  email: string;                 // Normalized to lowercase
  phone: string;                 // Phone number with country code
  password: string;              // Plain text (should be hashed in production)
  createdAt: string;             // ISO 8601 timestamp
}

// KV Store Keys:
// - user:{userId}
// - user:email:{email}
// - user:phone:{phone}
```

### Appointment
```typescript
interface Appointment {
  id: string;                    // Timestamp-based unique ID
  userId: string;                // Patient user ID
  patientName: string;           // Patient full name
  doctorId: string;              // Doctor unique ID
  doctorName: string;            // Doctor full name
  specialty: string;             // Medical specialty
  hospitalId: string;            // Hospital unique ID
  hospitalName: string;          // Hospital name
  date: string;                  // Appointment date (e.g., "January 30, 2026")
  time: string;                  // Appointment time (e.g., "10:00 AM")
  fee: number;                   // Consultation fee in USD
  status: 'upcoming' | 'completed' | 'cancelled';
  paymentId?: string;            // Stripe payment intent ID
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentMethod: 'card' | 'upi' | 'wallet';
  paymentTime: string;           // Payment timestamp
  upiId?: string;                // UPI ID if UPI payment
  createdAt: string;             // ISO 8601 timestamp
  updatedAt?: string;            // ISO 8601 timestamp
}

// KV Store Keys:
// - appointment:{userId}:{appointmentId}
```

### MedicalRecord
```typescript
interface MedicalRecord {
  id: string;                    // Format: {userId}_{timestamp}
  name: string;                  // Document name
  type: string;                  // Same as category
  category: 'prescription' | 'lab_report' | 'diagnostic_scan' | 'other';
  date: string;                  // Record date (YYYY-MM-DD)
  uploadedBy: 'user' | 'hospital';
  hospitalName?: string;         // If uploaded by hospital
  doctorName?: string;           // If uploaded by hospital
  fileUrl: string;               // Signed URL from Storage_Bucket
  fileName: string;              // Storage path: {userId}/{timestamp}_{random}.{ext}
  fileType: 'pdf' | 'image';     // File type for rendering
  size: string;                  // Human-readable size (e.g., "2.5 MB")
  uploadedAt: string;            // ISO 8601 timestamp
}

// KV Store Keys:
// - medical_record:{userId}:{recordId}

// Storage Bucket:
// - Bucket: make-51d2d2e2-medical-records
// - Path: {userId}/{timestamp}_{random}.{ext}
// - Access: Private with signed URLs (10-year validity)
```

### InsurancePolicy
```typescript
interface InsurancePolicy {
  id: string;                    // Format: policy_{timestamp}
  userId: string;                // Patient user ID
  provider: string;              // Insurance provider name
  policyNumber: string;          // Policy number
  sumInsured: number;            // Coverage amount
  waitingPeriodCompleted: boolean; // Whether waiting period is over
  updatedAt: string;             // ISO 8601 timestamp
}

// KV Store Keys:
// - insurance:policy:{policyId}
// - insurance:user:{userId}:policy:{policyId}
```

### CoverageReport
```typescript
interface CoverageReport {
  id: string;                    // Format: report_{timestamp}
  userId: string;                // Patient user ID
  policyId: string;              // Insurance policy ID
  policy: InsurancePolicy;       // Full policy object
  treatmentType: string;         // Type of treatment
  treatmentName: string;         // Specific treatment name
  estimatedCost?: number;        // Estimated treatment cost
  hospitalType?: string;         // Network or non-network
  roomType?: string;             // Room category
  status: 'full' | 'partial' | 'not_covered';
  coveragePercentage: number;    // 0-100
  coveredComponents: Array<{    // What's covered
    name: string;
    limit: number | null;        // null means no limit
  }>;
  sublimits: Array<{             // Category-specific limits
    category: string;
    description: string;
    amount: number;
  }>;
  copay: number;                 // Co-payment percentage
  waitingPeriodStatus: {
    isCompleted: boolean;
    message: string;
    remainingDays: number | null;
  };
  estimatedCoverage: number;     // Amount covered by insurance
  estimatedOutOfPocket: number;  // Amount patient pays
  createdAt: string;             // ISO 8601 timestamp
}

// KV Store Keys:
// - insurance:report:{reportId}
// - insurance:user:{userId}:report:{reportId}
```

### ChatMessage
```typescript
interface ChatMessage {
  id: string;                    // Format: msg_{timestamp}
  userId: string;                // Patient user ID
  userMessage: string;           // User's message
  aiResponse: string;            // AI assistant's response
  shouldEscalate: boolean;       // Whether to suggest human support
  timestamp: string;             // ISO 8601 timestamp
}

// KV Store Keys:
// - chat:{userId}:{messageId}
```

### Subscription
```typescript
interface Subscription {
  userId: string;                // Patient user ID
  plan: 'free' | 'basic' | 'premium' | 'family';
  status: 'none' | 'active' | 'expired' | 'cancelled';
  startDate?: string;            // ISO 8601 timestamp
  endDate?: string;              // ISO 8601 timestamp
  createdAt: string;             // ISO 8601 timestamp
}

// KV Store Keys:
// - subscription:{userId}
```

### PaymentIntent (Stripe)
```typescript
interface PaymentIntentRequest {
  amount: number;                // Amount in dollars (converted to cents)
  currency: string;              // 'usd' or 'inr'
  metadata: {
    appointmentId: string;
    userId: string;
    doctorName: string;
    upiId?: string;              // For UPI payments
  };
  paymentMethod: 'card' | 'upi';
}

interface PaymentIntentResponse {
  clientSecret: string;          // For Stripe.js
  paymentIntentId: string;       // Stripe payment intent ID
}
```

### KV Store Implementation

The KV store is implemented as a Supabase PostgreSQL table with the following schema:

```sql
CREATE TABLE kv_store_51d2d2e2 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_kv_prefix ON kv_store_51d2d2e2 (key text_pattern_ops);
```

Key operations:
- `set(key, value)`: Insert or update a key-value pair
- `get(key)`: Retrieve value by exact key
- `getByPrefix(prefix)`: Retrieve all values with keys starting with prefix
- `del(key)`: Delete a key-value pair
- `mset(keys, values)`: Batch insert/update multiple key-value pairs

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: User Registration Creates Unique Accounts

*For any* valid user registration data (name, email, phone, password), creating a user account should result in a unique user ID and storage in KV_Store with three lookup keys (by ID, by normalized lowercase email, and by phone number).

**Validates: Requirements 1.1, 1.7**

### Property 2: Duplicate User Prevention

*For any* existing user, attempting to register another user with the same email (case-insensitive) or phone number should be rejected with an error, preventing duplicate accounts.

**Validates: Requirements 1.2, 1.3**

### Property 3: Authentication Correctness

*For any* user account, signing in with correct credentials (email or phone + password) should return user data without password, and signing in with incorrect credentials should be rejected with an error.

**Validates: Requirements 1.4, 1.5**

### Property 4: Email Normalization

*For any* email address with mixed case, the system should normalize it to lowercase for storage and lookup, enabling case-insensitive authentication.

**Validates: Requirements 1.6**

### Property 5: Comprehensive Search

*For any* search query and collection of hospitals/doctors, search results should include all items where the query matches hospital name, doctor name, specialty, or symptoms (case-insensitive).

**Validates: Requirements 2.1, 2.7, 2.8**

### Property 6: Doctor Data Completeness

*For any* hospital, fetching its doctors should return complete doctor objects including specialty, experience, consultation fee, rating, and review count.

**Validates: Requirements 2.5**

### Property 7: Premium Feature Access Control

*For any* user without an active premium subscription, attempting to access the symptom checker should be denied.

**Validates: Requirements 3.7**

### Property 8: Appointment Slot Intervals

*For any* doctor's available slots, consecutive time slots should be exactly 30 minutes apart.

**Validates: Requirements 4.1**

### Property 9: Appointment Creation Completeness

*For any* successful payment, the created appointment should have status "upcoming" and include all required fields: patient name, doctor name, hospital name, date, time, specialty, fee, payment ID, payment method, payment status, and payment time.

**Validates: Requirements 4.4, 4.7, 5.10**

### Property 10: Unique Appointment IDs

*For any* set of created appointments, all appointment IDs should be unique.

**Validates: Requirements 4.5**

### Property 11: Appointment Storage Structure

*For any* created appointment, it should be stored in KV_Store with key format `appointment:{userId}:{appointmentId}` for efficient user-specific querying.

**Validates: Requirements 4.6**

### Property 12: Appointment Retrieval

*For any* user with multiple appointments, fetching their appointments should return all appointments (both upcoming and past) associated with that user ID.

**Validates: Requirements 4.8**

### Property 13: Appointment Status Transitions

*For any* appointment, rescheduling should update the date/time while maintaining the appointment ID, and cancellation should change status to "cancelled" without deleting the record.

**Validates: Requirements 4.10, 4.11**

### Property 14: UPI ID Validation

*For any* UPI payment attempt, the UPI ID should be validated to contain the "@" character, rejecting invalid formats.

**Validates: Requirements 5.4**

### Property 15: UPI Payment Intent Currency

*For any* UPI payment, the created Stripe payment intent should use INR currency (not USD).

**Validates: Requirements 5.5**

### Property 16: Payment Intent Metadata

*For any* payment intent creation, the request should include appointment metadata (appointmentId, userId, doctorName).

**Validates: Requirements 5.6**

### Property 17: Medical Record Upload Validation

*For any* file upload attempt, the system should validate that the file type is PDF, JPG, or PNG, and the file size is at most 10MB, rejecting files that fail either check.

**Validates: Requirements 6.1, 6.2**

### Property 18: Medical Record Upload Completeness

*For any* valid file upload, the system should upload to Storage_Bucket with a unique filename, generate a signed URL valid for 10 years, and store complete metadata in KV_Store including name, category, date, fileUrl, fileName, fileType, size, and uploadedBy.

**Validates: Requirements 6.3, 6.4, 6.5**

### Property 19: Medical Record Categories

*For any* medical record, the category should be one of: "prescription", "lab_report", "diagnostic_scan", or "other".

**Validates: Requirements 6.6**

### Property 20: Medical Record Sorting

*For any* user's medical records, fetching them should return records sorted by date in descending order (newest first).

**Validates: Requirements 6.7**

### Property 21: Medical Record Upload Source

*For any* medical record, it should have an uploadedBy field with value either "user" or "hospital", distinguishing the source.

**Validates: Requirements 6.8**

### Property 22: Medical Record Deletion Authorization

*For any* medical record deletion attempt, only records with uploadedBy="user" should be deletable; hospital-uploaded records should be protected from deletion.

**Validates: Requirements 6.9, 6.14**

### Property 23: Medical Record Deletion Completeness

*For any* successful record deletion, both the file in Storage_Bucket and the metadata in KV_Store should be removed.

**Validates: Requirements 6.10**

### Property 24: Insurance Policy Data Completeness

*For any* insurance policy creation, the stored policy should include provider name, policy number, sum insured, and waiting period status.

**Validates: Requirements 7.1**

### Property 25: Multiple Policies Per User

*For any* user, the system should support storing and retrieving multiple insurance policies with unique policy IDs.

**Validates: Requirements 7.2**

### Property 26: Coverage Check Required Fields

*For any* coverage check request, the system should require policy selection, treatment type, and treatment name, rejecting requests missing any required field.

**Validates: Requirements 7.3**

### Property 27: Coverage Status Values

*For any* coverage report, the status should be one of: "full", "partial", or "not_covered".

**Validates: Requirements 7.5**

### Property 28: Coverage Calculation Correctness

*For any* coverage check with valid policy and treatment, the system should calculate coverage percentage, co-pay amount, estimated coverage, and estimated out-of-pocket costs such that: estimatedCoverage = (estimatedCost × coveragePercentage / 100) and estimatedOutOfPocket = estimatedCost - estimatedCoverage.

**Validates: Requirements 7.6**

### Property 29: Coverage Report Completeness

*For any* coverage check, the generated report should include status, coveragePercentage, coveredComponents, sublimits, copay, waitingPeriodStatus, estimatedCoverage, and estimatedOutOfPocket.

**Validates: Requirements 7.7, 7.8, 7.9, 7.17**

### Property 30: Coverage Report Persistence

*For any* generated coverage report, it should be stored in KV_Store with keys for both report ID and user-specific lookup.

**Validates: Requirements 7.18**

### Property 31: Claim Type Distinction

*For any* coverage report, the guidance should distinguish between cashless claims (for network hospitals) and reimbursement claims (for any hospital).

**Validates: Requirements 7.20**

### Property 32: Chat Message Storage

*For any* chat message exchange, both the user message and AI response should be stored in KV_Store with key format `chat:{userId}:{messageId}` and sorted by timestamp when retrieved.

**Validates: Requirements 8.3, 8.15, 8.16**

### Property 33: Chat Intent Detection

*For any* chat message containing specific keywords ("appointment", "insurance", "payment", "emergency"), the system should detect the corresponding intent and generate an appropriate response category.

**Validates: Requirements 8.4**

### Property 34: Chat Escalation Trigger

*For any* chat message containing keywords indicating serious issues ("not working", "error", "failed", "problem"), the system should set shouldEscalate flag to true.

**Validates: Requirements 8.14**

### Property 35: Subscription Storage

*For any* subscription creation or update, the subscription should be stored in KV_Store with key format `subscription:{userId}`.

**Validates: Requirements 10.7**

### Property 36: Subscription Status Values

*For any* subscription, the status should be one of: "none", "active", "expired", or "cancelled".

**Validates: Requirements 10.8**

### Property 37: Premium Feature Restriction

*For any* user, access to premium features (symptom checker) should be granted only if their subscription status is "active" and plan is "basic", "premium", or "family".

**Validates: Requirements 10.9**

## Error Handling

### Authentication Errors

- **Duplicate Registration**: Return 409 Conflict with message "User with this email/phone already exists"
- **Invalid Credentials**: Return 401 Unauthorized with message "Invalid email or password"
- **Missing Fields**: Return 400 Bad Request with message specifying missing field

### File Upload Errors

- **Invalid File Type**: Return 400 Bad Request with message "Only PDF, JPG, and PNG files are allowed"
- **File Too Large**: Return 400 Bad Request with message "File size must be less than 10MB"
- **Upload Failure**: Return 500 Internal Server Error with message "Failed to upload file"

### Payment Errors

- **Invalid UPI ID**: Return 400 Bad Request with message "Please enter a valid UPI ID (e.g., yourname@paytm)"
- **Payment Intent Creation Failed**: Return 500 Internal Server Error with Stripe error message
- **Payment Confirmation Failed**: Return 500 Internal Server Error with message "Payment was not successful"

### Authorization Errors

- **Unauthorized Deletion**: Return 403 Forbidden with message "Hospital-uploaded records cannot be deleted"
- **Premium Feature Access**: Return 403 Forbidden with message "This feature requires a premium subscription"

### Not Found Errors

- **User Not Found**: Return 404 Not Found with message "User not found"
- **Appointment Not Found**: Return 404 Not Found with message "Appointment not found"
- **Record Not Found**: Return 404 Not Found with message "Record not found"
- **Policy Not Found**: Return 404 Not Found with message "Policy not found"

### Validation Errors

- **Missing Required Fields**: Return 400 Bad Request with message "Missing required fields"
- **Invalid Data Format**: Return 400 Bad Request with message specifying the validation error

### General Error Handling

All API endpoints follow consistent error response format:
```typescript
{
  error: string;  // Human-readable error message
}
```

Frontend error handling:
- Display error messages in toast notifications (using Sonner)
- Log errors to console for debugging
- Provide retry mechanisms for transient failures
- Graceful degradation for non-critical features

## Testing Strategy

### Dual Testing Approach

The Medboro platform requires both unit testing and property-based testing for comprehensive coverage:

**Unit Tests** focus on:
- Specific examples of authentication flows (valid signup, invalid credentials)
- Edge cases (empty file uploads, boundary file sizes, special characters in names)
- Error conditions (network failures, invalid API responses)
- Integration points (Stripe webhook handling, Supabase storage callbacks)
- UI component rendering and user interactions

**Property-Based Tests** focus on:
- Universal properties across all inputs (user creation, search, validation)
- Data integrity (storage structure, retrieval completeness)
- Business rules (coverage calculations, access control)
- Comprehensive input coverage through randomization

### Property-Based Testing Configuration

**Testing Library**: Use `fast-check` for JavaScript/TypeScript property-based testing

**Test Configuration**:
- Minimum 100 iterations per property test
- Each test must reference its design document property
- Tag format: `Feature: medboro-healthcare-platform, Property {number}: {property_text}`

**Example Property Test Structure**:
```typescript
import fc from 'fast-check';

// Feature: medboro-healthcare-platform, Property 1: User Registration Creates Unique Accounts
test('user registration creates unique accounts with proper storage', () => {
  fc.assert(
    fc.property(
      fc.record({
        name: fc.string({ minLength: 1 }),
        email: fc.emailAddress(),
        phone: fc.string({ minLength: 10, maxLength: 15 }),
        password: fc.string({ minLength: 6 })
      }),
      async (userData) => {
        const user = await signUp(userData);
        
        // Verify unique ID
        expect(user.id).toBeDefined();
        
        // Verify storage with three keys
        const byId = await kv.get(`user:${user.id}`);
        const byEmail = await kv.get(`user:email:${userData.email.toLowerCase()}`);
        const byPhone = await kv.get(`user:phone:${userData.phone}`);
        
        expect(byId).toEqual(user);
        expect(byEmail).toEqual(user);
        expect(byPhone).toEqual(user);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing Balance

Unit tests should focus on:
- **Specific Examples**: Test the welcome message on chat initialization, default location fallback to Mumbai
- **Edge Cases**: Empty search queries, files exactly at 10MB limit, UPI IDs with multiple @ symbols
- **Error Conditions**: Network timeouts, Stripe API failures, storage quota exceeded
- **Integration**: Stripe webhook processing, Supabase auth callbacks, file upload progress

Avoid writing too many unit tests for scenarios that property tests cover (e.g., don't write 50 unit tests for different user registration combinations when a property test covers all cases).

### Test Coverage Goals

- **Backend API Routes**: 90%+ code coverage
- **Frontend Components**: 80%+ code coverage
- **Business Logic**: 95%+ code coverage with property tests
- **Integration Points**: 100% coverage with unit tests

### Testing Tools

- **Unit Testing**: Vitest (for both frontend and backend)
- **Property Testing**: fast-check
- **Component Testing**: React Testing Library
- **E2E Testing**: Playwright (for critical user flows)
- **API Testing**: Supertest with Hono
- **Mocking**: Vitest mocks for Supabase and Stripe

### Continuous Integration

- Run all tests on every pull request
- Property tests run with 100 iterations in CI
- E2E tests run on staging environment before production deployment
- Performance benchmarks for critical paths (search, payment processing)

# Requirements Document

## Introduction

Medboro is a comprehensive healthcare appointment booking and management platform that connects patients with healthcare providers. The system provides end-to-end healthcare management including appointment booking, medical records management, insurance claims processing, AI-powered symptom checking, payment processing, and 24/7 customer support. The platform is built with React, TypeScript, Supabase, and Stripe to deliver a modern, secure, and user-friendly healthcare experience.

## Glossary

- **System**: The Medboro healthcare platform
- **Patient**: A registered user seeking healthcare services
- **Provider**: A doctor or healthcare professional offering services
- **Hospital**: A healthcare facility with multiple providers
- **Appointment**: A scheduled consultation between a patient and provider
- **Medical_Record**: A digital document containing health information
- **Insurance_Policy**: A health insurance plan with coverage details
- **Coverage_Report**: An AI-generated analysis of insurance coverage
- **Payment_Intent**: A Stripe payment session for processing transactions
- **Chat_Session**: An AI-powered support conversation
- **Subscription**: A premium membership plan
- **KV_Store**: The key-value database for storing application data
- **Storage_Bucket**: Supabase storage for medical documents
- **Slot**: A 30-minute time window for appointments
- **QR_Code**: A scannable code for appointment verification

## Requirements

### Requirement 1: Patient Authentication

**User Story:** As a patient, I want to create an account and sign in securely, so that I can access personalized healthcare services.

#### Acceptance Criteria

1. WHEN a patient provides name, email, phone, and password, THE System SHALL create a new user account with a unique identifier
2. WHEN a patient attempts to sign up with an existing email, THE System SHALL prevent duplicate registration and return an error message
3. WHEN a patient attempts to sign up with an existing phone number, THE System SHALL prevent duplicate registration and return an error message
4. WHEN a patient signs in with email or phone and correct password, THE System SHALL authenticate the user and return user data without password
5. WHEN a patient signs in with incorrect credentials, THE System SHALL reject authentication and return an error message
6. THE System SHALL normalize email addresses to lowercase for case-insensitive lookup
7. THE System SHALL store user data in the KV_Store with keys for ID, email, and phone lookups
8. WHEN authentication succeeds, THE System SHALL persist the session in localStorage for subsequent requests

### Requirement 2: Hospital and Doctor Search

**User Story:** As a patient, I want to search for hospitals and doctors by name, specialty, or location, so that I can find appropriate healthcare providers.

#### Acceptance Criteria

1. WHEN a patient enters a search query, THE System SHALL search across hospital names, doctor names, specialties, and symptoms
2. WHEN a patient enables location services, THE System SHALL use geolocation coordinates to find nearby providers
3. WHEN geolocation fails or is denied, THE System SHALL use a default location (Mumbai, India coordinates)
4. WHEN a patient selects a hospital, THE System SHALL display hospital details including rating, reviews, and available doctors
5. WHEN a patient views a hospital, THE System SHALL list all doctors with their specialties, experience, and consultation fees
6. THE System SHALL display doctor ratings, review counts, and estimated wait times
7. WHEN a patient searches by specialty, THE System SHALL filter doctors by the selected medical specialty
8. THE System SHALL support search queries that combine multiple criteria (name, location, specialty)

### Requirement 3: AI-Powered Symptom Checker

**User Story:** As a patient, I want to describe my symptoms and receive AI-powered recommendations, so that I can find appropriate medical care.

#### Acceptance Criteria

1. WHEN a patient describes symptoms in natural language, THE System SHALL analyze the input and identify potential conditions
2. WHEN symptom analysis completes, THE System SHALL recommend relevant medical specialties
3. WHEN symptom analysis completes, THE System SHALL suggest appropriate doctors based on the identified conditions
4. THE System SHALL display recommended doctors with their specialties, ratings, and availability
5. WHEN a patient selects a recommended doctor, THE System SHALL navigate to the appointment booking flow
6. THE System SHALL include a disclaimer that AI suggestions are not medical diagnoses
7. THE System SHALL be available only to premium subscription members

### Requirement 4: Appointment Booking System

**User Story:** As a patient, I want to book appointments with doctors at specific times, so that I can receive medical care when convenient.

#### Acceptance Criteria

1. WHEN a patient selects a doctor, THE System SHALL display available time slots in 30-minute intervals
2. WHEN a patient selects a date and time slot, THE System SHALL reserve the slot temporarily during booking
3. WHEN a patient confirms booking details, THE System SHALL navigate to payment processing
4. WHEN payment succeeds, THE System SHALL create an appointment with status "upcoming"
5. THE System SHALL generate a unique appointment ID using timestamp
6. THE System SHALL store appointments in KV_Store with user-specific keys for efficient querying
7. WHEN an appointment is created, THE System SHALL include patient name, doctor name, hospital name, date, time, specialty, and fee
8. THE System SHALL allow patients to view all their appointments (upcoming and past)
9. WHEN a patient views appointment details, THE System SHALL display a QR code for verification
10. THE System SHALL support appointment rescheduling with free reschedule allowance
11. THE System SHALL support appointment cancellation
12. THE System SHALL provide a 15-minute late arrival buffer for appointments

### Requirement 5: Payment Processing

**User Story:** As a patient, I want to pay for appointments using multiple payment methods, so that I can complete bookings conveniently.

#### Acceptance Criteria

1. WHEN a patient proceeds to payment, THE System SHALL display booking summary with consultation fee and platform fee
2. THE System SHALL support credit card, debit card, UPI, and digital wallet payment methods
3. WHEN a patient selects card payment, THE System SHALL integrate with Stripe to process the transaction
4. WHEN a patient selects UPI payment, THE System SHALL validate UPI ID format (contains "@")
5. WHEN a patient selects UPI payment, THE System SHALL create a Stripe payment intent with INR currency
6. WHEN payment processing begins, THE System SHALL create a payment intent with appointment metadata
7. WHEN card payment succeeds, THE System SHALL confirm the payment with Stripe and create the appointment
8. WHEN UPI payment succeeds, THE System SHALL verify payment status and create the appointment
9. WHEN payment fails, THE System SHALL display an error message and allow retry
10. THE System SHALL store payment ID, payment method, payment status, and payment time with appointments
11. WHEN payment succeeds, THE System SHALL display a QR code for appointment verification
12. THE System SHALL support printing and downloading the appointment QR code

### Requirement 6: Medical Records Management

**User Story:** As a patient, I want to upload, view, and manage my medical records, so that I can maintain a complete health history.

#### Acceptance Criteria

1. WHEN a patient uploads a medical record, THE System SHALL validate file type (PDF, JPG, PNG only)
2. WHEN a patient uploads a medical record, THE System SHALL validate file size (maximum 10MB)
3. WHEN file validation passes, THE System SHALL upload the file to Storage_Bucket with a unique filename
4. WHEN file upload succeeds, THE System SHALL generate a signed URL valid for 10 years
5. THE System SHALL store record metadata in KV_Store including name, category, date, file URL, and file type
6. THE System SHALL categorize records as prescriptions, lab reports, diagnostic scans, or other
7. WHEN a patient views medical records, THE System SHALL display all records sorted by date (newest first)
8. THE System SHALL distinguish between user-uploaded records and hospital-uploaded records
9. WHEN a patient deletes a record, THE System SHALL only allow deletion of user-uploaded records
10. WHEN a record is deleted, THE System SHALL remove the file from Storage_Bucket and metadata from KV_Store
11. THE System SHALL support viewing PDF records in browser
12. THE System SHALL support downloading records
13. THE System SHALL support printing records
14. WHEN a hospital uploads a record after an appointment, THE System SHALL mark it as hospital-uploaded and prevent patient deletion

### Requirement 7: Insurance Claims Processing

**User Story:** As a patient, I want to check insurance coverage and file claims, so that I can understand my financial obligations.

#### Acceptance Criteria

1. WHEN a patient adds an insurance policy, THE System SHALL store provider name, policy number, sum insured, and waiting period status
2. THE System SHALL allow patients to manage multiple insurance policies
3. WHEN a patient checks treatment coverage, THE System SHALL require policy selection, treatment type, and treatment name
4. WHEN coverage check is requested, THE System SHALL analyze policy details against treatment requirements
5. THE System SHALL determine coverage status as "full", "partial", or "not_covered"
6. THE System SHALL calculate coverage percentage, co-pay amount, and estimated out-of-pocket costs
7. THE System SHALL identify covered components (room rent, doctor fees, medicines, etc.)
8. THE System SHALL identify sublimits for specific categories
9. THE System SHALL evaluate waiting period status and remaining days
10. WHEN treatment is hospitalization, THE System SHALL apply 90% coverage with 10% co-pay
11. WHEN treatment is surgery, THE System SHALL apply 85% coverage with 15% co-pay and check 2-year waiting period
12. WHEN treatment is daycare procedures, THE System SHALL apply 95% coverage with 5% co-pay and no waiting period
13. WHEN treatment is diagnostics, THE System SHALL apply 50% coverage with annual sublimits
14. WHEN treatment is maternity, THE System SHALL require waiting period completion and apply 80% coverage
15. WHEN treatment is critical illness, THE System SHALL apply 100% coverage with 90-day waiting period
16. WHEN treatment is OPD, THE System SHALL mark as not covered
17. THE System SHALL generate a coverage report with all analysis details
18. THE System SHALL store coverage reports in KV_Store for future reference
19. WHEN a patient views coverage results, THE System SHALL provide step-by-step claim guidance
20. THE System SHALL distinguish between cashless claims (network hospitals) and reimbursement claims

### Requirement 8: AI Chatbot Support

**User Story:** As a patient, I want to chat with an AI assistant for help, so that I can get instant answers to my questions.

#### Acceptance Criteria

1. WHEN a patient opens support chat, THE System SHALL display a welcome message from the AI assistant
2. WHEN a patient sends a message, THE System SHALL process the message and generate a contextual response
3. THE System SHALL maintain chat history for context in subsequent messages
4. THE System SHALL detect intent from keywords (appointment, insurance, payment, emergency, etc.)
5. WHEN intent is appointment booking, THE System SHALL provide step-by-step booking instructions
6. WHEN intent is insurance, THE System SHALL explain coverage checking and claim filing
7. WHEN intent is medical records, THE System SHALL explain how to access and upload documents
8. WHEN intent is payment issues, THE System SHALL provide troubleshooting steps
9. WHEN intent is account settings, THE System SHALL explain profile management options
10. WHEN intent is emergency, THE System SHALL provide emergency contact numbers and SOS feature instructions
11. WHEN intent is subscription, THE System SHALL explain premium plan features and pricing
12. WHEN intent is technical issues, THE System SHALL provide troubleshooting steps
13. WHEN the AI cannot understand the query, THE System SHALL ask for clarification
14. WHEN a message indicates serious issues, THE System SHALL suggest escalation to human support
15. THE System SHALL store chat messages in KV_Store with user-specific keys
16. THE System SHALL display chat history sorted by timestamp
17. THE System SHALL provide quick action buttons for common queries
18. THE System SHALL be available 24/7 without human intervention

### Requirement 9: Patient Dashboard

**User Story:** As a patient, I want a centralized dashboard to manage all my health activities, so that I can access everything in one place.

#### Acceptance Criteria

1. WHEN a patient accesses the dashboard, THE System SHALL display a personalized welcome message with the patient's name
2. THE System SHALL display the next upcoming appointment with date, time, doctor name, and specialty
3. WHEN no appointments are scheduled, THE System SHALL display "None scheduled"
4. THE System SHALL provide quick access cards for booking appointments, symptom checker, and today's status
5. THE System SHALL display pending reports count
6. THE System SHALL display remaining free reschedules count
7. THE System SHALL provide a central search bar for hospitals, doctors, specialties, and symptoms
8. THE System SHALL provide a location button to enable geolocation for nearby searches
9. WHEN location is enabled, THE System SHALL display "Near Me" status with green indicator
10. THE System SHALL display notification bell with unread count indicator
11. THE System SHALL provide access to My Health Hub with links to appointments, medical records, insurance, and support
12. THE System SHALL display user avatar with first initial
13. THE System SHALL provide navigation to subscription plans
14. THE System SHALL display an SOS button for emergency access
15. THE System SHALL show smart slot booking features (30-minute slots, 15-minute buffer, free reschedule)

### Requirement 10: Subscription Plans

**User Story:** As a patient, I want to subscribe to premium plans, so that I can access advanced features and benefits.

#### Acceptance Criteria

1. THE System SHALL offer three subscription tiers: Basic, Premium, and Family
2. WHEN Basic plan is selected, THE System SHALL provide priority booking, 10% consultation discount, and teleconsultation
3. WHEN Premium plan is selected, THE System SHALL provide all Basic features plus unlimited AI symptom checker, free ambulance once per year, and insurance comparison
4. WHEN Family plan is selected, THE System SHALL provide all Premium features plus coverage for up to 6 family members, dedicated health manager, and 24/7 priority support
5. THE System SHALL display monthly pricing for each plan (₹99, ₹199, ₹499)
6. WHEN a patient subscribes, THE System SHALL process payment through Stripe
7. THE System SHALL store subscription details in KV_Store with user ID
8. THE System SHALL track subscription status (active, expired, cancelled)
9. THE System SHALL restrict premium features (symptom checker) to subscribed users
10. WHEN a patient views subscription status, THE System SHALL display current plan and expiration date

### Requirement 11: Emergency SOS Button

**User Story:** As a patient, I want quick access to emergency services, so that I can get help in urgent situations.

#### Acceptance Criteria

1. THE System SHALL display a prominent red SOS button on all pages
2. WHEN the SOS button is clicked, THE System SHALL navigate to emergency status page
3. THE System SHALL display emergency contact numbers (112, 108, 100, 101)
4. THE System SHALL provide instructions for activating SOS features
5. WHEN SOS is activated, THE System SHALL share the patient's live location
6. WHEN SOS is activated, THE System SHALL notify emergency contacts
7. WHEN SOS is activated, THE System SHALL find nearest hospitals with emergency services
8. THE System SHALL provide ambulance tracking capability
9. THE System SHALL filter hospitals by "Emergency 24x7" availability

### Requirement 12: Admin Dashboard

**User Story:** As an administrator, I want to manage the platform, so that I can monitor operations and handle issues.

#### Acceptance Criteria

1. THE System SHALL provide an admin dashboard accessible at /admin route
2. THE System SHALL display platform statistics (total users, appointments, revenue)
3. THE System SHALL allow viewing all appointments across all users
4. THE System SHALL allow viewing all medical records
5. THE System SHALL allow viewing all insurance claims
6. THE System SHALL allow viewing all support chat sessions
7. THE System SHALL provide user management capabilities
8. THE System SHALL provide hospital and doctor management capabilities
9. THE System SHALL display analytics and reports
10. THE System SHALL require admin authentication for access

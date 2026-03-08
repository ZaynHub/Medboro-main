import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-51d2d2e2/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTH ROUTES ====================

// Sign up - Create new user account
app.post("/make-server-51d2d2e2/auth/signup", async (c) => {
  try {
    const { name, email, phone, password } = await c.req.json();
    
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();
    
    console.log("Signup attempt for email:", normalizedEmail);
    
    // Check if user already exists by email
    const existingUserByEmail = await kv.get(`user:email:${normalizedEmail}`);
    if (existingUserByEmail) {
      console.log("User already exists with email:", normalizedEmail);
      return c.json({ error: "User with this email already exists" }, 409);
    }
    
    // Check if user already exists by phone
    const existingUserByPhone = await kv.get(`user:phone:${phone}`);
    if (existingUserByPhone) {
      console.log("User already exists with phone:", phone);
      return c.json({ error: "User with this phone number already exists" }, 409);
    }
    
    // Create new user
    const userId = Date.now().toString();
    const user = {
      id: userId,
      name,
      email: normalizedEmail,
      phone,
      password, // In production, this should be hashed!
      createdAt: new Date().toISOString(),
    };
    
    // Store user by ID, email, and phone for lookup
    await kv.set(`user:${userId}`, user);
    await kv.set(`user:email:${normalizedEmail}`, user);
    await kv.set(`user:phone:${phone}`, user);
    
    console.log("User created successfully:", userId, normalizedEmail);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return c.json(userWithoutPassword);
  } catch (error) {
    console.log("Error during signup:", error);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

// Sign in - Authenticate user
app.post("/make-server-51d2d2e2/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    console.log("Signin attempt for email/phone:", email);
    
    // Normalize email to lowercase for case-insensitive lookup
    const normalizedEmail = email.toLowerCase().trim();
    
    // Try to get user by email first
    let user = await kv.get(`user:email:${normalizedEmail}`);
    
    // If not found by email, try phone lookup
    if (!user) {
      console.log("User not found by email, trying phone lookup:", email);
      user = await kv.get(`user:phone:${email}`);
    }
    
    if (!user) {
      console.log("User not found with email/phone:", email);
      return c.json({ error: "Invalid email or password" }, 401);
    }
    
    console.log("User found:", normalizedEmail, "Checking password...");
    
    // Check password (in production, compare hashed passwords)
    if (user.password !== password) {
      console.log("Invalid password for user:", normalizedEmail);
      return c.json({ error: "Invalid email or password" }, 401);
    }
    
    console.log("Login successful for user:", normalizedEmail);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return c.json(userWithoutPassword);
  } catch (error) {
    console.log("Error during signin:", error);
    return c.json({ error: "Failed to sign in" }, 500);
  }
});

// ==================== USER ROUTES ====================

// Get user profile
app.get("/make-server-51d2d2e2/users/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    
    return c.json(user);
  } catch (error) {
    console.log("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

// Create or update user
app.post("/make-server-51d2d2e2/users", async (c) => {
  try {
    const userData = await c.req.json();
    const userId = userData.id || Date.now().toString();
    const user = { ...userData, id: userId, createdAt: new Date().toISOString() };
    
    await kv.set(`user:${userId}`, user);
    
    return c.json(user);
  } catch (error) {
    console.log("Error creating user:", error);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// ==================== APPOINTMENT ROUTES ====================

// Get all appointments for a user
app.get("/make-server-51d2d2e2/appointments/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const appointments = await kv.getByPrefix(`appointment:${userId}:`);
    
    return c.json(appointments || []);
  } catch (error) {
    console.log("Error fetching appointments:", error);
    return c.json({ error: "Failed to fetch appointments" }, 500);
  }
});

// Get single appointment
app.get("/make-server-51d2d2e2/appointments/:appointmentId", async (c) => {
  try {
    const appointmentId = c.req.param("appointmentId");
    const appointment = await kv.get(`appointment:${appointmentId}`);
    
    if (!appointment) {
      return c.json({ error: "Appointment not found" }, 404);
    }
    
    return c.json(appointment);
  } catch (error) {
    console.log("Error fetching appointment:", error);
    return c.json({ error: "Failed to fetch appointment" }, 500);
  }
});

// Create new appointment
app.post("/make-server-51d2d2e2/appointments", async (c) => {
  try {
    const appointmentData = await c.req.json();
    const appointmentId = appointmentData.id || Date.now().toString();
    const userId = appointmentData.userId || "guest";
    
    const appointment = {
      ...appointmentData,
      id: appointmentId,
      userId,
      status: appointmentData.status || "upcoming",
      createdAt: new Date().toISOString(),
    };
    
    // Store with user-specific key for easy querying
    await kv.set(`appointment:${userId}:${appointmentId}`, appointment);
    
    return c.json(appointment);
  } catch (error) {
    console.log("Error creating appointment:", error);
    return c.json({ error: "Failed to create appointment" }, 500);
  }
});

// Update appointment (reschedule, cancel, etc.)
app.put("/make-server-51d2d2e2/appointments/:appointmentId", async (c) => {
  try {
    const appointmentId = c.req.param("appointmentId");
    const updates = await c.req.json();
    
    // Get existing appointment
    const userId = updates.userId || "guest";
    const existingAppointment = await kv.get(`appointment:${userId}:${appointmentId}`);
    
    if (!existingAppointment) {
      return c.json({ error: "Appointment not found" }, 404);
    }
    
    const updatedAppointment = {
      ...existingAppointment,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`appointment:${userId}:${appointmentId}`, updatedAppointment);
    
    return c.json(updatedAppointment);
  } catch (error) {
    console.log("Error updating appointment:", error);
    return c.json({ error: "Failed to update appointment" }, 500);
  }
});

// Delete appointment
app.delete("/make-server-51d2d2e2/appointments/:userId/:appointmentId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const appointmentId = c.req.param("appointmentId");
    
    await kv.del(`appointment:${userId}:${appointmentId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting appointment:", error);
    return c.json({ error: "Failed to delete appointment" }, 500);
  }
});

// ==================== MEDICAL RECORDS ROUTES ====================

// Initialize Supabase Storage bucket for medical records
async function initializeMedicalRecordsBucket() {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    const bucketName = 'make-51d2d2e2-medical-records';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log('Creating medical records storage bucket...');
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false, // Private bucket for security
        fileSizeLimit: 10485760 // 10MB limit
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('Medical records bucket created successfully');
      }
    } else {
      console.log('Medical records bucket already exists');
    }
  } catch (error) {
    console.error('Error initializing medical records bucket:', error);
  }
}

// Initialize bucket on startup
initializeMedicalRecordsBucket();

// Import Supabase client
import { createClient } from 'npm:@supabase/supabase-js@2';

// Get all medical records for a user
app.get("/make-server-51d2d2e2/medical-records/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    console.log("Fetching medical records for user:", userId);
    
    // Get all records for this user
    const records = await kv.getByPrefix(`medical_record:${userId}:`);
    
    // Sort by date (newest first)
    records.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`Found ${records.length} medical records`);
    
    return c.json(records);
  } catch (error) {
    console.log("Error fetching medical records:", error);
    return c.json({ error: "Failed to fetch medical records" }, 500);
  }
});

// Upload medical record (user upload)
app.post("/make-server-51d2d2e2/medical-records/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const userId = formData.get('userId') as string;
    
    if (!file || !name || !category || !userId) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    console.log("Uploading medical record:", name, "for user:", userId);
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: "File size must be less than 10MB" }, 400);
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: "Only PDF, JPG, and PNG files are allowed" }, 400);
    }
    
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const bucketName = 'make-51d2d2e2-medical-records';
    
    // Convert File to ArrayBuffer for upload
    const fileBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false
      });
    
    if (uploadError) {
      console.error('Error uploading to storage:', uploadError);
      return c.json({ error: "Failed to upload file" }, 500);
    }
    
    // Generate signed URL (valid for 10 years for long-term access)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 315360000); // 10 years in seconds
    
    if (urlError) {
      console.error('Error generating signed URL:', urlError);
      return c.json({ error: "Failed to generate file URL" }, 500);
    }
    
    // Determine file type
    const fileType = file.type === 'application/pdf' ? 'pdf' : 'image';
    
    // Create record metadata
    const recordId = `${userId}_${Date.now()}`;
    const record = {
      id: recordId,
      name,
      type: category,
      category,
      date: new Date().toISOString().split('T')[0],
      uploadedBy: 'user',
      fileUrl: urlData.signedUrl,
      fileName,
      fileType,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString()
    };
    
    // Save to KV store
    await kv.set(`medical_record:${userId}:${recordId}`, record);
    
    console.log("Medical record uploaded successfully:", recordId);
    
    return c.json(record);
  } catch (error) {
    console.log("Error uploading medical record:", error);
    return c.json({ error: "Failed to upload medical record" }, 500);
  }
});

// Delete medical record (user uploads only)
app.delete("/make-server-51d2d2e2/medical-records/:recordId", async (c) => {
  try {
    const recordId = c.req.param("recordId");
    const userId = recordId.split('_')[0]; // Extract userId from recordId
    
    console.log("Deleting medical record:", recordId);
    
    // Get the record
    const record = await kv.get(`medical_record:${userId}:${recordId}`);
    
    if (!record) {
      return c.json({ error: "Record not found" }, 404);
    }
    
    // Check if it's a user upload (only user uploads can be deleted)
    if (record.uploadedBy !== 'user') {
      return c.json({ error: "Hospital-uploaded records cannot be deleted" }, 403);
    }
    
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // Delete from storage
    const bucketName = 'make-51d2d2e2-medical-records';
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([record.fileName]);
    
    if (deleteError) {
      console.error('Error deleting from storage:', deleteError);
    }
    
    // Delete from KV store
    await kv.del(`medical_record:${userId}:${recordId}`);
    
    console.log("Medical record deleted successfully");
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting medical record:", error);
    return c.json({ error: "Failed to delete medical record" }, 500);
  }
});

// Hospital upload (after appointments) - called by system
app.post("/make-server-51d2d2e2/medical-records/hospital-upload", async (c) => {
  try {
    const {
      userId,
      name,
      category,
      hospitalName,
      doctorName,
      fileUrl,
      fileType,
      size
    } = await c.req.json();
    
    if (!userId || !name || !category || !fileUrl) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    console.log("Hospital uploading medical record for user:", userId);
    
    const recordId = `${userId}_${Date.now()}`;
    const record = {
      id: recordId,
      name,
      type: category,
      category,
      date: new Date().toISOString().split('T')[0],
      uploadedBy: 'hospital',
      hospitalName,
      doctorName,
      fileUrl,
      fileType: fileType || 'pdf',
      size: size || '0 MB',
      uploadedAt: new Date().toISOString()
    };
    
    await kv.set(`medical_record:${userId}:${recordId}`, record);
    
    console.log("Hospital medical record uploaded successfully:", recordId);
    
    return c.json(record);
  } catch (error) {
    console.log("Error uploading hospital medical record:", error);
    return c.json({ error: "Failed to upload medical record" }, 500);
  }
});

// ==================== SUBSCRIPTION ROUTES ====================

// Get user subscription
app.get("/make-server-51d2d2e2/subscriptions/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const subscription = await kv.get(`subscription:${userId}`);
    
    return c.json(subscription || { plan: "free", status: "none" });
  } catch (error) {
    console.log("Error fetching subscription:", error);
    return c.json({ error: "Failed to fetch subscription" }, 500);
  }
});

// Create or update subscription
app.post("/make-server-51d2d2e2/subscriptions", async (c) => {
  try {
    const subscriptionData = await c.req.json();
    const userId = subscriptionData.userId || "guest";
    
    const subscription = {
      ...subscriptionData,
      userId,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`subscription:${userId}`, subscription);
    
    return c.json(subscription);
  } catch (error) {
    console.log("Error creating subscription:", error);
    return c.json({ error: "Failed to create subscription" }, 500);
  }
});

// ==================== STRIPE PAYMENT ROUTES ====================

// Create payment intent
app.post("/make-server-51d2d2e2/payments/create-intent", async (c) => {
  try {
    const body = await c.req.json();
    console.log("Payment intent request:", body);
    
    const { amount, currency = "usd", metadata = {}, paymentMethod = "card" } = body;
    
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.log("Error: STRIPE_SECRET_KEY not configured");
      return c.json({ error: "Payment system not configured" }, 500);
    }
    
    // Prepare payment intent parameters
    const params: any = {
      amount: Math.round(amount * 100).toString(), // Convert to cents
      currency: paymentMethod === "upi" ? "inr" : currency, // UPI requires INR
      "metadata[appointmentId]": metadata.appointmentId || "",
      "metadata[userId]": metadata.userId || "",
      "metadata[doctorName]": metadata.doctorName || "",
    };
    
    // Add payment method types for UPI
    if (paymentMethod === "upi") {
      params["payment_method_types[]"] = "upi";
      params["payment_method_options[upi][flow]"] = "redirect";
    }
    
    console.log("Stripe request params:", params);
    
    // Create Stripe payment intent
    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params).toString(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("Stripe API error response:", errorText);
      
      let errorMessage = "Failed to create payment intent";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch (e) {
        // If not JSON, use the text
        errorMessage = errorText.substring(0, 100);
      }
      
      return c.json({ error: errorMessage }, 500);
    }
    
    const paymentIntent = await response.json();
    console.log("Payment intent created:", paymentIntent.id);
    
    return c.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.log("Error creating payment intent:", error);
    return c.json({ error: error instanceof Error ? error.message : "Failed to create payment intent" }, 500);
  }
});

// Confirm payment status
app.get("/make-server-51d2d2e2/payments/:paymentIntentId", async (c) => {
  try {
    const paymentIntentId = c.req.param("paymentIntentId");
    
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      return c.json({ error: "Payment system not configured" }, 500);
    }
    
    const response = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, {
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.log("Stripe API error:", error);
      return c.json({ error: "Failed to fetch payment status" }, 500);
    }
    
    const paymentIntent = await response.json();
    
    return c.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.log("Error fetching payment status:", error);
    return c.json({ error: "Failed to fetch payment status" }, 500);
  }
});

// ==================== HOSPITAL/DOCTOR DATA ROUTES ====================

// Get hospitals (mock data - in production would query actual database)
app.get("/make-server-51d2d2e2/hospitals", async (c) => {
  try {
    const query = c.req.query("search") || "";
    const location = c.req.query("location") || "";
    
    // For now, return empty array - frontend will use mock data
    // In production, this would query a real hospital database
    return c.json([]);
  } catch (error) {
    console.log("Error fetching hospitals:", error);
    return c.json({ error: "Failed to fetch hospitals" }, 500);
  }
});

// ==================== INSURANCE ROUTES ====================

// Save insurance policy
app.post("/make-server-51d2d2e2/insurance/policy", async (c) => {
  try {
    const policyData = await c.req.json();
    
    console.log("Saving insurance policy:", policyData.id || 'new');
    
    const policyId = policyData.id || `policy_${Date.now()}`;
    const policy = {
      ...policyData,
      id: policyId,
      updatedAt: new Date().toISOString()
    };
    
    // Store policy
    await kv.set(`insurance:policy:${policyId}`, policy);
    await kv.set(`insurance:user:${policyData.userId}:policy:${policyId}`, policy);
    
    console.log("Policy saved successfully:", policyId);
    
    return c.json(policy);
  } catch (error) {
    console.log("Error saving policy:", error);
    return c.json({ error: "Failed to save policy" }, 500);
  }
});

// Get user's insurance policies
app.get("/make-server-51d2d2e2/insurance/policies/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    console.log("Fetching policies for user:", userId);
    
    const policies = await kv.getByPrefix(`insurance:user:${userId}:policy:`);
    
    console.log("Found policies:", policies.length);
    
    return c.json(policies);
  } catch (error) {
    console.log("Error fetching policies:", error);
    return c.json({ error: "Failed to fetch policies" }, 500);
  }
});

// Get single insurance policy
app.get("/make-server-51d2d2e2/insurance/policy/:policyId", async (c) => {
  try {
    const policyId = c.req.param("policyId");
    
    console.log("Fetching policy:", policyId);
    
    const policy = await kv.get(`insurance:policy:${policyId}`);
    
    if (!policy) {
      return c.json({ error: "Policy not found" }, 404);
    }
    
    return c.json(policy);
  } catch (error) {
    console.log("Error fetching policy:", error);
    return c.json({ error: "Failed to fetch policy" }, 500);
  }
});

// Check coverage (AI simulation)
app.post("/make-server-51d2d2e2/insurance/check-coverage", async (c) => {
  try {
    const requestData = await c.req.json();
    const { userId, policyId, treatmentType, treatmentName, estimatedCost, hospitalType, roomType } = requestData;
    
    console.log("Checking coverage:", { policyId, treatmentType, treatmentName });
    
    // Get policy
    const policy = await kv.get(`insurance:policy:${policyId}`);
    
    if (!policy) {
      return c.json({ error: "Policy not found" }, 404);
    }
    
    // AI Simulation: Determine coverage based on treatment type
    const coverage = simulateCoverageCheck(policy, treatmentType, treatmentName, estimatedCost, hospitalType, roomType);
    
    // Create coverage report
    const reportId = `report_${Date.now()}`;
    const report = {
      id: reportId,
      userId,
      policyId,
      policy,
      treatmentType,
      treatmentName,
      estimatedCost,
      hospitalType,
      roomType,
      ...coverage,
      createdAt: new Date().toISOString()
    };
    
    // Store report
    await kv.set(`insurance:report:${reportId}`, report);
    await kv.set(`insurance:user:${userId}:report:${reportId}`, report);
    
    console.log("Coverage report created:", reportId);
    
    return c.json(report);
  } catch (error) {
    console.log("Error checking coverage:", error);
    return c.json({ error: "Failed to check coverage" }, 500);
  }
});

// Get user's coverage reports
app.get("/make-server-51d2d2e2/insurance/reports/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    console.log("Fetching reports for user:", userId);
    
    const reports = await kv.getByPrefix(`insurance:user:${userId}:report:`);
    
    // Sort by date, newest first
    reports.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log("Found reports:", reports.length);
    
    return c.json(reports);
  } catch (error) {
    console.log("Error fetching reports:", error);
    return c.json({ error: "Failed to fetch reports" }, 500);
  }
});

// Get single coverage report
app.get("/make-server-51d2d2e2/insurance/report/:reportId", async (c) => {
  try {
    const reportId = c.req.param("reportId");
    
    console.log("Fetching report:", reportId);
    
    const report = await kv.get(`insurance:report:${reportId}`);
    
    if (!report) {
      return c.json({ error: "Report not found" }, 404);
    }
    
    return c.json(report);
  } catch (error) {
    console.log("Error fetching report:", error);
    return c.json({ error: "Failed to fetch report" }, 500);
  }
});

// AI Coverage Simulation Function
function simulateCoverageCheck(policy: any, treatmentType: string, treatmentName: string, estimatedCost?: number, hospitalType?: string, roomType?: string) {
  // This simulates AI-powered coverage analysis
  // In production, this would use NLP to analyze policy documents
  
  let status = 'full';
  let coveragePercentage = 100;
  let coveredComponents: any[] = [];
  let sublimits: any[] = [];
  let copay = 0;
  let waitingPeriodStatus: any = null;
  
  const cost = estimatedCost || 100000;
  
  // Determine coverage based on treatment type
  switch (treatmentType.toLowerCase()) {
    case 'hospitalization':
      status = 'full';
      coveragePercentage = 90;
      copay = 10;
      coveredComponents = [
        { name: 'Room Rent', limit: policy.sumInsured * 0.02 },
        { name: 'Doctor Fees', limit: null },
        { name: 'Medical Tests', limit: null },
        { name: 'Medicines', limit: null }
      ];
      sublimits = [
        { category: 'Room Rent', description: 'Daily room rent limit', amount: policy.sumInsured * 0.02 }
      ];
      waitingPeriodStatus = {
        isCompleted: policy.waitingPeriodCompleted,
        message: policy.waitingPeriodCompleted ? 'Waiting period completed' : 'Waiting period of 30 days applies',
        remainingDays: policy.waitingPeriodCompleted ? 0 : 30
      };
      break;
      
    case 'surgery':
      status = 'full';
      coveragePercentage = 85;
      copay = 15;
      coveredComponents = [
        { name: 'Surgery Costs', limit: null },
        { name: 'Anesthesia', limit: null },
        { name: 'Post-operative Care', limit: null }
      ];
      waitingPeriodStatus = {
        isCompleted: policy.waitingPeriodCompleted,
        message: policy.waitingPeriodCompleted ? 'Waiting period completed' : 'Waiting period of 2 years for planned surgeries',
        remainingDays: policy.waitingPeriodCompleted ? 0 : 730
      };
      break;
      
    case 'daycare procedures':
      status = 'full';
      coveragePercentage = 95;
      copay = 5;
      coveredComponents = [
        { name: 'Procedure Costs', limit: null },
        { name: 'Medical Supplies', limit: null }
      ];
      waitingPeriodStatus = {
        isCompleted: true,
        message: 'No waiting period for daycare procedures',
        remainingDays: 0
      };
      break;
      
    case 'diagnostics':
      status = 'partial';
      coveragePercentage = 50;
      coveredComponents = [
        { name: 'Lab Tests', limit: 5000 },
        { name: 'Imaging', limit: 10000 }
      ];
      sublimits = [
        { category: 'Diagnostics', description: 'Annual limit for diagnostic tests', amount: 15000 }
      ];
      waitingPeriodStatus = {
        isCompleted: true,
        message: 'No waiting period for diagnostics',
        remainingDays: 0
      };
      break;
      
    case 'maternity':
      status = policy.waitingPeriodCompleted ? 'full' : 'not_covered';
      coveragePercentage = policy.waitingPeriodCompleted ? 80 : 0;
      copay = 20;
      coveredComponents = policy.waitingPeriodCompleted ? [
        { name: 'Delivery Expenses', limit: 50000 },
        { name: 'Pre-natal Care', limit: 10000 },
        { name: 'Post-natal Care', limit: 10000 }
      ] : [];
      sublimits = [
        { category: 'Maternity', description: 'Total maternity benefit limit', amount: 70000 }
      ];
      waitingPeriodStatus = {
        isCompleted: policy.waitingPeriodCompleted,
        message: policy.waitingPeriodCompleted ? 'Waiting period completed' : 'Maternity requires 9-12 months waiting period',
        remainingDays: policy.waitingPeriodCompleted ? 0 : 365
      };
      break;
      
    case 'critical illness':
      status = 'full';
      coveragePercentage = 100;
      coveredComponents = [
        { name: 'Treatment Costs', limit: policy.sumInsured },
        { name: 'ICU Charges', limit: null },
        { name: 'Specialized Care', limit: null }
      ];
      waitingPeriodStatus = {
        isCompleted: policy.waitingPeriodCompleted,
        message: policy.waitingPeriodCompleted ? 'Waiting period completed' : 'Critical illness has 90 days waiting period',
        remainingDays: policy.waitingPeriodCompleted ? 0 : 90
      };
      break;
      
    case 'opd (out-patient)':
      status = 'not_covered';
      coveragePercentage = 0;
      coveredComponents = [];
      waitingPeriodStatus = {
        isCompleted: false,
        message: 'OPD is not covered under this policy. Consider upgrading to a plan with OPD coverage.',
        remainingDays: null
      };
      break;
      
    default:
      status = 'partial';
      coveragePercentage = 70;
  }
  
  // Calculate estimated costs
  const estimatedCoverage = Math.round((cost * coveragePercentage) / 100);
  const estimatedOutOfPocket = cost - estimatedCoverage;
  
  return {
    status,
    coveragePercentage,
    coveredComponents,
    sublimits,
    copay,
    waitingPeriodStatus,
    estimatedCoverage,
    estimatedOutOfPocket
  };
}

// ==================== AI CHATBOT SUPPORT ROUTES ====================

// Send chat message to AI assistant
app.post("/make-server-51d2d2e2/support/chat", async (c) => {
  try {
    const { userId, message, chatHistory } = await c.req.json();
    
    console.log("AI Chat request from user:", userId);
    
    // Process message with AI logic
    const response = processAIMessage(message, chatHistory);
    
    // Save chat message to history
    const messageId = `msg_${Date.now()}`;
    const chatMessage = {
      id: messageId,
      userId,
      userMessage: message,
      aiResponse: response.message,
      shouldEscalate: response.shouldEscalate,
      timestamp: new Date().toISOString()
    };
    
    await kv.set(`chat:${userId}:${messageId}`, chatMessage);
    
    console.log("AI response sent:", response.message.substring(0, 50) + "...");
    
    return c.json(response);
  } catch (error) {
    console.log("Error processing chat:", error);
    return c.json({ error: "Failed to process message" }, 500);
  }
});

// Get chat history for user
app.get("/make-server-51d2d2e2/support/history/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    console.log("Fetching chat history for user:", userId);
    
    const history = await kv.getByPrefix(`chat:${userId}:`);
    
    // Sort by timestamp
    history.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return c.json(history);
  } catch (error) {
    console.log("Error fetching chat history:", error);
    return c.json({ error: "Failed to fetch chat history" }, 500);
  }
});

// AI Message Processing Function
function processAIMessage(message: string, chatHistory: any[] = []) {
  const lowerMessage = message.toLowerCase();
  
  // Detect intent and generate appropriate response
  let response = '';
  let shouldEscalate = false;
  
  // 1. APPOINTMENT BOOKING HELP
  if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
    response = `📅 **Booking an Appointment is Easy!**

Here's how to book:

1️⃣ **Search by Hospital:**
   • Go to Dashboard → "Find Hospitals Near You"
   • Search by name or location
   • Select hospital → Choose doctor → Pick slot

2️⃣ **Search by Specialty:**
   • Dashboard → "Search by Specialty"
   • Select specialty (e.g., Cardiology)
   • View recommended doctors → Book slot

3️⃣ **Search by Symptoms:**
   • Dashboard → "Search by Symptoms"
   • Describe your symptoms
   • Get AI recommendations → Book appointment

💡 **Pro Tip:** Premium members get priority booking and instant confirmations!

Need help with a specific step?`;
  }
  
  // 2. INSURANCE HELP
  else if (lowerMessage.includes('insurance') || lowerMessage.includes('coverage') || lowerMessage.includes('claim')) {
    response = `🛡️ **Insurance Claims & Coverage**

Here's what you can do:

✅ **Add Insurance Policy:**
   Dashboard → Insurance Claims → Add Policy
   (Enter provider, policy number, sum insured)

✅ **Check Treatment Coverage:**
   Select treatment type → Get AI-powered eligibility report
   See coverage %, co-pay, and out-of-pocket costs

✅ **Claim Guidance:**
   After checking coverage, get step-by-step guidance for:
   • Cashless claims (network hospitals)
   • Reimbursement claims (any hospital)
   • Required documents checklist

📋 **What coverage do you want to check?**`;
  }
  
  // 3. MEDICAL RECORDS
  else if (lowerMessage.includes('record') || lowerMessage.includes('prescription') || lowerMessage.includes('report')) {
    response = `📋 **Medical Records Management**

Access all your health documents in one place:

**Available Records:**
• 📄 Prescriptions from doctors
• 🧪 Lab reports and test results
• 🩺 Diagnostic scans (X-ray, MRI, CT)
• 💊 Medication history
• 📝 Doctor's notes

**How to Access:**
Dashboard → Medical Records → View all documents

**Upload New Records:**
Click "Upload" → Select file type → Choose file (PDF, JPG, PNG)

Your data is encrypted and HIPAA compliant! 🔒

Need help finding a specific document?`;
  }
  
  // 4. PAYMENT ISSUES
  else if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card') || lowerMessage.includes('upi')) {
    response = `💳 **Payment Help**

**Supported Payment Methods:**
• Credit/Debit Cards (Visa, Mastercard, RuPay)
• UPI (Google Pay, PhonePe, Paytm)
• Net Banking
• Wallets

**Common Issues:**

❌ **Payment Failed?**
   • Check internet connection
   • Verify card/UPI details
   • Ensure sufficient balance
   • Try different payment method

❌ **Money Deducted but Booking Not Confirmed?**
   • Check "My Appointments" in dashboard
   • Wait 5-10 minutes for confirmation
   • If still not resolved, I'll connect you to support

📧 **For Refunds:** Processed within 5-7 business days

Are you facing a specific payment issue?`;
    
    // Check if this is a serious payment issue
    if (lowerMessage.includes('failed') || lowerMessage.includes('not working') || lowerMessage.includes('error') || lowerMessage.includes('deducted')) {
      shouldEscalate = true;
    }
  }
  
  // 5. ACCOUNT SETTINGS
  else if (lowerMessage.includes('account') || lowerMessage.includes('profile') || lowerMessage.includes('password') || lowerMessage.includes('email')) {
    response = `⚙️ **Account Settings**

**Manage Your Profile:**
• Update name, email, phone
• Change password
• Add emergency contacts
• Set location preferences

**Access:** Dashboard → Profile Icon (top-right)

**Common Account Tasks:**

🔒 **Reset Password:**
   Sign In page → "Forgot Password"
   
📧 **Change Email:**
   Profile → Edit Email → Verify new email
   
📱 **Update Phone:**
   Profile → Edit Phone → Verify OTP

🗑️ **Delete Account:**
   Profile → Settings → Delete Account
   (⚠️ This is permanent!)

What would you like to update?`;
  }
  
  // 6. EMERGENCY SOS
  else if (lowerMessage.includes('emergency') || lowerMessage.includes('sos') || lowerMessage.includes('ambulance') || lowerMessage.includes('urgent')) {
    response = `🚑 **EMERGENCY ASSISTANCE**

**For Life-Threatening Emergencies:**
🚨 **Call 112 or 108 Immediately!**

**Medboro SOS Feature:**

📍 **Activate SOS:**
   Dashboard → Red SOS Button
   • Shares your live location
   • Notifies emergency contacts
   • Finds nearest hospitals
   • Tracks ambulance (if dispatched)

**Emergency Contacts:**
• Ambulance: 108 / 102
• Police: 100
• Fire: 101
• National Emergency: 112

**Hospital Emergency Rooms:**
Dashboard → Search → Filter: "Emergency 24x7"

⚠️ **If you're in danger, call emergency services NOW!**

Do you need urgent medical help?`;
    
    if (lowerMessage.includes('help') || lowerMessage.includes('urgent') || lowerMessage.includes('now')) {
      shouldEscalate = true;
    }
  }
  
  // 7. SUBSCRIPTION/PREMIUM
  else if (lowerMessage.includes('premium') || lowerMessage.includes('subscription') || lowerMessage.includes('upgrade') || lowerMessage.includes('plan')) {
    response = `⭐ **Medboro Premium Plans**

**Available Plans:**

🥈 **Basic Plan - ₹99/month**
   • Priority booking
   • 10% discount on consultations
   • Teleconsultation included
   
🥇 **Premium Plan - ₹199/month**
   • All Basic features
   • AI symptom checker unlimited
   • Free ambulance once/year
   • Health insurance comparison
   
💎 **Family Plan - ₹499/month**
   • All Premium features
   • Up to 6 family members
   • Dedicated health manager
   • 24/7 priority support

**How to Subscribe:**
Dashboard → Premium Card → Choose Plan → Pay

Want to know more about specific features?`;
  }
  
  // 8. APP FEATURES/NAVIGATION
  else if (lowerMessage.includes('feature') || lowerMessage.includes('how to') || lowerMessage.includes('where') || lowerMessage.includes('find')) {
    response = `🎯 **Medboro Features Overview**

**Main Features:**

🏥 **Hospital Search**
   Find hospitals by name, location, or specialty

👨‍⚕️ **Doctor Booking**
   Book appointments with verified doctors

🔍 **Specialty Search**
   Search doctors by specialty (Cardiology, Orthopedic, etc.)

🤒 **Symptom Checker**
   Describe symptoms → Get AI recommendations

🛡️ **Insurance Coverage**
   Check if treatments are covered by your insurance

📋 **Medical Records**
   Store & access all health documents

🚑 **Emergency SOS**
   Quick access to ambulance & emergency services

⭐ **Premium Plans**
   Unlock priority booking & special features

Which feature do you want to explore?`;
  }
  
  // 9. TECHNICAL ISSUES
  else if (lowerMessage.includes('not working') || lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
    response = `🔧 **Troubleshooting Help**

**Common Solutions:**

1️⃣ **Refresh the page** (Press F5 or reload)

2️⃣ **Clear browser cache:**
   Settings → Privacy → Clear browsing data

3️⃣ **Try different browser:**
   Chrome, Firefox, Safari, or Edge

4️⃣ **Check internet connection**

5️⃣ **Update your browser** to latest version

6️⃣ **Disable browser extensions** (especially ad-blockers)

**Still not working?**
Please describe the specific problem you're facing:
• What were you trying to do?
• What happened instead?
• Any error messages?

I'll help you resolve it or connect you to our technical team!`;
    
    shouldEscalate = true;
  }
  
  // 10. GENERAL HELP / UNCLEAR INTENT
  else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('assist')) {
    response = `👋 **I'm here to help!**

I can assist you with:

📅 Booking appointments
🛡️ Insurance coverage checks
📋 Medical records access
💳 Payment issues
⚙️ Account settings
🚑 Emergency services
⭐ Premium plans
🔍 App features & navigation

**What do you need help with?** Just tell me in your own words!

Or click the quick action buttons above for common tasks.`;
  }
  
  // 11. GREETINGS
  else if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
    response = `Hello! 👋 Welcome to Medboro Support!

I'm your AI assistant, ready to help 24/7. I can help you with:
• Booking appointments 📅
• Insurance queries 🛡️
• Medical records 📋
• Payment issues 💳
• And much more!

What can I help you with today?`;
  }
  
  // 12. THANKS
  else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    response = `You're welcome! 😊

I'm always here to help. If you need anything else, just ask!

**Quick Contact:**
📞 Customer Care: 1800-MEDBORO (1800-633-2676)
📧 Email: support@medboro.com

Have a healthy day! 🏥💚`;
  }
  
  // DEFAULT: DIDN'T UNDERSTAND
  else {
    response = `I want to help, but I'm not quite sure what you're asking about. 🤔

Could you rephrase your question? Or choose from these topics:

• **Appointments** - Booking, rescheduling, cancellation
• **Insurance** - Coverage, claims, policy management  
• **Medical Records** - Access, upload, organize
• **Payments** - Issues, refunds, methods
• **Account** - Settings, password, profile
• **Emergency** - SOS, ambulance, urgent care
• **Premium** - Plans, features, upgrades

**Or simply describe your issue** and I'll do my best to help!

If you prefer, I can connect you to our human support team. 👨‍💼`;
    
    shouldEscalate = true;
  }
  
  return {
    message: response,
    shouldEscalate
  };
}

Deno.serve(app.fetch);
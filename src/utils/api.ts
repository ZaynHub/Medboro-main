import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-51d2d2e2`;

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `API call failed: ${response.statusText}`);
  }

  return response.json();
}

// ==================== AUTH API ====================

export async function signUp(userData: { name: string; email: string; phone: string; password: string }) {
  return apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function signIn(credentials: { email: string; password: string }) {
  return apiCall('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

// ==================== USER API ====================

export async function getUser(userId: string) {
  return apiCall(`/users/${userId}`);
}

export async function createUser(userData: any) {
  return apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

// ==================== APPOINTMENT API ====================

export async function getUserAppointments(userId: string) {
  return apiCall(`/appointments/user/${userId}`);
}

export async function getAppointment(appointmentId: string) {
  return apiCall(`/appointments/${appointmentId}`);
}

export async function createAppointment(appointmentData: any) {
  return apiCall('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  });
}

export async function updateAppointment(appointmentId: string, updates: any) {
  return apiCall(`/appointments/${appointmentId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteAppointment(userId: string, appointmentId: string) {
  return apiCall(`/appointments/${userId}/${appointmentId}`, {
    method: 'DELETE',
  });
}

// ==================== MEDICAL RECORDS API ====================

export async function getMedicalRecords(userId: string) {
  return apiCall(`/medical-records/${userId}`);
}

export async function uploadMedicalRecord(formData: FormData) {
  const url = `${API_BASE_URL}/medical-records/upload`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: formData, // Don't set Content-Type, browser will set it with boundary
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload medical record');
  }

  return response.json();
}

export async function deleteMedicalRecord(recordId: string) {
  return apiCall(`/medical-records/${recordId}`, {
    method: 'DELETE',
  });
}

export async function hospitalUploadMedicalRecord(data: {
  userId: string;
  name: string;
  category: string;
  hospitalName: string;
  doctorName: string;
  fileUrl: string;
  fileType?: string;
  size?: string;
}) {
  return apiCall('/medical-records/hospital-upload', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ==================== SUBSCRIPTION API ====================

export async function getUserSubscription(userId: string) {
  return apiCall(`/subscriptions/${userId}`);
}

export async function createSubscription(subscriptionData: any) {
  return apiCall('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(subscriptionData),
  });
}

// ==================== PAYMENT API ====================

export async function createPaymentIntent(data: { 
  amount: number; 
  currency?: string; 
  metadata?: any;
  paymentMethod?: string;
}) {
  return apiCall('/payments/create-intent', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getPaymentStatus(paymentIntentId: string) {
  return apiCall(`/payments/${paymentIntentId}`);
}

// ==================== INSURANCE API ====================

export async function saveInsurancePolicy(policyData: any) {
  return apiCall('/insurance/policy', {
    method: 'POST',
    body: JSON.stringify(policyData),
  });
}

export async function getInsurancePolicies(userId: string) {
  return apiCall(`/insurance/policies/${userId}`);
}

export async function getInsurancePolicy(policyId: string) {
  return apiCall(`/insurance/policy/${policyId}`);
}

export async function checkCoverage(data: {
  userId: string;
  policyId: string;
  treatmentType: string;
  treatmentName: string;
  estimatedCost?: number;
  hospitalType?: string;
  roomType?: string;
}) {
  return apiCall('/insurance/check-coverage', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getCoverageReports(userId: string) {
  return apiCall(`/insurance/reports/${userId}`);
}

export async function getCoverageReport(reportId: string) {
  return apiCall(`/insurance/report/${reportId}`);
}

// ==================== SUPPORT / CHATBOT API ====================

export async function sendChatMessage(data: {
  userId: string;
  message: string;
  chatHistory?: any[];
}) {
  return apiCall('/support/chat', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getChatHistory(userId: string) {
  return apiCall(`/support/history/${userId}`);
}
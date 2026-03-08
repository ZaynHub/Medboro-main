import { createBrowserRouter } from "react-router";
import { RootLayout } from "./RootLayout";
import { Landing } from "./pages/Landing";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { LocationPermission } from "./pages/LocationPermission";
import { Dashboard } from "./pages/Dashboard";
import { HospitalSearch } from "./pages/HospitalSearch";
import { SearchResults } from "./pages/SearchResults";
import { HospitalDetails } from "./pages/HospitalDetails";
import { DoctorList } from "./pages/DoctorList";
import { SlotSelection } from "./pages/SlotSelection";
import { Payment } from "./pages/Payment";
import { AppointmentConfirmation } from "./pages/AppointmentConfirmation";
import { SpecialtySelection } from "./pages/SpecialtySelection";
import { RecommendedDoctors } from "./pages/RecommendedDoctors";
import { SymptomInput } from "./pages/SymptomInput";
import { SymptomResults } from "./pages/SymptomResults";
import { PatientDashboard } from "./pages/PatientDashboard";
import { MedicalRecords } from "./pages/MedicalRecords";
import { SubscriptionPlans } from "./pages/SubscriptionPlans";
import { AdminDashboard } from "./pages/AdminDashboard";
import { EmergencyStatus } from "./pages/EmergencyStatus";
import { NotFound } from "./pages/NotFound";
import { InsuranceDashboard } from "./pages/insurance/InsuranceDashboard";
import { AddPolicy } from "./pages/insurance/AddPolicy";
import { SelectTreatment } from "./pages/insurance/SelectTreatment";
import { ProcessingScreen } from "./pages/insurance/ProcessingScreen";
import { CoverageResults } from "./pages/insurance/CoverageResults";
import { ClaimGuidance } from "./pages/insurance/ClaimGuidance";
import { Support } from "./pages/Support";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Landing,
      },
      {
        path: "signup",
        Component: SignUp,
      },
      {
        path: "signin",
        Component: SignIn,
      },
      {
        path: "location-permission",
        Component: LocationPermission,
      },
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "hospital-search",
        Component: HospitalSearch,
      },
      {
        path: "search-results",
        Component: SearchResults,
      },
      {
        path: "hospital/:id",
        Component: HospitalDetails,
      },
      {
        path: "hospital/:hospitalId/doctors",
        Component: DoctorList,
      },
      {
        path: "doctor/:doctorId/slots",
        Component: SlotSelection,
      },
      {
        path: "payment",
        Component: Payment,
      },
      {
        path: "confirmation",
        Component: AppointmentConfirmation,
      },
      {
        path: "specialty-search",
        Component: SpecialtySelection,
      },
      {
        path: "specialty/:specialtyName/doctors",
        Component: RecommendedDoctors,
      },
      {
        path: "symptom-search",
        Component: SymptomInput,
      },
      {
        path: "symptom-results",
        Component: SymptomResults,
      },
      {
        path: "my-dashboard",
        Component: PatientDashboard,
      },
      {
        path: "medical-records",
        Component: MedicalRecords,
      },
      {
        path: "subscriptions",
        Component: SubscriptionPlans,
      },
      {
        path: "admin",
        Component: AdminDashboard,
      },
      {
        path: "emergency-status",
        Component: EmergencyStatus,
      },
      {
        path: "insurance",
        Component: InsuranceDashboard,
      },
      {
        path: "insurance/add-policy",
        Component: AddPolicy,
      },
      {
        path: "insurance/select-treatment",
        Component: SelectTreatment,
      },
      {
        path: "insurance/processing",
        Component: ProcessingScreen,
      },
      {
        path: "insurance/coverage-results",
        Component: CoverageResults,
      },
      {
        path: "insurance/claim-guidance",
        Component: ClaimGuidance,
      },
      {
        path: "support",
        Component: Support,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);
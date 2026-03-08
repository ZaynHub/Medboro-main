import { Link } from "react-router";
import { useState, useEffect } from "react";
import {
  MapPin,
  Bell,
  Search,
  Stethoscope,
  Activity,
  Calendar,
  FileText,
  CreditCard,
  X,
  Star,
  MessageCircle,
  ChevronDown,
  Clock,
  Building2,
  Heart,
  Shield,
  Zap,
  Navigation,
} from "lucide-react";
import { Button } from "../components/Button";
import { SOSButton } from "../components/SOSButton";
import logo from "figma:asset/0cdbc89b9b6cccd3d74435f25902f8d982dd8199.png";
import { useNavigate } from "react-router";
import { GoogleMap } from "../components/GoogleMap";
import { getUserAppointments } from "../utils/api";

export function Dashboard() {
  const navigate = useNavigate();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("userLocation") || "New York, NY"
  );
  const [activeTab, setActiveTab] = useState("hospital");
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(
    JSON.parse(localStorage.getItem("userCoordinates") || "null")
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [nextAppointment, setNextAppointment] = useState<any>(null);
  
  const user = JSON.parse(
    localStorage.getItem("user") || '{"name":"Guest","id":"guest"}',
  );
  
  // Fetch next appointment
  useEffect(() => {
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    if (appointments.length > 0) {
      // Find the next upcoming appointment
      const now = new Date();
      const upcoming = appointments
        .filter((apt: any) => {
          // Parse the appointment date string (format: "January 30, 2026" or similar)
          const aptDate = new Date(apt.date);
          return aptDate >= now || apt.status === 'upcoming';
        })
        .sort((a: any, b: any) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });
      
      if (upcoming.length > 0) {
        setNextAppointment(upcoming[0]);
      } else if (appointments.length > 0) {
        // If no upcoming appointments, show the most recent one
        setNextAppointment(appointments[appointments.length - 1]);
      }
    }
  }, []);

  // Get user's current location
  const getUserLocation = () => {
    setIsGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserCoordinates(coords);
          localStorage.setItem("userCoordinates", JSON.stringify(coords));
          setIsGettingLocation(false);
          
          // Reverse geocode to get city name (mock for now)
          const mockCity = "Current Location";
          setSelectedLocation(mockCity);
          localStorage.setItem("userLocation", mockCity);
        },
        (error) => {
          console.error("Error getting location:", error.message || error);
          setIsGettingLocation(false);
          
          // Set default location (Mumbai, India) if geolocation fails
          const defaultCoords = { lat: 19.0760, lng: 72.8777 };
          setUserCoordinates(defaultCoords);
          localStorage.setItem("userCoordinates", JSON.stringify(defaultCoords));
          
          // Set default city
          setSelectedLocation("Mumbai");
          localStorage.setItem("userLocation", "Mumbai");
          
          // Only log to console, don't show alert to avoid interrupting user experience
          if (error.code === 1) {
            console.warn("Location access denied. Using default location (Mumbai, India).");
          } else if (error.code === 2) {
            console.warn("Location unavailable. Using default location (Mumbai, India).");
          } else if (error.code === 3) {
            console.warn("Location request timed out. Using default location (Mumbai, India).");
          } else {
            console.warn("Unable to get location. Using default location (Mumbai, India).");
          }
        },
        {
          enableHighAccuracy: false, // Changed to false to avoid permission issues
          timeout: 5000, // Reduced timeout
          maximumAge: 300000 // Allow cached location up to 5 minutes old
        }
      );
    } else {
      setIsGettingLocation(false);
      
      // Set default location if geolocation not supported
      const defaultCoords = { lat: 19.0760, lng: 72.8777 };
      setUserCoordinates(defaultCoords);
      localStorage.setItem("userCoordinates", JSON.stringify(defaultCoords));
      
      setSelectedLocation("Mumbai");
      localStorage.setItem("userLocation", "Mumbai");
      
      console.warn("Geolocation is not supported by your browser. Using default location (Mumbai, India).");
    }
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (dashboardSearchQuery.trim()) {
      // Store search query and location data
      sessionStorage.setItem("searchQuery", dashboardSearchQuery);
      sessionStorage.setItem("searchType", "intelligent");
      if (userCoordinates) {
        sessionStorage.setItem("searchWithLocation", "true");
        sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
      }
      // Navigate to intelligent search results
      navigate(`/search-results?q=${encodeURIComponent(dashboardSearchQuery)}`);
    }
  };

  // Popular cities
  const locations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
  ];

  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    localStorage.setItem("userLocation", location);
    setShowLocationModal(false);
    setSearchQuery("");
  };

  // Mock hospital data
  const hospitals = [
    {
      id: 1,
      name: "City Hospital",
      rating: 4.7,
      reviews: 250,
      waitTime: "15 mins",
      icon: "🏥",
    },
    {
      id: 2,
      name: "Medi Clinic",
      rating: 4.6,
      reviews: 300,
      waitTime: "10 mins",
      icon: "🏥",
    },
    {
      id: 3,
      name: "Hospital Care",
      rating: 4.5,
      reviews: 180,
      waitTime: "20 mins",
      icon: "🏥",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center flex-shrink-0">
              <div className="h-[91px] w-[315px] overflow-hidden flex items-center justify-center">
                <img
                  src={logo}
                  alt="Medboro Logo"
                  className="h-[240px] w-[800px] object-contain cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            </Link>

            {/* Central Search Bar */}
            <div className="flex-1 max-w-2xl">
              <form onSubmit={handleSearch}>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search hospitals, doctors, specialties, or symptoms..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      value={dashboardSearchQuery}
                      onChange={(e) => setDashboardSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={getUserLocation}
                    disabled={isGettingLocation}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                      userCoordinates
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                        : 'bg-gradient-to-r from-cyan-400 to-teal-400 text-white hover:from-cyan-500 hover:to-teal-500'
                    } disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap`}
                    title={userCoordinates ? 'Location enabled' : 'Get current location'}
                  >
                    {isGettingLocation ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="hidden sm:inline">Getting...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className={`w-4 h-4 ${userCoordinates ? 'fill-green-700' : ''}`} />
                        <span className="hidden sm:inline">{userCoordinates ? 'Near Me' : 'Near Me'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <SOSButton />
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-6 h-6 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link
                to="/my-dashboard"
                className="flex items-center gap-3 hover:bg-gray-100 rounded-full px-3 py-2"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0)}
                </div>
                <span className="font-medium text-gray-900">{user.name}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="text-lg text-gray-600">
            Book appointments, manage your health, or get instant guidance.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Book Appointment Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Book Appointment</h3>
                <p className="text-sm text-gray-600">
                  Find doctors, view available slots, book instantly
                </p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/hospital-search">Find a Doctor</Link>
            </Button>
          </div>

          {/* Symptom Checker Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-900">Symptom Checker</h3>
                  <span className="text-xs bg-gradient-to-r from-cyan-400 to-teal-400 text-white px-2 py-1 rounded-full font-medium">
                    Premium
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Describe your problem and get doctor recommendations
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/symptom-search">Describe Symptoms</Link>
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              AI suggestions are not a medical diagnosis
            </p>
          </div>

          {/* Today's Status Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Status</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-cyan-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Next appointment</p>
                  {nextAppointment ? (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-800">{nextAppointment.date} at {nextAppointment.time}</p>
                      <p>{nextAppointment.doctorName}</p>
                      <p className="text-cyan-600">{nextAppointment.specialty}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">None scheduled</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-cyan-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Pending reports</p>
                  <p className="text-sm text-gray-600">0</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-cyan-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Free reschedules left</p>
                  <p className="text-sm text-gray-600">2</p>
                </div>
              </div>
            </div>
            <Link
              to="/my-dashboard"
              className="text-cyan-600 hover:text-teal-600 font-medium text-sm mt-4 inline-flex items-center gap-1"
            >
              View Dashboard →
            </Link>
          </div>
        </div>

        {/* Smart Slot Booking Banner */}
        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-4 mb-12 border border-cyan-100">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">Smart Slot Booking</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>30-minute slots</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>15-minute late buffer</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Free reschedule</span>
            </div>
          </div>
        </div>

        {/* My Health Hub */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Health Hub</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* My Appointments */}
            <Link
              to="/my-dashboard#appointments"
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-to-br group-hover:from-cyan-200 group-hover:to-teal-200 transition-colors">
                <Calendar className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">My Appointments</h3>
              <p className="text-sm text-gray-600">Upcoming & past visits</p>
            </Link>

            {/* Medical Records */}
            <Link
              to="/medical-records"
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center group"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Medical Records</h3>
              <p className="text-sm text-gray-600">Prescriptions, reports, scans</p>
            </Link>

            {/* Insurance Claims */}
            <Link
              to="/insurance"
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-to-br group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Insurance Claims</h3>
              <p className="text-sm text-gray-600">Check coverage & guidance</p>
            </Link>

            {/* 24/7 Support */}
            <Link
              to="/support"
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-to-br group-hover:from-cyan-200 group-hover:to-teal-200 transition-colors">
                <MessageCircle className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">24/7 Support</h3>
              <p className="text-sm text-gray-600">Chatbot & human support</p>
            </Link>

            {/* Premium */}
            <Link
              to="/subscriptions"
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center group"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                <Star className="w-8 h-8 text-yellow-600 fill-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Premium</h3>
              <p className="text-sm text-gray-600">AI tools, priority booking</p>
            </Link>
          </div>
        </div>
      </main>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Select Location</h2>
              <button className="p-1" onClick={() => setShowLocationModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Search location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ul className="max-h-64 overflow-y-auto">
              {filteredLocations.map((location) => (
                <li
                  key={location}
                  className="p-3 cursor-pointer hover:bg-gray-100 rounded-lg"
                  onClick={() => handleLocationSelect(location)}
                >
                  {location}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
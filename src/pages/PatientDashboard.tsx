import { Link, useNavigate } from 'react-router';
import { Calendar, Clock, MapPin, User, FileText, CreditCard, Bell, ArrowLeft, LogOut, X, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { SOSButton } from '../components/SOSButton';
import { Appointment } from '../lib/mockData';
import { useState, useEffect } from 'react';
import { getUserAppointments, updateAppointment, deleteAppointment } from '../utils/api';

export function PatientDashboard() {
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Guest","id":"guest"}');
  
  // State for modals
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load appointments from database
  useEffect(() => {
    loadAppointments();
  }, []);
  
  const loadAppointments = async () => {
    try {
      setLoading(true);
      const dbAppointments = await getUserAppointments(user.id || 'guest');
      
      // Also get from localStorage as fallback
      const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      // Merge both sources (prioritize database)
      const allAppointments = [...dbAppointments, ...localAppointments];
      
      // Remove duplicates based on ID
      const uniqueAppointments = allAppointments.reduce((acc, current) => {
        const exists = acc.find((item: Appointment) => item.id === current.id);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, [] as Appointment[]);
      
      setAppointments(uniqueAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      // Fallback to localStorage
      const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      setAppointments(localAppointments);
    } finally {
      setLoading(false);
    }
  };
  
  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming');
  const pastAppointments = appointments.filter(a => a.status === 'completed');
  
  const handleSignOut = () => {
    // Clear user session data
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    // Navigate to landing page
    navigate('/');
  };
  
  // Handler functions
  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };
  
  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleDate(appointment.date);
    setRescheduleTime(appointment.time);
    setShowRescheduleModal(true);
  };
  
  const handleCancelAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };
  
  const confirmCancel = async () => {
    if (selectedAppointment) {
      try {
        // Delete from database
        await deleteAppointment(user.id || 'guest', selectedAppointment.id);
        
        // Also remove from localStorage
        const updatedAppointments = appointments.filter(a => a.id !== selectedAppointment.id);
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        
        setShowCancelModal(false);
        setSelectedAppointment(null);
        
        // Reload appointments
        await loadAppointments();
      } catch (error) {
        console.error('Error canceling appointment:', error);
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };
  
  const confirmReschedule = async () => {
    if (selectedAppointment && rescheduleDate && rescheduleTime) {
      try {
        // Update in database
        await updateAppointment(selectedAppointment.id, {
          userId: user.id || 'guest',
          date: rescheduleDate,
          time: rescheduleTime
        });
        
        // Also update localStorage
        const updatedAppointments = appointments.map(a => 
          a.id === selectedAppointment.id 
            ? { ...a, date: rescheduleDate, time: rescheduleTime }
            : a
        );
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        
        setShowRescheduleModal(false);
        setSelectedAppointment(null);
        
        // Reload appointments
        await loadAppointments();
      } catch (error) {
        console.error('Error rescheduling appointment:', error);
        alert('Failed to reschedule appointment. Please try again.');
      }
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 hover:text-blue-600">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center gap-4">
              <SOSButton />
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm">{user.name}</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative" onClick={handleSignOut}>
                <LogOut className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointments */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl">My Appointments</h1>
                <Link to="/hospital-search">
                  <Button>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book New
                  </Button>
                </Link>
              </div>
              
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl mb-1">{appointment.doctorName}</h3>
                          <p className="text-blue-600 mb-2">{appointment.specialty}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          Upcoming
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{appointment.hospitalName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{appointment.time}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(appointment)}>View Details</Button>
                        <Button variant="outline" size="sm" onClick={() => handleReschedule(appointment)}>Reschedule</Button>
                        <Button variant="secondary" size="sm" onClick={() => handleCancelAppointment(appointment)}>Cancel</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl mb-2">No Upcoming Appointments</h3>
                  <p className="text-gray-600 mb-6">You don't have any scheduled appointments</p>
                  <Link to="/hospital-search">
                    <Button>Book Your First Appointment</Button>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <div>
                <h2 className="text-2xl mb-6">Past Appointments</h2>
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white rounded-xl p-6 shadow-sm opacity-75">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl mb-1">{appointment.doctorName}</h3>
                          <p className="text-gray-600 mb-2">{appointment.specialty}</p>
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          Completed
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span>{appointment.date}</span>
                        <span>{appointment.time}</span>
                      </div>
                      
                      <Button variant="outline" size="sm">Download Prescription</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/medical-records" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Medical Records</span>
                </Link>
                <Link to="/subscriptions" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <span>Subscriptions</span>
                </Link>
                <button className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors w-full text-left">
                  <User className="w-5 h-5 text-green-600" />
                  <span>Edit Profile</span>
                </button>
                <button onClick={handleSignOut} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors w-full text-left">
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Modals */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl">Appointment Details</h2>
              <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => setShowDetailsModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <User className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Doctor: {selectedAppointment.doctorName}</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span className="text-sm">Hospital: {selectedAppointment.hospitalName}</span>
              </div>
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-sm">Date: {selectedAppointment.date}</span>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-sm">Time: {selectedAppointment.time}</span>
              </div>
              <div className="flex items-center gap-4">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-sm">Specialty: {selectedAppointment.specialty}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl">Cancel Appointment</h2>
              <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => setShowCancelModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm">Are you sure you want to cancel this appointment with {selectedAppointment.doctorName} on {selectedAppointment.date} at {selectedAppointment.time}?</p>
              
              <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" onClick={confirmCancel}>Cancel Appointment</Button>
                <Button variant="outline" size="sm" onClick={() => setShowCancelModal(false)}>Go Back</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl">Reschedule Appointment</h2>
              <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => setShowRescheduleModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm">Reschedule your appointment with {selectedAppointment.doctorName} on {selectedAppointment.date} at {selectedAppointment.time}.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">New Date</label>
                  <input type="date" className="w-full p-2 border border-gray-300 rounded-lg" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm">New Time</label>
                  <input type="time" className="w-full p-2 border border-gray-300 rounded-lg" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" onClick={confirmReschedule}>Reschedule Appointment</Button>
                <Button variant="outline" size="sm" onClick={() => setShowRescheduleModal(false)}>Go Back</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
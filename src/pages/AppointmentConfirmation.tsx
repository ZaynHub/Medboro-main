import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CheckCircle, Download, Calendar, MapPin } from 'lucide-react';
import { Button } from '../components/Button';

export function AppointmentConfirmation() {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<any>(null);
  
  useEffect(() => {
    const confirmedAppointment = sessionStorage.getItem('confirmedAppointment');
    if (confirmedAppointment) {
      setAppointment(JSON.parse(confirmedAppointment));
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  if (!appointment) {
    return null;
  }
  
  // Generate QR code data URL (mock)
  const qrCodeData = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='white'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='black' font-size='12'%3EAppointment ID: ${appointment.id}%3C/text%3E%3C/svg%3E`;
  
  return (
    <div className="min-h-screen">
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl mb-3">Appointment Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Your appointment has been successfully booked. 
            Please save your QR code for check-in.
          </p>
          
          {/* QR Code */}
          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            <div className="w-48 h-48 bg-white rounded-lg shadow-sm mx-auto mb-4 flex items-center justify-center border-2 border-gray-200">
              <img src={qrCodeData} alt="Appointment QR Code" className="w-full h-full" />
            </div>
            <p className="text-sm text-gray-600">Appointment ID: {appointment.id}</p>
          </div>
          
          {/* Appointment Details */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-xl mb-4 text-center">Appointment Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-medium">{appointment.doctorName}</p>
                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hospital</p>
                  <p className="font-medium">{appointment.hospitalName}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium">{appointment.date}</p>
                  <p className="text-sm text-gray-600">{appointment.time}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
            <Link to="/my-dashboard" className="flex-1">
              <Button className="w-full">View My Appointments</Button>
            </Link>
          </div>
          
          <Link to="/dashboard" className="inline-block mt-6 text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
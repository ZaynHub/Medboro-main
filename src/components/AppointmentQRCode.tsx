import { useEffect, useRef } from 'react';
import { CheckCircle2, Calendar, Clock, User, Hospital, MapPin } from 'lucide-react';

interface AppointmentQRCodeProps {
  appointment: {
    id: string;
    doctorName: string;
    hospitalName: string;
    date: string;
    time: string;
    patientName: string;
    paymentTime?: string;
    paymentId?: string;
  };
}

export function AppointmentQRCode({ appointment }: AppointmentQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Generate QR code data string
    const qrData = JSON.stringify({
      appointmentId: appointment.id,
      patient: appointment.patientName,
      doctor: appointment.doctorName,
      hospital: appointment.hospitalName,
      date: appointment.date,
      time: appointment.time,
      paymentTime: appointment.paymentTime,
      paymentId: appointment.paymentId,
      verified: true
    });
    
    // Generate QR code using QRCode library
    if (canvasRef.current && (window as any).QRCode) {
      (window as any).QRCode.toCanvas(canvasRef.current, qrData, {
        width: 280,
        margin: 2,
        color: {
          dark: '#0891b2', // cyan-600
          light: '#ffffff'
        }
      });
    }
  }, [appointment]);
  
  // Load QRCode library
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      {/* Verification Badge */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full p-3">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
            Verification Complete
          </h2>
          <p className="text-sm text-gray-600">Payment Successful</p>
        </div>
      </div>
      
      {/* QR Code */}
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 mb-6 flex justify-center">
        <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
      </div>
      
      {/* Appointment Details */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Patient Name</p>
            <p className="font-semibold text-gray-900">{appointment.patientName}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Doctor</p>
            <p className="font-semibold text-gray-900">{appointment.doctorName}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Hospital className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Hospital</p>
            <p className="font-semibold text-gray-900">{appointment.hospitalName}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
              <p className="font-semibold text-gray-900">{appointment.date}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
              <p className="font-semibold text-gray-900">{appointment.time}</p>
            </div>
          </div>
        </div>
        
        {appointment.paymentTime && (
          <div className="flex items-start gap-3 pt-4 border-t">
            <Clock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Completed At</p>
              <p className="font-semibold text-gray-900">{appointment.paymentTime}</p>
              {appointment.paymentId && (
                <p className="text-xs text-gray-400 mt-1">ID: {appointment.paymentId}</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div className="mt-6 bg-cyan-50 rounded-lg p-4">
        <p className="text-sm text-cyan-900 font-medium mb-1">📱 Show this QR code at the hospital</p>
        <p className="text-xs text-cyan-700">
          Present this QR code at the reception desk to verify your appointment and complete check-in.
        </p>
      </div>
    </div>
  );
}

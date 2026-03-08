import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle, CheckCircle, Truck, MapPin } from 'lucide-react';
import { Button } from '../components/Button';

type EmergencyStatus = 'requested' | 'dispatched' | 'arrived';

export function EmergencyStatus() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<EmergencyStatus>('requested');
  const emergencyId = localStorage.getItem('activeEmergency');
  
  useEffect(() => {
    if (!emergencyId) {
      navigate('/my-dashboard');
      return;
    }
    
    // Simulate status progression
    const timer1 = setTimeout(() => setStatus('dispatched'), 3000);
    const timer2 = setTimeout(() => setStatus('arrived'), 8000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [emergencyId, navigate]);
  
  const statusSteps = [
    { id: 'requested', label: 'Emergency Requested', icon: AlertCircle, color: 'red' },
    { id: 'dispatched', label: 'Ambulance Dispatched', icon: Truck, color: 'yellow' },
    { id: 'arrived', label: 'Help Arrived', icon: CheckCircle, color: 'green' },
  ];
  
  const currentStepIndex = statusSteps.findIndex(s => s.id === status);
  
  return (
    <div className="min-h-screen">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl mb-3">Emergency Response Active</h1>
            <p className="text-gray-600">Help is on the way. Stay calm and safe.</p>
          </div>
          
          {/* Status Timeline */}
          <div className="mb-12">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-start gap-4 mb-8 last:mb-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? step.color === 'red' ? 'bg-red-600' :
                        step.color === 'yellow' ? 'bg-yellow-600' :
                        'bg-green-600'
                      : 'bg-gray-200'
                  }`}>
                    <Icon className={`w-6 h-6 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  
                  <div className="flex-1 pt-2">
                    <h3 className={`text-lg mb-1 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </h3>
                    {isCurrent && (
                      <p className="text-sm text-gray-600">In progress...</p>
                    )}
                    {index < currentStepIndex && (
                      <p className="text-sm text-green-600">Completed</p>
                    )}
                  </div>
                  
                  {isCompleted && (
                    <span className="text-sm text-gray-500 mt-2">
                      {new Date().toLocaleTimeString()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Emergency Info */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Current Location</p>
                <p className="text-gray-700">123 Main Street, New York, NY 10001</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="mb-2">Emergency ID: {emergencyId}</p>
              <p>Estimated arrival: 8-12 minutes</p>
            </div>
          </div>
          
          {/* Contact Emergency Services */}
          <div className="border-t pt-6">
            <p className="text-center text-gray-600 mb-4">
              If you need immediate assistance, call emergency services
            </p>
            <a href="tel:911" className="block">
              <Button variant="danger" className="w-full" size="lg">
                Call 911
              </Button>
            </a>
          </div>
          
          {status === 'arrived' && (
            <div className="mt-6">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  localStorage.removeItem('activeEmergency');
                  navigate('/my-dashboard');
                }}
              >
                Close Emergency
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
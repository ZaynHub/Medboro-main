import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertOctagon, AlertCircle } from 'lucide-react';
import { Button } from './Button';

export function SOSButton() {
  const navigate = useNavigate();
  const [showSOSModal, setShowSOSModal] = useState(false);

  const handleSOSClick = () => {
    setShowSOSModal(true);
  };

  const handleSOSConfirm = () => {
    // Mock emergency request - in production would call API: POST /emergency
    const emergencyId = Date.now().toString();
    localStorage.setItem('activeEmergency', emergencyId);
    navigate('/emergency-status');
  };

  return (
    <>
      <button 
        onClick={handleSOSClick}
        className="p-2 hover:bg-red-50 rounded-lg relative transition-colors group"
        title="Emergency SOS"
      >
        <AlertOctagon className="w-5 h-5 text-red-600 group-hover:text-red-700" />
      </button>

      {/* SOS Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl mb-4 text-center">Emergency Assistance</h2>
            <p className="text-gray-600 text-center mb-6">
              Are you experiencing a medical emergency? 
              We will immediately dispatch an ambulance to your location.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowSOSModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleSOSConfirm}
              >
                Confirm Emergency
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

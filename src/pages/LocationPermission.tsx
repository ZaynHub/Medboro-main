import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { MapPin } from 'lucide-react';

export function LocationPermission() {
  const navigate = useNavigate();
  
  const handleAllow = () => {
    // Mock location permission - in production would call navigator.geolocation.getCurrentPosition
    localStorage.setItem('locationEnabled', 'true');
    navigate('/dashboard');
  };
  
  const handleSkip = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-10 h-10 text-blue-600" />
        </div>
        
        <h1 className="text-3xl mb-4">Enable Location Access</h1>
        <p className="text-gray-600 mb-8">
          We use your location to find nearby hospitals and doctors. 
          This helps us provide you with the most relevant healthcare options.
        </p>
        
        <div className="space-y-3">
          <Button onClick={handleAllow} className="w-full" size="lg">
            Allow Location
          </Button>
          <Button onClick={handleSkip} variant="secondary" className="w-full" size="lg">
            Skip for Now
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          You can change this setting anytime in your profile
        </p>
      </div>
    </div>
  );
}
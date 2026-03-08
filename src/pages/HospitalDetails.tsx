import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, MapPin, Star, Phone, Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { mockHospitals } from '../lib/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function HospitalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hospital = mockHospitals.find(h => h.id === id);
  
  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Hospital not found</h2>
          <Button onClick={() => navigate('/hospital-search')}>Back to Search</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={() => navigate('/hospital-search')} className="flex items-center gap-2 hover:text-blue-600">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Search</span>
          </button>
        </div>
      </header>
      
      {/* Hospital Banner */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="h-80 relative">
            <ImageWithFallback
              src={hospital.image}
              alt={hospital.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h1 className="text-4xl mb-2">{hospital.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span>{hospital.rating} Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  <span>{hospital.distance} away</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hospital Info */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl mb-4">About</h2>
              <p className="text-gray-600 mb-4">{hospital.address}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hours</p>
                    <p>24/7 Emergency Care</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Specialties */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl mb-4">Specialties</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hospital.specialties.map((specialty) => (
                  <div key={specialty} className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-blue-900">{specialty}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6">
              <h3 className="text-xl mb-4">Book an Appointment</h3>
              <p className="text-gray-600 mb-6">
                Choose from our experienced doctors and book your appointment
              </p>
              <Link to={`/hospital/${hospital.id}/doctors`}>
                <Button className="w-full" size="lg">View Doctors</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
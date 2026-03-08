import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Star, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { mockDoctors, mockHospitals } from '../lib/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function DoctorList() {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  
  const hospital = mockHospitals.find(h => h.id === hospitalId);
  const doctors = mockDoctors.filter(d => d.hospitalId === hospitalId);
  
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
          <button onClick={() => navigate(`/hospital/${hospitalId}`)} className="flex items-center gap-2 hover:text-blue-600 mb-3">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Hospital</span>
          </button>
          <h1 className="text-2xl">{hospital.name} - Doctors</h1>
        </div>
      </header>
      
      {/* Doctor List */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} available
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <ImageWithFallback
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl mb-1">{doctor.name}</h3>
                <p className="text-blue-600 mb-3">{doctor.specialty}</p>
                
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Experience</span>
                    <span className="font-medium text-gray-900">{doctor.experience} years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-gray-900">{doctor.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Consultation Fee</span>
                    <span className="font-medium text-gray-900">${doctor.fee}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/doctor/${doctor.id}/slots`)}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {doctors.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl mb-2">No doctors available</h3>
            <p className="text-gray-600">Please check back later</p>
          </div>
        )}
      </main>
    </div>
  );
}
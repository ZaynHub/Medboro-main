import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Star, MapPin, Calendar } from 'lucide-react';
import { Button } from '../components/Button';
import { mockDoctors } from '../lib/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function RecommendedDoctors() {
  const { specialtyName } = useParams();
  const navigate = useNavigate();
  
  // Filter doctors by specialty
  const doctors = mockDoctors
    .filter(d => d.specialty.toLowerCase() === specialtyName?.toLowerCase())
    .sort((a, b) => b.rating - a.rating); // Sort by rating
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={() => navigate('/specialty-search')} className="flex items-center gap-2 hover:text-blue-600 mb-3">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Specialties</span>
          </button>
          <h1 className="text-2xl">{specialtyName} Specialists</h1>
        </div>
      </header>
      
      {/* Doctor List */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {doctors.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} found, sorted by rating
              </p>
            </div>
            
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-48 md:h-auto bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                      <ImageWithFallback
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white"
                      />
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h2 className="text-2xl mb-1">{doctor.name}</h2>
                          <p className="text-blue-600 mb-2">{doctor.specialty}</p>
                        </div>
                        
                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{doctor.rating}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Experience</p>
                          <p className="font-medium">{doctor.experience} years</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Hospital</p>
                          <p className="font-medium">{doctor.hospitalName}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Consultation Fee</p>
                          <p className="font-medium">${doctor.fee}</p>
                        </div>
                      </div>
                      
                      <Button onClick={() => navigate(`/doctor/${doctor.id}/slots`)}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl mb-2">No doctors found</h3>
            <p className="text-gray-600 mb-6">
              No doctors available for {specialtyName} at the moment
            </p>
            <Button onClick={() => navigate('/specialty-search')}>
              Try Another Specialty
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
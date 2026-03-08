import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Star, Calendar, AlertCircle, Sparkles, Map, List } from 'lucide-react';
import { Button } from '../components/Button';
import { mockDoctors } from '../lib/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { GoogleMap } from '../components/GoogleMap';

// Simple symptom-to-specialty mapping
const symptomMapping: Record<string, string> = {
  'Fever': 'General Medicine',
  'Headache': 'Neurology',
  'Cough': 'General Medicine',
  'Chest Pain': 'Cardiology',
  'Stomach Pain': 'Gastroenterology',
  'Back Pain': 'Orthopedics',
  'Joint Pain': 'Orthopedics',
  'Skin Rash': 'Dermatology',
  'Eye Pain': 'Ophthalmology',
  'Ear Pain': 'ENT',
  'Sore Throat': 'ENT',
};

export function SymptomResults() {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [suggestedSpecialty, setSuggestedSpecialty] = useState<string>('General Medicine');
  const [aiDiagnosis, setAiDiagnosis] = useState<{ condition: string; description: string; specialty: string } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number }>({ lat: 40.7128, lng: -74.006 });
  
  useEffect(() => {
    const storedSymptoms = sessionStorage.getItem('symptoms');
    const storedAiDiagnosis = sessionStorage.getItem('aiDiagnosis');
    const coords = sessionStorage.getItem('userCoordinates');
    
    if (coords) {
      const parsedCoords = JSON.parse(coords);
      setUserCoordinates(parsedCoords);
    }
    
    if (storedSymptoms) {
      const parsedSymptoms = JSON.parse(storedSymptoms);
      setSymptoms(parsedSymptoms);
      
      // Check if we have AI diagnosis
      if (storedAiDiagnosis) {
        const parsedDiagnosis = JSON.parse(storedAiDiagnosis);
        setAiDiagnosis(parsedDiagnosis);
        setSuggestedSpecialty(mapSpecialtyToMockData(parsedDiagnosis.specialty));
      } else {
        // Fallback to basic symptom mapping
        let specialty = 'General Medicine';
        for (const symptom of parsedSymptoms) {
          if (symptomMapping[symptom]) {
            specialty = symptomMapping[symptom];
            break;
          }
        }
        setSuggestedSpecialty(specialty);
      }
    } else {
      navigate('/symptom-search');
    }
  }, [navigate]);
  
  // Map AI specialty names to mock data specialty names
  const mapSpecialtyToMockData = (aiSpecialty: string): string => {
    const mapping: Record<string, string> = {
      'General Physician': 'General Medicine',
      'Cardiologist': 'Cardiology',
      'Gastroenterologist': 'Gastroenterology',
      'Neurologist': 'Neurology',
      'Orthopedist': 'Orthopedics',
      'Dermatologist': 'Dermatology'
    };
    return mapping[aiSpecialty] || 'General Medicine';
  };
  
  // Get doctors matching the suggested specialty
  const recommendedDoctors = mockDoctors
    .filter(d => d.specialty === suggestedSpecialty)
    .sort((a, b) => b.rating - a.rating);
  
  // Mock coordinates for doctors (in real app, these would come from the database)
  const doctorMarkers = recommendedDoctors.map((doctor, index) => ({
    id: doctor.id,
    name: doctor.name,
    lat: userCoordinates.lat + (Math.random() - 0.5) * 0.1,
    lng: userCoordinates.lng + (Math.random() - 0.5) * 0.1,
    address: doctor.hospitalName,
    specialty: doctor.specialty,
    rating: doctor.rating,
  }));
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={() => navigate('/symptom-search')} className="flex items-center gap-2 hover:text-blue-600 mb-3">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Symptoms</span>
          </button>
          <h1 className="text-2xl">Recommended Doctors</h1>
        </div>
      </header>
      
      {/* Results */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* AI Diagnosis (if available) */}
        {aiDiagnosis && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-600 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-xl text-green-900">AI Diagnosis Result</h2>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Powered by AI</span>
                </div>
                <div className="bg-white p-4 rounded-lg mb-3">
                  <p className="text-sm text-gray-500 mb-1">Possible Condition:</p>
                  <p className="text-lg text-gray-900 mb-3">{aiDiagnosis.condition}</p>
                  <p className="text-gray-700">{aiDiagnosis.description}</p>
                </div>
                <p className="text-sm text-gray-600">
                  * This AI analysis is for informational purposes only. Please consult with a healthcare professional for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Symptoms Summary */}
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl mb-2">Based on your symptoms</h2>
              <p className="text-gray-700 mb-3">
                <span className="font-medium">Your symptoms:</span>{' '}
                {symptoms.join(', ')}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Suggested specialty:</span>{' '}
                <span className="text-blue-600">{suggestedSpecialty}</span>
              </p>
              {!aiDiagnosis && (
                <p className="text-sm text-gray-600 mt-2">
                  * This is a preliminary suggestion. Please consult with a doctor for proper diagnosis.
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Recommended {suggestedSpecialty} Specialists</h2>
          <div className="flex items-center">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-full ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-2 rounded-full ${viewMode === 'map' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <Map className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Recommended Doctors */}
        {viewMode === 'list' && recommendedDoctors.length > 0 ? (
          <div>
            <div className="space-y-4">
              {recommendedDoctors.map((doctor) => (
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
                          <h3 className="text-2xl mb-1">{doctor.name}</h3>
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
          </div>
        ) : viewMode === 'map' && recommendedDoctors.length > 0 ? (
          <div className="h-96">
            <GoogleMap
              center={userCoordinates}
              zoom={12}
              markers={doctorMarkers}
              onMarkerClick={(marker) => navigate(`/doctor/${marker.id}/slots`)}
            />
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl mb-2">No doctors available</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find doctors for the suggested specialty at this time
            </p>
            <Button onClick={() => navigate('/hospital-search')}>
              Browse All Hospitals
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Search, MapPin, Star, ArrowLeft, Map, List, Building2, User } from 'lucide-react';
import { Button } from '../components/Button';
import { mockHospitals, mockDoctors } from '../lib/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

type SearchType = 'hospital' | 'doctor' | 'specialty' | 'mixed';

export function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || sessionStorage.getItem('searchQuery') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<SearchType>('mixed');
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number }>({ 
    lat: 40.7128, 
    lng: -74.006 
  });
  const [useLocation, setUseLocation] = useState(false);
  
  useEffect(() => {
    // Check if user has location data
    const coords = sessionStorage.getItem('userCoordinates');
    const searchWithLocation = sessionStorage.getItem('searchWithLocation');
    
    if (coords && searchWithLocation === 'true') {
      const parsedCoords = JSON.parse(coords);
      setUserCoordinates(parsedCoords);
      setUseLocation(true);
    }
  }, []);
  
  // Intelligent search detection
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    
    // Common hospital keywords
    const hospitalKeywords = ['hospital', 'clinic', 'medical center', 'health center', 'care center'];
    
    // Common medical specialties
    const specialties = [
      'cardiology', 'cardiologist',
      'neurology', 'neurologist',
      'pediatrics', 'pediatrician',
      'orthopedics', 'orthopedist',
      'dermatology', 'dermatologist',
      'oncology', 'oncologist',
      'gastroenterology', 'gastroenterologist',
      'ent', 'ophthalmology', 'psychiatry',
      'general medicine', 'general physician'
    ];
    
    // Detect search type
    if (hospitalKeywords.some(keyword => query.includes(keyword))) {
      setSearchType('hospital');
    } else if (specialties.some(specialty => query.includes(specialty))) {
      setSearchType('specialty');
    } else if (query.startsWith('dr.') || query.startsWith('doctor')) {
      setSearchType('doctor');
    } else {
      // Check if it matches doctor names
      const matchesDoctorName = mockDoctors.some(doctor => 
        doctor.name.toLowerCase().includes(query)
      );
      
      if (matchesDoctorName) {
        setSearchType('doctor');
      } else {
        setSearchType('mixed');
      }
    }
  }, [searchQuery]);
  
  // Filter hospitals
  const filteredHospitals = mockHospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Filter doctors
  const filteredDoctors = mockDoctors.filter(doctor => {
    const query = searchQuery.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query) ||
      doctor.hospitalName.toLowerCase().includes(query)
    );
  });
  
  // Determine what to show
  const showHospitals = searchType === 'hospital' || (searchType === 'mixed' && filteredHospitals.length > 0);
  const showDoctors = searchType === 'doctor' || searchType === 'specialty' || (searchType === 'mixed' && filteredDoctors.length > 0);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl">Search Results</h1>
          </div>
        </div>
      </header>
      
      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search hospitals, doctors, specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
          
          {useLocation && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-green-600" />
              <span>Showing results near your location</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Results */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Type Indicator */}
        <div className="mb-6">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">Search type:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium capitalize">
              {searchType === 'mixed' ? 'All Results' : searchType}
            </span>
          </div>
        </div>
        
        {/* Hospitals Section */}
        {showHospitals && filteredHospitals.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Hospitals & Clinics</h2>
              <span className="text-gray-600">({filteredHospitals.length})</span>
            </div>
            
            <div className="grid gap-6">
              {filteredHospitals.map((hospital) => (
                <Link
                  key={hospital.id}
                  to={`/hospital/${hospital.id}`}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="flex gap-6">
                    <div className="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback 
                        src={hospital.image} 
                        alt={hospital.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{hospital.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{hospital.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{hospital.distance}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{hospital.address}</p>
                      <div className="flex flex-wrap gap-2">
                        {hospital.specialties.slice(0, 4).map((specialty, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                            {specialty}
                          </span>
                        ))}
                        {hospital.specialties.length > 4 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            +{hospital.specialties.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Doctors Section */}
        {showDoctors && filteredDoctors.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Doctors</h2>
              <span className="text-gray-600">({filteredDoctors.length})</span>
              {searchType === 'specialty' && (
                <span className="text-sm text-gray-600">
                  - Filtered by specialty: <span className="font-medium">{searchQuery}</span>
                </span>
              )}
            </div>
            
            <div className="grid gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex gap-6">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
                      <p className="text-blue-600 mb-2">{doctor.specialty}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{doctor.rating}</span>
                        </div>
                        <span>{doctor.experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Building2 className="w-4 h-4" />
                        <span>{doctor.hospitalName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-600">Consultation Fee</span>
                          <p className="text-xl font-bold text-gray-900">${doctor.fee}</p>
                        </div>
                        <Link to={`/hospital/${doctor.hospitalId}/doctor/${doctor.id}`}>
                          <Button>Book Appointment</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* No Results */}
        {filteredHospitals.length === 0 && filteredDoctors.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or browse all hospitals and doctors
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/hospital-search">
                <Button>Browse Hospitals</Button>
              </Link>
              <Link to="/specialty-selection">
                <Button variant="outline">Browse Specialties</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
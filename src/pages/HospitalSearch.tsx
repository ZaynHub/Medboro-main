import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, MapPin, Star, ArrowLeft, Map, List } from 'lucide-react';
import { Button } from '../components/Button';
import { mockHospitals } from '../lib/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { GoogleMap } from '../components/GoogleMap';

export function HospitalSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number }>({ lat: 40.7128, lng: -74.006 });
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
  
  const filteredHospitals = mockHospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Mock coordinates for hospitals (in real app, these would come from the database)
  const hospitalMarkers = filteredHospitals.map((hospital, index) => ({
    id: hospital.id,
    name: hospital.name,
    lat: userCoordinates.lat + (Math.random() - 0.5) * 0.1,
    lng: userCoordinates.lng + (Math.random() - 0.5) * 0.1,
    address: hospital.address,
    specialty: hospital.specialties[0],
    rating: hospital.rating,
  }));
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl">Search Hospitals</h1>
          </div>
        </div>
      </header>
      
      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for hospitals, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* View Mode Toggle */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-100'} rounded-lg`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 ${viewMode === 'map' ? 'bg-gray-100' : 'hover:bg-gray-100'} rounded-lg`}
            >
              <Map className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Hospital List */}
      {viewMode === 'list' && (
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-4">
            <p className="text-gray-600">
              Found {filteredHospitals.length} hospital{filteredHospitals.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="space-y-4">
            {filteredHospitals.map((hospital) => (
              <div key={hospital.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-48 md:h-auto">
                    <ImageWithFallback
                      src={hospital.image}
                      alt={hospital.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h2 className="text-2xl mb-1">{hospital.name}</h2>
                        <div className="flex items-center gap-4 text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{hospital.distance} away</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm">{hospital.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{hospital.address}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hospital.specialties.slice(0, 4).map((specialty) => (
                        <span key={specialty} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {specialty}
                        </span>
                      ))}
                      {hospital.specialties.length > 4 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          +{hospital.specialties.length - 4} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Link to={`/hospital/${hospital.id}`}>
                        <Button variant="secondary">View Details</Button>
                      </Link>
                      <Link to={`/hospital/${hospital.id}/doctors`}>
                        <Button>View Doctors</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredHospitals.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl mb-2">No hospitals found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </main>
      )}
      
      {/* Hospital Map */}
      {viewMode === 'map' && (
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-4">
            <p className="text-gray-600">
              Found {filteredHospitals.length} hospital{filteredHospitals.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="h-96">
            <GoogleMap
              center={userCoordinates}
              zoom={12}
              markers={hospitalMarkers}
            />
          </div>
          
          {filteredHospitals.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl mb-2">No hospitals found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
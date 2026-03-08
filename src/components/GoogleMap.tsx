import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface MapMarker {
  id: string | number;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  specialty?: string;
  rating?: number;
}

interface GoogleMapProps {
  center: { lat: number; lng: number };
  markers: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  zoom?: number;
  height?: string;
}

export function GoogleMap({ center, markers, onMarkerClick, zoom = 13, height = '500px' }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  // Note: In a real application, you would load the Google Maps JavaScript API
  // For this demo, we're creating a mock map visualization
  
  useEffect(() => {
    // In a real app, you would initialize Google Maps here
    // window.google.maps.Map(mapRef.current, { center, zoom })
  }, [center, zoom]);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    onMarkerClick?.(marker);
  };

  return (
    <div className="relative">
      {/* Mock Map Container */}
      <div
        ref={mapRef}
        className="w-full rounded-lg overflow-hidden bg-gray-100 relative"
        style={{ height }}
      >
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
          {/* Grid pattern to simulate map */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Mock roads */}
          <svg className="absolute inset-0 w-full h-full opacity-30">
            <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#94a3b8" strokeWidth="3" />
            <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#94a3b8" strokeWidth="3" />
            <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#94a3b8" strokeWidth="3" />
            <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#94a3b8" strokeWidth="3" />
          </svg>
        </div>

        {/* Center Marker (User Location) */}
        <div
          className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '50%', top: '50%' }}
        >
          <div className="relative">
            <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full border-4 border-white shadow-lg animate-pulse" />
            <div className="absolute inset-0 w-4 h-4 bg-cyan-300 rounded-full animate-ping opacity-75" />
          </div>
        </div>

        {/* Markers */}
        {markers.map((marker, index) => {
          // Calculate position around center (mock positioning)
          const angle = (index * (360 / markers.length)) * (Math.PI / 180);
          const radius = 100 + Math.random() * 100;
          const x = 50 + (Math.cos(angle) * radius) / 5;
          const y = 50 + (Math.sin(angle) * radius) / 5;

          return (
            <div
              key={marker.id}
              className="absolute z-20 transform -translate-x-1/2 -translate-y-full cursor-pointer transition-transform hover:scale-110"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => handleMarkerClick(marker)}
            >
              <MapPin className="w-8 h-8 text-red-600 fill-red-600 drop-shadow-lg" />
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                {marker.name}
              </div>
            </div>
          );
        })}

        {/* API Key Notice */}
        <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded shadow-lg text-xs text-gray-600 max-w-xs">
          <p className="font-medium mb-1">📍 Map Visualization (Demo Mode)</p>
          <p className="text-gray-500">
            To enable Google Maps, add your API key. Current view shows approximate locations.
          </p>
        </div>
      </div>

      {/* Selected Marker Info Card */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-xl max-w-sm z-30">
          <button
            onClick={() => setSelectedMarker(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg mb-2">{selectedMarker.name}</h3>
          {selectedMarker.specialty && (
            <p className="text-sm text-cyan-600 mb-1">{selectedMarker.specialty}</p>
          )}
          {selectedMarker.address && (
            <p className="text-sm text-gray-600 mb-2">{selectedMarker.address}</p>
          )}
          {selectedMarker.rating && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-500">★</span>
              <span className="font-medium">{selectedMarker.rating}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  address: string;
  onLocationSelect?: (lat: number, lng: number) => void;
  projectId?: string;
}

function Map({ address, onLocationSelect, projectId }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchAddress, setSearchAddress] = useState(address);
  const mapId = `map-${projectId || 'default'}`;

  useEffect(() => {
    setSearchAddress(address);
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    }
    initializeMap();
  }, [projectId]);

  const initializeMap = () => {
    if (!mapRef.current) {
      mapRef.current = L.map(mapId).setView([43.7384, 7.4246], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);

      if (address) {
        geocodeAddress(address);
      }
    }
  };

  const geocodeAddress = async (addressToGeocode: string) => {
    if (!addressToGeocode || !mapRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressToGeocode)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);

        mapRef.current.setView([latNum, lonNum], 16);

        if (markerRef.current) {
          markerRef.current.remove();
        }
        if (circleRef.current) {
          circleRef.current.remove();
        }

        markerRef.current = L.marker([latNum, lonNum]).addTo(mapRef.current);
        circleRef.current = L.circle([latNum, lonNum], {
          color: '#996D45',
          fillColor: '#996D45',
          fillOpacity: 0.1,
          radius: 500
        }).addTo(mapRef.current);

        if (onLocationSelect) {
          onLocationSelect(latNum, lonNum);
        }
      } else {
        setError('Location not found. Please try a different address.');
      }
    } catch (err) {
      setError('Error finding location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address !== searchAddress) {
      setSearchAddress(address);
      geocodeAddress(address);
    }
  }, [address]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    geocodeAddress(searchAddress);
  };

  return (
    <div className="bg-gray-900 p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center text-white">
        <Navigation className="h-5 w-5 mr-2 text-monaco-bronze" />
        Project Location
      </h2>
      
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Search address..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-monaco-bronze focus:border-monaco-bronze placeholder-gray-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-monaco-bronze text-white rounded-lg hover:bg-monaco-bronze-light transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex items-center space-x-2 text-gray-400">
          <MapPin className="h-5 w-5" />
          <span>{address || 'No address specified'}</span>
        </div>
        
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-monaco-bronze"></div>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-800">
          <div id={mapId} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default Map;
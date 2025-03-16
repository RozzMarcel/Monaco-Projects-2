import React, { useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';

interface MapProps {
  address: string;
  onLocationSelect?: (lat: number, lng: number) => void;
  projectId?: string;
}

function Map({ address, onLocationSelect, projectId }: MapProps) {
  const [searchAddress, setSearchAddress] = useState(address);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for geocoding functionality
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

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
          <span className="text-gray-500">Map functionality coming soon</span>
        </div>
      </div>
    </div>
  );
}

export default Map;
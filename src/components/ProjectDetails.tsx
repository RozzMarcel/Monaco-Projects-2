import React, { useState } from 'react';
import { Building2, Phone, Mail, MapPin, Home, Ruler, Key, ClipboardList, Navigation, User, Save } from 'lucide-react';
import Map from './Map';

interface ProjectDetailsProps {
  project: any;
  section: string;
}

interface StakeholderInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

interface LocationInfo {
  buildingName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
}

function ProjectDetails({ project, section }: ProjectDetailsProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [stakeholder, setStakeholder] = useState<StakeholderInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  const [location, setLocation] = useState<LocationInfo>({
    buildingName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    coordinates: {
      latitude: '',
      longitude: ''
    }
  });

  const handleStakeholderChange = (field: keyof StakeholderInfo, value: string) => {
    setStakeholder(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleLocationChange = (field: keyof LocationInfo, value: string) => {
    setLocation(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setLocation(prev => ({
      ...prev,
      coordinates: {
        latitude: lat.toString(),
        longitude: lng.toString()
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setHasUnsavedChanges(false);
  };

  // Render project location section
  const renderLocation = () => (
    <div className="bg-gray-900 rounded-xl p-6">
      {/* Save Status Indicator */}
      <div className={`fixed bottom-4 right-4 transition-opacity duration-300 ${hasUnsavedChanges ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={handleSave}
          className="bg-monaco-bronze text-white px-4 py-2 rounded-lg shadow-lg flex items-center hover:bg-monaco-bronze-light transition-colors"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Changes
        </button>
      </div>

      <h2 className="text-xl font-bold mb-6 flex items-center text-white">
        <Navigation className="h-5 w-5 mr-2 text-monaco-bronze" />
        Project Location
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Building Name</label>
            <input
              type="text"
              value={location.buildingName}
              onChange={(e) => handleLocationChange('buildingName', e.target.value)}
              placeholder="Enter building name"
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Street Address</label>
            <input
              type="text"
              value={location.address}
              onChange={(e) => handleLocationChange('address', e.target.value)}
              placeholder="Enter street address"
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">City</label>
              <input
                type="text"
                value={location.city}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                placeholder="Enter city"
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Postal Code</label>
              <input
                type="text"
                value={location.postalCode}
                onChange={(e) => handleLocationChange('postalCode', e.target.value)}
                placeholder="Enter postal code"
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Country</label>
            <input
              type="text"
              value={location.country}
              onChange={(e) => handleLocationChange('country', e.target.value)}
              placeholder="Enter country"
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Latitude</label>
              <input
                type="text"
                value={location.coordinates.latitude}
                readOnly
                className="w-full bg-gray-800 border-gray-700 rounded-lg text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Longitude</label>
              <input
                type="text"
                value={location.coordinates.longitude}
                readOnly
                className="w-full bg-gray-800 border-gray-700 rounded-lg text-gray-400"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Map Location</label>
          <div className="h-[400px] bg-gray-800 rounded-lg overflow-hidden">
            <Map 
              address={[
                location.buildingName,
                location.address,
                location.city,
                location.postalCode,
                location.country
              ].filter(Boolean).join(', ')}
              onLocationSelect={handleCoordinatesChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render stakeholder information section
  const renderStakeholderInfo = () => (
    <div className="bg-gray-900 rounded-xl p-6">
      {/* Save Status Indicator */}
      <div className={`fixed bottom-4 right-4 transition-opacity duration-300 ${hasUnsavedChanges ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={handleSave}
          className="bg-monaco-bronze text-white px-4 py-2 rounded-lg shadow-lg flex items-center hover:bg-monaco-bronze-light transition-colors"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Changes
        </button>
      </div>

      <h2 className="text-xl font-bold mb-6 flex items-center text-white">
        <Building2 className="h-5 w-5 mr-2 text-monaco-bronze" />
        Stakeholder Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Contact Details</label>
          <div className="space-y-4">
            <div>
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={stakeholder.name}
                  onChange={(e) => handleStakeholderChange('name', e.target.value)}
                  placeholder="Stakeholder name"
                  className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  type="tel"
                  value={stakeholder.phone}
                  onChange={(e) => handleStakeholderChange('phone', e.target.value)}
                  placeholder="Phone number"
                  className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  type="email"
                  value={stakeholder.email}
                  onChange={(e) => handleStakeholderChange('email', e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={stakeholder.address}
                  onChange={(e) => handleStakeholderChange('address', e.target.value)}
                  placeholder="Address"
                  className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Additional Notes</label>
          <textarea
            rows={4}
            value={stakeholder.notes}
            onChange={(e) => handleStakeholderChange('notes', e.target.value)}
            placeholder="Add any relevant notes here..."
            className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
          />
        </div>
      </div>
    </div>
  );

  // Render the appropriate section based on the active section
  return (
    <div className="space-y-8">
      {section === 'stakeholder' && renderStakeholderInfo()}
      {section === 'specifications' && renderSpecifications()}
      {section === 'location' && renderLocation()}
      {section === 'details' && (
        <>
          {renderOverview()}
          {renderStakeholderInfo()}
          {renderSpecifications()}
          {renderLocation()}
        </>
      )}
    </div>
  );
}

export default ProjectDetails;
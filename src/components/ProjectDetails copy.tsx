import React, { useState } from 'react';
import { Building2, Phone, Mail, MapPin, Home, Ruler, Key, ClipboardList, Navigation } from 'lucide-react';
import Map from './Map';

interface ProjectData {
  name: string;
  startDate: string;
  preparedBy: string;
  reportDate: string;
  stakeholder: {
    name: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
  };
  projectLocation: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    coordinates: {
      latitude: string;
      longitude: string;
    };
  };
  accessInstructions: string;
  size: string;
  duration: string;
  details: string;
  descriptionOfWorks: string;
}

interface ProjectDetailsProps {
  project: any;
  section: string;
}

function ProjectDetails({ project, section }: ProjectDetailsProps) {
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "PROJECT 1",
    startDate: "2023-08-09",
    preparedBy: "Rozz Marcel",
    reportDate: "2023-08-09",
    stakeholder: {
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: ""
    },
    projectLocation: {
      address: "",
      city: "",
      country: "",
      postalCode: "",
      coordinates: {
        latitude: "",
        longitude: ""
      }
    },
    accessInstructions: "",
    size: "",
    duration: "2 WKS",
    details: "",
    descriptionOfWorks: ""
  });

  const handleStakeholderChange = (field: keyof typeof projectData.stakeholder, value: string) => {
    setProjectData(prev => ({
      ...prev,
      stakeholder: {
        ...prev.stakeholder,
        [field]: value
      }
    }));
  };

  const handleLocationChange = (field: keyof typeof projectData.projectLocation, value: string) => {
    if (field === 'coordinates') return;
    setProjectData(prev => ({
      ...prev,
      projectLocation: {
        ...prev.projectLocation,
        [field]: value
      }
    }));
  };

  // Render stakeholder information section
  const renderStakeholderInfo = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <Building2 className="h-5 w-5 mr-2 text-monaco-bronze" />
        Stakeholder Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Details</label>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Name</label>
              <input
                type="text"
                value={projectData.stakeholder.name}
                onChange={(e) => handleStakeholderChange('name', e.target.value)}
                placeholder="Stakeholder name"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
              />
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="tel"
                value={projectData.stakeholder.phone}
                onChange={(e) => handleStakeholderChange('phone', e.target.value)}
                placeholder="Phone Number"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
              />
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="email"
                value={projectData.stakeholder.email}
                onChange={(e) => handleStakeholderChange('email', e.target.value)}
                placeholder="Email Address"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
              />
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="text"
                value={projectData.stakeholder.address}
                onChange={(e) => handleStakeholderChange('address', e.target.value)}
                placeholder="Address"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Notes</label>
          <textarea
            rows={4}
            value={projectData.stakeholder.notes}
            onChange={(e) => handleStakeholderChange('notes', e.target.value)}
            placeholder="Add any relevant notes here..."
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
          />
        </div>
      </div>
    </div>
  );

  // Render project specifications section
  const renderSpecifications = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <Ruler className="h-5 w-5 mr-2 text-monaco-bronze" />
        Project Specifications
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Details</label>
          <div className="space-y-4">
            <div className="flex items-center">
              <Ruler className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="text"
                value={projectData.size}
                onChange={(e) => setProjectData(prev => ({ ...prev, size: e.target.value }))}
                placeholder="Size (M²)"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
              />
            </div>
            <div>
              <div className="flex items-start mb-1">
                <Key className="h-4 w-4 text-gray-400 mr-2 mt-2" />
                <textarea
                  rows={3}
                  value={projectData.accessInstructions}
                  onChange={(e) => setProjectData(prev => ({ ...prev, accessInstructions: e.target.value }))}
                  placeholder="Access Instructions"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Work Description</label>
          <div className="flex items-start">
            <ClipboardList className="h-4 w-4 text-gray-400 mr-2 mt-2" />
            <textarea
              rows={8}
              value={projectData.descriptionOfWorks}
              onChange={(e) => setProjectData(prev => ({ ...prev, descriptionOfWorks: e.target.value }))}
              placeholder="Detailed description of works to be carried out..."
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render project location section
  const renderLocation = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <Navigation className="h-5 w-5 mr-2 text-monaco-bronze" />
        Project Location
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <input
              type="text"
              value={projectData.projectLocation.address}
              onChange={(e) => handleLocationChange('address', e.target.value)}
              placeholder="Enter street address"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={projectData.projectLocation.city}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                placeholder="Enter city"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
              <input
                type="text"
                value={projectData.projectLocation.postalCode}
                onChange={(e) => handleLocationChange('postalCode', e.target.value)}
                placeholder="Enter postal code"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              value={projectData.projectLocation.country}
              onChange={(e) => handleLocationChange('country', e.target.value)}
              placeholder="Enter country"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
            />
          </div>
        </div>
        <div>
          <Map 
            address={[
              projectData.projectLocation.address,
              projectData.projectLocation.city,
              projectData.projectLocation.postalCode,
              projectData.projectLocation.country
            ].filter(Boolean).join(', ')}
            onLocationSelect={(lat, lng) => {
              setProjectData(prev => ({
                ...prev,
                projectLocation: {
                  ...prev.projectLocation,
                  coordinates: {
                    latitude: lat.toString(),
                    longitude: lng.toString()
                  }
                }
              }));
            }}
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
          {renderStakeholderInfo()}
          {renderSpecifications()}
          {renderLocation()}
        </>
      )}
    </div>
  );
}

export default ProjectDetails;
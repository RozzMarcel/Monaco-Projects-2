import React from 'react';
import { ChevronRight, FileText, Building2, Ruler, MapPin, Phone, Mail, User, Save, Calendar, Tag } from 'lucide-react';
import Map from './Map';

interface Level1Props {
  project: any;
  section: string;
  onSectionChange: (section: string) => void;
}

function Level1({ project, section, onSectionChange }: Level1Props) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState(section);
  const [overview, setOverview] = React.useState({
    name: project.name || '',
    description: project.description || '',
    startDate: project.startDate || '',
    duration: project.duration || '',
    status: project.status || 'pending',
    tags: ['Residential', 'Renovation', 'High-End', 'Interior', 'Level 3']
  });
  const [stakeholder, setStakeholder] = React.useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  const [location, setLocation] = React.useState({
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

  const [specifications, setSpecifications] = React.useState({
    size: '',
    accessInstructions: '',
    descriptionOfWorks: '',
    duration: project.duration || ''
  });

  const handleStakeholderChange = (field: string, value: string) => {
    setStakeholder(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleLocationChange = (field: string, value: string) => {
    setLocation(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSpecificationsChange = (field: string, value: string) => {
    setSpecifications(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setHasUnsavedChanges(false);
  };

  const handleOverviewChange = (field: string, value: string) => {
    setOverview(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  // Render project overview section
  const renderOverview = () => (
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
        <FileText className="h-5 w-5 mr-2 text-monaco-bronze" />
        Project Overview
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={overview.name}
            onChange={(e) => handleOverviewChange('name', e.target.value)}
            className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            value={overview.description}
            onChange={(e) => handleOverviewChange('description', e.target.value)}
            className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
            placeholder="Enter project description"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={overview.startDate}
                onChange={(e) => handleOverviewChange('startDate', e.target.value)}
                className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Duration
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={overview.duration}
                onChange={(e) => handleOverviewChange('duration', e.target.value)}
                className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                placeholder="e.g., 6 months"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Project Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {overview.tags.map((tag, index) => (
              <div 
                key={index}
                className="flex items-center bg-monaco-bronze/20 text-monaco-bronze rounded-full px-3 py-1"
              >
                <Tag className="h-3 w-3 mr-1" />
                <span className="text-sm">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const sections = [
    {
      id: 'overview',
      name: 'Project Overview',
      description: 'View comprehensive project information and status',
      icon: FileText,
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    },
    {
      id: 'stakeholder',
      name: 'Stakeholder Information',
      description: 'Manage stakeholder contacts and details',
      icon: Building2,
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    },
    {
      id: 'specifications',
      name: 'Project Specifications',
      description: 'View and manage project technical details',
      icon: Ruler,
      color: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    },
    {
      id: 'location',
      name: 'Project Location',
      description: 'Manage project location and site details',
      icon: MapPin,
      color: 'bg-red-500/10 text-red-500 border-red-500/20'
    }
  ];

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

  // Render project specifications section
  const renderSpecifications = () => (
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
        <Ruler className="h-5 w-5 mr-2 text-monaco-bronze" />
        Project Specifications
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Property Details</label>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Size (M²)</label>
              <input
                type="text"
                value={specifications.size}
                onChange={(e) => handleSpecificationsChange('size', e.target.value)}
                placeholder="Enter property size"
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Duration</label>
              <input
                type="text"
                value={specifications.duration}
                onChange={(e) => handleSpecificationsChange('duration', e.target.value)}
                placeholder="Project duration"
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Access Instructions</label>
              <textarea
                rows={3}
                value={specifications.accessInstructions}
                onChange={(e) => handleSpecificationsChange('accessInstructions', e.target.value)}
                placeholder="Enter access instructions"
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Description of Works</label>
          <textarea
            rows={8}
            value={specifications.descriptionOfWorks}
            onChange={(e) => handleSpecificationsChange('descriptionOfWorks', e.target.value)}
            placeholder="Detailed description of works to be carried out..."
            className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
          />
        </div>
      </div>
    </div>
  );

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
        <MapPin className="h-5 w-5 mr-2 text-monaco-bronze" />
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
              onLocationSelect={(lat, lng) => {
                setLocation(prev => ({
                  ...prev,
                  coordinates: {
                    latitude: lat.toString(),
                    longitude: lng.toString()
                  }
                }));
                setHasUnsavedChanges(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (section === 'stakeholder') {
    return renderStakeholderInfo();
  }

  if (section === 'specifications') {
    return renderSpecifications();
  }

  if (section === 'location') {
    return renderLocation();
  }
  
  if (section === 'overview') {
    return renderOverview();
  }

  // Default grid view when no specific section is selected
  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <FileText className="h-5 w-5 mr-2 text-monaco-bronze" />
            Project Details
          </h2>
          <p className="text-gray-400 mt-1">View and manage project information</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => {
              setActiveSection(section.id);
              onSectionChange(section.id);
            }}
            className={`
              relative p-6 rounded-lg border transition-all duration-200 text-left group col-span-${index <= 1 ? '2' : '1'}
              ${activeSection === section.id
                ? 'border-monaco-bronze bg-monaco-bronze/10'
                : 'border-gray-700 hover:border-gray-600'
              }
            `}
          >
            <div className="flex flex-col space-y-4">
              <div className={`p-3 rounded-lg ${section.color}`}>
                <section.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-white text-lg font-medium">{section.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{section.description}</p>
              </div>
              <div className="flex items-center justify-end mt-4">
                <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-monaco-bronze transition-colors" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Level1;
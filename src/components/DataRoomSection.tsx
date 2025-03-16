import React from 'react';
import DataRoom from './DataRoom';
import Photos from './Photos';

interface DataRoomSectionProps {
  section: string;
}

function DataRoomSection({ section }: DataRoomSectionProps) {
  if (section === 'photos') {
    return <Photos section="photos" />;
  }

  const getSectionConfig = () => {
    switch (section) {
      case 'plans':
        return {
          section: 'plans',
          description: 'Upload architectural drawings, floor plans, and technical diagrams.',
          acceptedFiles: ['.pdf', '.dwg', '.jpg', '.png']
        };
      case 'permits':
        return {
          section: 'permits',
          description: 'Store building permits, applications, and related documentation.',
          acceptedFiles: ['.pdf', '.docx']
        };
      case 'quotes':
        return {
          section: 'quotes',
          description: 'Upload and track project quotes and estimates.',
          acceptedFiles: ['.pdf', '.xlsx']
        };
      case 'contracts':
        return {
          section: 'contracts',
          description: 'Store and manage signed contracts and agreements.',
          acceptedFiles: ['.pdf', '.docx']
        };
      case 'invoices':
        return {
          section: 'invoices',
          description: 'Manage project invoices and financial documents.',
          acceptedFiles: ['.pdf', '.xlsx']
        };
      case 'correspondence':
        return {
          section: 'correspondence',
          description: 'Track project correspondence and communications.',
          acceptedFiles: ['.pdf', '.docx', '.msg', '.eml']
        };
      case 'administrative':
        return {
          section: 'administrative',
          description: 'Manage administrative documents and records.',
          acceptedFiles: ['.pdf', '.docx', '.xlsx']
        };
      default:
        return {
          section: 'general',
          description: 'Upload project documents.',
          acceptedFiles: undefined
        };
    }
  };

  const config = getSectionConfig();

  return <DataRoom {...config} />;
}

export default DataRoomSection;
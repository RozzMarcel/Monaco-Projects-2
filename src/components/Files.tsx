import React, { useState } from 'react';
import { Image, FileText, FileCheck, Receipt, FileSignature, FileSpreadsheet, Mail, FileBox } from 'lucide-react';
import Photos from './Photos';
import DataRoom from './DataRoom';

interface FilesProps {
  project: any;
  section: string;
}

function Files({ project, section }: FilesProps) {
  const sections = [
    { 
      id: 'photos', 
      name: 'Photos', 
      icon: Image, 
      description: 'Project photos and visual documentation',
      color: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    },
    { 
      id: 'plans', 
      name: 'Plans', 
      icon: FileText, 
      description: 'Architectural drawings and technical diagrams',
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    },
    { 
      id: 'permits', 
      name: 'Permits', 
      icon: FileCheck, 
      description: 'Building permits and applications',
      color: 'bg-green-500/10 text-green-500 border-green-500/20'
    },
    { 
      id: 'quotes', 
      name: 'Quotes', 
      icon: Receipt, 
      description: 'Project quotes and estimates',
      color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    },
    { 
      id: 'contracts', 
      name: 'Contracts', 
      icon: FileSignature, 
      description: 'Signed contracts and agreements',
      color: 'bg-red-500/10 text-red-500 border-red-500/20'
    },
    { 
      id: 'invoices', 
      name: 'Invoices', 
      icon: FileSpreadsheet, 
      description: 'Project invoices and financial documents',
      color: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    },
    { 
      id: 'correspondence', 
      name: 'Correspondence', 
      icon: Mail, 
      description: 'Project correspondence and communications',
      color: 'bg-pink-500/10 text-pink-500 border-pink-500/20'
    },
    { 
      id: 'administrative', 
      name: 'Administrative', 
      icon: FileBox, 
      description: 'Administrative documents and records',
      color: 'bg-teal-500/10 text-teal-500 border-teal-500/20'
    }
  ];

  const renderContent = () => {
    if (section === 'photos') {
      return <Photos section="photos" />;
    }
    return <DataRoom section={section} />;
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <FileBox className="h-5 w-5 mr-2 text-monaco-bronze" />
            Project Files
          </h2>
          <p className="text-gray-400 mt-1">Manage and organize project documentation</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {sections.map(item => (
          <button
            key={item.id}
            onClick={() => window.location.href = `#${item.id}`}
            className={`
              relative p-6 rounded-lg border transition-all duration-200 text-left group
              ${section === item.id
                ? 'border-monaco-bronze bg-monaco-bronze/10'
                : 'border-gray-700 hover:border-gray-600'
              }
            `}
          >
            <div className="flex flex-col space-y-4">
              <div className={`p-3 rounded-lg ${item.color} w-fit transition-colors group-hover:bg-opacity-20`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-white text-lg font-medium">{item.name}</h3>
                <p className="text-sm text-gray-400 mt-2">{item.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        {renderContent()}
      </div>
    </div>
  );
}

export default Files;
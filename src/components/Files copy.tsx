import React, { useState } from 'react';
import { Image, FileText, FileCheck, Receipt, FileSignature, FileSpreadsheet, Mail, FileBox } from 'lucide-react';
import Photos from './Photos';
import DataRoom from './DataRoom';

interface FilesProps {
  project: any;
}

function Files({ project }: FilesProps) {
  const [activeSection, setActiveSection] = useState('photos');

  const sections = [
    { 
      id: 'photos', 
      name: 'Photos', 
      icon: Image, 
      description: 'Project photos and visual documentation',
      gradient: 'from-blue-500 to-purple-500'
    },
    { 
      id: 'plans', 
      name: 'Plans', 
      icon: FileText, 
      description: 'Architectural drawings and technical diagrams',
      gradient: 'from-emerald-500 to-teal-500'
    },
    { 
      id: 'permits', 
      name: 'Permits', 
      icon: FileCheck, 
      description: 'Building permits and applications',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      id: 'quotes', 
      name: 'Quotes', 
      icon: Receipt, 
      description: 'Project quotes and estimates',
      gradient: 'from-indigo-500 to-blue-500'
    },
    { 
      id: 'contracts', 
      name: 'Contracts', 
      icon: FileSignature, 
      description: 'Signed contracts and agreements',
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      id: 'invoices', 
      name: 'Invoices', 
      icon: FileSpreadsheet, 
      description: 'Project invoices and financial documents',
      gradient: 'from-amber-500 to-orange-500'
    },
    { 
      id: 'correspondence', 
      name: 'Correspondence', 
      icon: Mail, 
      description: 'Project correspondence and communications',
      gradient: 'from-violet-500 to-purple-500'
    },
    { 
      id: 'administrative', 
      name: 'Administrative', 
      icon: FileBox, 
      description: 'Administrative documents and records',
      gradient: 'from-cyan-500 to-blue-500'
    }
  ];

  const renderContent = () => {
    if (activeSection === 'photos') {
      return <Photos section="photos" />;
    }
    return <DataRoom section={activeSection} />;
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                group relative overflow-hidden rounded-xl transition-all duration-300
                ${activeSection === section.id
                  ? 'ring-2 ring-monaco-bronze shadow-lg scale-[1.02]'
                  : 'hover:shadow-lg hover:scale-[1.02]'
                }
              `}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-10 group-hover:opacity-15 transition-opacity`} />
              
              <div className="relative p-6">
                <div className="flex flex-col items-center text-center">
                  <div className={`
                    p-3 rounded-full mb-3 transition-colors duration-300
                    ${activeSection === section.id 
                      ? 'bg-monaco-bronze text-white'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-monaco-bronze/10 group-hover:text-monaco-bronze'
                    }
                  `}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <span className={`
                    font-medium text-lg transition-colors duration-300
                    ${activeSection === section.id 
                      ? 'text-monaco-bronze'
                      : 'text-gray-900 group-hover:text-monaco-bronze'
                    }
                  `}>
                    {section.name}
                  </span>
                  <span className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {section.description}
                  </span>
                </div>
              </div>

              {/* Bottom Border Accent */}
              <div className={`
                absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${section.gradient}
                transform transition-transform duration-300
                ${activeSection === section.id 
                  ? 'scale-x-100'
                  : 'scale-x-0 group-hover:scale-x-100'
                }
              `} />
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
}

export default Files;
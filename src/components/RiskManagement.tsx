import React, { useState } from 'react';
import { Plus, ClipboardList, GitBranch, History, AlertTriangle, ChevronRight } from 'lucide-react';
import NewRisk from './NewRisk';
import RiskRegister from './RiskRegister';
import RiskHistory from './RiskHistory';

interface RiskManagementProps {
  project: any
}

function RiskManagement({ project }: RiskManagementProps) {
  const [showNewRisk, setShowNewRisk] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('risk-register');
  const [reloadTrigger, setReloadTrigger] = useState(false);

  const sections = [
    {
      id: 'new-risk',
      name: 'New Risk Control Measure',
      description: 'Add new risk control measures to the project',
      icon: Plus,
      color: 'bg-green-500/10 text-green-500 border-green-500/20',
      onClick: () => setShowNewRisk(true)
    },
    {
      id: 'risk-register',
      name: 'Risk Register',
      description: 'View and manage all project risks',
      icon: ClipboardList,
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    },
    {
      id: 'risk-matrix',
      name: 'Risk Matrix',
      description: 'Visualize risk impact and probability',
      icon: GitBranch,
      color: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    },
    {
      id: 'risk-history',
      name: 'Risk History',
      description: 'Track changes and updates to risks',
      icon: History,
      color: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'risk-history':
        return <RiskHistory />;
      case 'risk-matrix':
        const impactLevels = [
          { level: 'Very High', value: 5, description: 'Catastrophic impact on project' },
          { level: 'High', value: 4, description: 'Major impact on project objectives' },
          { level: 'Medium', value: 3, description: 'Moderate impact on project' },
          { level: 'Low', value: 2, description: 'Minor impact on project' },
          { level: 'Very Low', value: 1, description: 'Negligible impact on project' }
        ];

        const probabilityLevels = [
          { level: 'Very High', value: 5, description: 'Almost certain to occur' },
          { level: 'High', value: 4, description: 'Likely to occur' },
          { level: 'Medium', value: 3, description: 'Possible to occur' },
          { level: 'Low', value: 2, description: 'Unlikely to occur' },
          { level: 'Very Low', value: 1, description: 'Rare to occur' }
        ];

        return (
          <div className="space-y-8">
            {/* Risk Matrix Legend */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Impact Levels</h3>
                <div className="space-y-2">
                  {impactLevels.map((level) => (
                    <div key={level.value} className="flex items-center space-x-3">
                      <div className="w-24 text-sm font-medium text-white">{level.level}</div>
                      <div className="text-sm text-gray-400">{level.description}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Probability Levels</h3>
                <div className="space-y-2">
                  {probabilityLevels.map((level) => (
                    <div key={level.value} className="flex items-center space-x-3">
                      <div className="w-24 text-sm font-medium text-white">{level.level}</div>
                      <div className="text-sm text-gray-400">{level.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Matrix */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Risk Matrix</h3>
              <div className="relative">
                {/* Probability Label */}
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-monaco-bronze whitespace-nowrap">
                  Probability
                </div>
                
                {/* Impact Label */}
                <div className="text-center mb-4 text-sm font-medium text-monaco-bronze">
                  Impact
                </div>
                
                {/* Matrix Grid */}
                <div className="grid grid-cols-5 gap-1">
                  {/* Column Headers */}
                  <div className="col-span-5 grid grid-cols-5 gap-1 mb-1">
                    {impactLevels.map((level) => (
                      <div 
                        key={level.value} 
                        className={`text-center text-xs font-medium ${
                          level.value >= 5 ? 'text-red-500' :
                          level.value >= 4 ? 'text-orange-500' :
                          level.value >= 3 ? 'text-yellow-500' :
                          'text-green-500'
                        }`}
                      >
                        {level.level}
                      </div>
                    ))}
                  </div>

                  {/* Matrix Cells */}
                  {Array.from({ length: 25 }).map((_, i) => {
                    const row = 4 - Math.floor(i / 5); // Reversed for correct probability order
                    const col = i % 5;
                    const severity = (row + 1) * (col + 1);
                    
                    const getColor = () => {
                      if (severity >= 15) return 'bg-red-500/30 hover:bg-red-500/40 border border-red-500/50';
                      if (severity >= 8) return 'bg-orange-500/30 hover:bg-orange-500/40 border border-orange-500/50';
                      if (severity >= 4) return 'bg-yellow-500/30 hover:bg-yellow-500/40 border border-yellow-500/50';
                      return 'bg-green-500/30 hover:bg-green-500/40 border border-green-500/50';
                    };

                    const getRiskLevel = () => {
                      if (severity >= 15) return 'High Risk';
                      if (severity >= 8) return 'Medium Risk';
                      if (severity >= 4) return 'Low Risk';
                      return 'Very Low Risk';
                    };

                    return (
                      <div 
                        key={i}
                        className={`
                          p-4 rounded-lg ${getColor()} 
                          flex flex-col items-center justify-center
                          transition-colors cursor-help
                        `}
                        title={`Impact: ${col + 1}, Probability: ${row + 1}
Risk Level: ${getRiskLevel()}
Severity Score: ${severity}`}
                      >
                        <span className="text-white font-bold text-lg">{severity}</span>
                        <span className="text-xs text-white/90 mt-1 font-medium">{getRiskLevel()}</span>
                      </div>
                    );
                  })}

                  {/* Row Labels */}
                  <div className="absolute -left-20 top-8 space-y-[0.85rem]">
                    {probabilityLevels.reverse().map((level) => (
                      <div 
                        key={level.value} 
                        className={`text-xs font-medium ${
                          level.value >= 5 ? 'text-red-500' :
                          level.value >= 4 ? 'text-orange-500' :
                          level.value >= 3 ? 'text-yellow-500' :
                          'text-green-500'
                        }`}
                      >
                        {level.level}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-monaco-bronze" />
            Risk Management
          </h2>
          <p className="text-gray-400 mt-1">Manage and track project risks and control measures</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {sections.map(item => (
          <button
            key={item.id}
            onClick={item.onClick || (() => {
              setActiveSection(item.id);
              if (item.id === 'risk-register') {
                setReloadTrigger(prev => !prev);
              }
            })}
            className={`
              relative p-6 rounded-lg border transition-all duration-200 text-left group
              ${activeSection === item.id
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
              <div className="flex items-center justify-end mt-4">
                <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-monaco-bronze transition-colors" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="mt-8">
        {activeSection === 'risk-register' && <RiskRegister shouldReload={reloadTrigger} />}
        {activeSection === 'risk-history' && <RiskHistory />}
        {activeSection === 'risk-matrix' && renderContent()}
      </div>

      {showNewRisk && (
        <NewRisk
          projectId={project.id}
          onClose={() => setShowNewRisk(false)}
          onSuccess={() => {
            setShowNewRisk(false);
            setActiveSection('risk-register');
          }}
        />
      )}
    </div>
  );
}

export default RiskManagement;
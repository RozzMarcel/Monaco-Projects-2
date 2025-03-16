import React, { useState, useEffect } from 'react';
import { Milestone, ChevronDown } from 'lucide-react';
import { useProjectStore } from '../lib/store';

export const phasesData = [
  {
    id: "1.00",
    name: "PROJECT CONCEPTION",
    baseline: 100,
    completed: 0,
    completion: 0,
    subphases: [
      { id: "1.1", name: "Client Brief", baseline: 20, completed: 0 },
      { id: "1.2", name: "Proposal", baseline: 45, completed: 0 },
      { id: "1.3", name: "Due Diligence", baseline: 5, completed: 0 },
      { id: "1.4", name: "Contracts", baseline: 15, completed: 0 },
      { id: "1.5", name: "Organisational Structure", baseline: 15, completed: 0 }
    ]
  },
  {
    id: "2.00",
    name: "BUILDING PERMITS",
    baseline: 100,
    completed: 0,
    completion: 0,
    subphases: [
      { id: "2.1", name: "Architects contract", baseline: 10, completed: 0 },
      { id: "2.2", name: "Topographic Survey", baseline: 5, completed: 0 },
      { id: "2.3", name: "APS", baseline: 30, completed: 0 },
      { id: "2.4", name: "Syndic authorisation", baseline: 10, completed: 0 },
      { id: "2.5", name: "Submission", baseline: 40, completed: 0 },
      { id: "2.6", name: "Permit issued", baseline: 5, completed: 0 }
    ]
  },
  {
    id: "3.00",
    name: "PRE-CONSTRUCTION",
    baseline: 100,
    completed: 0,
    completion: 0,
    subphases: [
      { id: "3.1", name: "Detailed Design", baseline: 35, completed: 0 },
      { id: "3.2", name: "Project Scope", baseline: 18, completed: 0 },
      { id: "3.3", name: "Project Schedule", baseline: 17, completed: 0 },
      { id: "3.4", name: "RFQ's / Tenders", baseline: 20, completed: 0 },
      { id: "3.5", name: "Tender Appraisal", baseline: 10, completed: 0 }
    ]
  },
  {
    id: "4.00",
    name: "PROCUREMENT",
    baseline: 100,
    completed: 0,
    completion: 0,
    subphases: [
      { id: "4.1", name: "Due Diligence", baseline: 10, completed: 0 },
      { id: "4.2", name: "Award Contracts", baseline: 35, completed: 0 },
      { id: "4.3", name: "Initial Payments", baseline: 5, completed: 0 },
      { id: "4.4", name: "Order Long Lead Items", baseline: 10, completed: 0 },
      { id: "4.5", name: "Detailed Shop Drawings", baseline: 35, completed: 0 },
      { id: "4.6", name: "Pre-Production", baseline: 5, completed: 0 }
    ]
  },
  {
    id: "5.00",
    name: "CONSTRUCTION",
    baseline: 100,
    completed: 0,
    completion: 0,
    subphases: [
      { id: "5.1", name: "Site Set Up", baseline: 3, completed: 0 },
      { id: "5.2", name: "Demolition", baseline: 7, completed: 0 },
      { id: "5.3", name: "Earthworks", baseline: 15, completed: 0 },
      { id: "5.4", name: "Construction", baseline: 27, completed: 0 },
      { id: "5.5", name: "Mechanical, Electrical & Plumbing", baseline: 10, completed: 0 },
      { id: "5.6", name: "Insulation Weather Proofing", baseline: 10, completed: 0 },
      { id: "5.7", name: "Finishes and Closures", baseline: 26, completed: 0 },
      { id: "5.8", name: "FF&E", baseline: 2, completed: 0 }
    ]
  },
  {
    id: "6.00",
    name: "CLOSEOUT",
    baseline: 100,
    completed: 0,
    completion: 0,
    subphases: [
      { id: "6.1", name: "Electrical Certification", baseline: 20, completed: 0 },
      { id: "6.2", name: "H&S Certificates", baseline: 20, completed: 0 },
      { id: "6.3", name: "Contractor Handover", baseline: 30, completed: 0 },
      { id: "6.4", name: "Recollement", baseline: 15, completed: 0 },
      { id: "6.5", name: "Client Handover", baseline: 15, completed: 0 }
    ]
  },
  {
    id: "7.00",
    name: "POST CONSTRUCTION",
    baseline: 100,
    completed: 0,
    completion: 0,
    subphases: [
      { id: "7.1", name: "Reserves Lifted", baseline: 40, completed: 0 },
      { id: "7.2", name: "Accounts Closed Out", baseline: 20, completed: 0 },
      { id: "7.3", name: "Retenue Lifted", baseline: 20, completed: 0 },
      { id: "7.4", name: "Insurances Decinal", baseline: 5, completed: 0 },
      { id: "7.5", name: "Client Post Mortem", baseline: 15, completed: 0 }
    ]
  }
];

function ProgressBar({ progress, height = "h-2.5", showLabel = true }: { progress: number; height?: string; showLabel?: boolean }) {
  const getStatusColor = (value: number) => {
    if (value >= 70) return "bg-green-500";
    if (value >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusTextColor = (value: number) => {
    if (value >= 70) return "text-green-700";
    if (value >= 40) return "text-yellow-700";
    return "text-red-700";
  };

  return (
    <div className="relative w-full">
      <div className={`w-full bg-gray-200 rounded-full ${height}`}>
        <div
          className={`${height} rounded-full ${getStatusColor(progress)} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {showLabel && (
        <div className={`absolute -top-6 right-0 text-sm font-bold ${getStatusTextColor(progress)}`}>
          {Math.round(progress)}% Complete
        </div>
      )}
    </div>
  );
}

function calculateWeightedCompletion(phase: typeof phasesData[0]) {
  const totalWeight = phase.subphases.reduce((sum, subphase) => sum + subphase.baseline, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = phase.subphases.reduce((sum, subphase) => {
    const completedValue = Number(subphase.completed) || 0;
    const baselineValue = Number(subphase.baseline) || 0;
    return sum + ((completedValue * baselineValue) / 100);
  }, 0);

  return (weightedSum / totalWeight) * 100;
}

function Phases() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<string[]>([]);
  const setPhases = useProjectStore(state => state.setPhases);
  
  // Initialize phases with completion calculated
  const [phasesList, setPhasesList] = useState(() => {
    // Reset any saved data to ensure all completion values are 0
    localStorage.removeItem('phasesData');
    return phasesData.map(phase => ({
      ...phase,
      completion: 0
    }));
  });

  // Update project data when phases change
  useEffect(() => {
    const updatedPhases = phasesList.map(phase => ({
      ...phase,
      completion: calculateWeightedCompletion(phase)
    }));
    setPhases(updatedPhases);
  }, [phasesList, setPhases]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('phasesData', JSON.stringify(phasesList));
        setHasUnsavedChanges(false);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [hasUnsavedChanges, phasesList]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => 
      prev.includes(phaseId) 
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const handleCompletedChange = (phaseIndex: number, subphaseIndex: number, value: string) => {
    const newValue = value === '' ? 0 : Math.min(Math.max(Number(value) || 0, 0), 100);
    setPhasesList(prevPhases => {
      const updatedPhases = [...prevPhases];
      updatedPhases[phaseIndex] = {
        ...updatedPhases[phaseIndex],
        subphases: updatedPhases[phaseIndex].subphases.map((subphase, index) =>
          index === subphaseIndex ? { ...subphase, completed: newValue } : subphase
        )
      };
      
      updatedPhases[phaseIndex].completion = calculateWeightedCompletion(updatedPhases[phaseIndex]);
      
      return updatedPhases;
    });
    setHasUnsavedChanges(true);
  };

  const handleBaselineChange = (phaseIndex: number, subphaseIndex: number, value: string) => {
    const newValue = value === '' ? 0 : Math.min(Math.max(Number(value) || 0, 0), 100);
    setPhasesList(prevPhases => {
      const updatedPhases = [...prevPhases];
      updatedPhases[phaseIndex] = {
        ...updatedPhases[phaseIndex],
        subphases: updatedPhases[phaseIndex].subphases.map((subphase, index) =>
          index === subphaseIndex ? { ...subphase, baseline: newValue } : subphase
        )
      };
      
      updatedPhases[phaseIndex].completion = calculateWeightedCompletion(updatedPhases[phaseIndex]);
      
      return updatedPhases;
    });
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-4">
      {/* Save Status Indicator */}
      <div className={`fixed bottom-4 right-4 transition-opacity duration-300 ${hasUnsavedChanges ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-monaco-bronze text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <span className="animate-pulse mr-2">●</span>
          Saving changes...
        </div>
      </div>
      
      {phasesList.map((phase, phaseIndex) => (
        <div key={phase.id} className="bg-white rounded-lg shadow overflow-hidden">
          {/* Phase Header - Always Visible */}
          <button
            onClick={() => togglePhase(phase.id)}
            className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center space-x-4 flex-1">
              <Milestone className="h-5 w-5 text-monaco-bronze" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-navy-600 mb-4">{phase.name}</h2>
                <ProgressBar progress={phase.completion} height="h-3" />
              </div>
            </div>

            <ChevronDown 
              className={`h-6 w-6 text-gray-400 transform transition-transform duration-300 ml-4 ${
                expandedPhases.includes(phase.id) ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Collapsible Content */}
          <div 
            className={`
              transition-all duration-300 ease-in-out overflow-hidden
              ${expandedPhases.includes(phase.id) ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="px-6 pb-6">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subphase</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {phase.subphases.map((subphase, subphaseIndex) => (
                      <tr key={subphase.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subphase.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subphase.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center justify-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="block w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-center"
                              value={subphase.baseline}
                              onChange={(e) => handleBaselineChange(phaseIndex, subphaseIndex, e.target.value)}
                            /><span className="ml-1">%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center justify-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="block w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-center"
                              value={subphase.completed}
                              onChange={(e) => handleCompletedChange(phaseIndex, subphaseIndex, e.target.value)}
                            /><span className="ml-1">%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-32">
                            <ProgressBar progress={subphase.completed} showLabel={false} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Phases;
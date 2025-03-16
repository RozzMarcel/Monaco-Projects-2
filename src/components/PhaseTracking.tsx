import React, { useState, useEffect } from 'react';
import { Milestone, ChevronDown } from 'lucide-react';
import { useProjectStore } from '../lib/store';
import { phasesData } from '../data/phases';
import { calculatePhaseCompletion } from '../utils/project';

function PhaseTracking() {
  const [expandedPhases, setExpandedPhases] = useState<string[]>([]);
  const setPhases = useProjectStore(state => state.setPhases);
  const [phasesList, setPhasesList] = useState(phasesData);

  // Update project store when phases change
  useEffect(() => {
    const updatedPhases = phasesList.map(phase => ({
      ...phase,
      completion: calculatePhaseCompletion(phase)
    }));
    setPhases(updatedPhases);
  }, [phasesList, setPhases]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => 
      prev.includes(phaseId) 
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const handleCompletionChange = (phaseIndex: number, subphaseIndex: number, value: string) => {
    const newValue = value === '' ? 0 : Math.min(Math.max(Number(value) || 0, 0), 100);
    
    setPhasesList(prevPhases => {
      const updatedPhases = [...prevPhases];
      const phase = { ...updatedPhases[phaseIndex] };
      
      // Update subphase completion
      phase.subphases = phase.subphases.map((subphase, index) =>
        index === subphaseIndex ? { ...subphase, completed: newValue } : subphase
      );
      
      // Recalculate phase completion based on weighted subphases
      phase.completion = calculatePhaseCompletion(phase);
      updatedPhases[phaseIndex] = phase;
      
      return updatedPhases;
    });
  };

  // Format number to remove leading zeros
  const formatNumber = (value: number) => {
    return value === 0 ? '' : value.toString();
  };

  // Get progress bar color based on completion percentage
  const getProgressColor = (completion: number) => {
    if (completion >= 100) return 'bg-green-600';
    if (completion > 40) return 'bg-amber-500';
    return 'bg-red-600';
  };

  // Get text color based on completion percentage
  const getTextColor = (completion: number) => {
    if (completion >= 100) return 'text-green-600';
    if (completion > 40) return 'text-amber-500';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {phasesList.map((phase, phaseIndex) => (
        <div key={phase.id} className="bg-gray-800 rounded-lg overflow-hidden">
          {/* Phase Header */}
          <button
            onClick={() => togglePhase(phase.id)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-4 flex-1">
              <Milestone className="h-5 w-5 text-monaco-bronze" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white">{phase.name}</h2>
                  <span className={`${getTextColor(phase.completion)}`}>
                    {phase.completion}% Complete
                  </span>
                </div>
                <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-0 ${getProgressColor(phase.completion)} rounded-full transition-all duration-300`}
                    style={{ width: `${phase.completion}%` }}
                  />
                </div>
              </div>
            </div>

            <ChevronDown 
              className={`h-5 w-5 text-gray-400 transform transition-transform duration-300 ml-4 ${
                expandedPhases.includes(phase.id) ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Subphases */}
          <div 
            className={`
              transition-all duration-300 ease-in-out overflow-hidden
              ${expandedPhases.includes(phase.id) ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="px-6 pb-6">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Subphase</th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-400">Weight</th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-400">Completion</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {phase.subphases.map((subphase, subphaseIndex) => (
                    <tr key={subphase.id}>
                      <td className="px-4 py-3 text-white">{subphase.name}</td>
                      <td className="px-4 py-3 text-center text-gray-400">{subphase.baseline}%</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={formatNumber(subphase.completed)}
                            onChange={(e) => handleCompletionChange(phaseIndex, subphaseIndex, e.target.value)}
                            className="w-20 text-center bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                          />
                          <span className={`ml-1 ${getTextColor(subphase.completed)}`}>%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(subphase.completed)} rounded-full transition-all duration-300`}
                            style={{ width: `${subphase.completed}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PhaseTracking;
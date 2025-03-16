import React from 'react';
import { Phase } from '../types/project';
import { calculatePhaseCompletion } from '../utils/project';
import { Milestone } from 'lucide-react';

interface PhaseProgressProps {
  phases: Phase[];
}

function PhaseProgress({ phases }: PhaseProgressProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Project Phases</h2>
        <Milestone className="h-5 w-5 text-monaco-bronze" />
      </div>

      <div className="space-y-6">
        {phases.map((phase, index) => {
          const completion = calculatePhaseCompletion(phase);
          const getStatusColor = () => {
            if (completion >= 100) return 'bg-green-500';
            if (completion > 0) return 'bg-monaco-bronze';
            return 'bg-gray-600';
          };

          return (
            <div key={phase.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <h3 className="ml-3 text-white font-medium">{phase.name}</h3>
                </div>
                <span className="text-sm text-gray-400">{completion}%</span>
              </div>

              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getStatusColor()} transition-all duration-500`}
                  style={{ width: `${completion}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {phase.subphases.map(subphase => (
                  <div 
                    key={subphase.id} 
                    className="flex items-center text-sm"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      subphase.completed >= 100 ? 'bg-green-500' :
                      subphase.completed > 0 ? 'bg-monaco-bronze' :
                      'bg-gray-600'
                    }`} />
                    <span className="text-gray-400 truncate">{subphase.name}</span>
                    <span className="ml-auto text-gray-500">{subphase.completed}%</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PhaseProgress;
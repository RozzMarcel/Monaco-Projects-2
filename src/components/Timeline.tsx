import React from 'react';
import { Phase } from '../types/project';
import { calculatePhaseCompletion } from '../utils/project';

interface TimelineProps {
  phases: Phase[];
}

function Timeline({ phases }: TimelineProps) {
  return (
    <div className="space-y-4">
      {phases.map((phase, index) => {
        const completion = calculatePhaseCompletion(phase);
        const getStatusColor = () => {
          if (completion >= 100) return 'bg-green-500';
          if (completion > 0) return 'bg-blue-500';
          return 'bg-gray-600';
        };

        return (
          <div key={phase.id} className="relative">
            {/* Phase Line */}
            <div className="absolute left-2.5 top-10 h-full w-0.5 bg-gray-700" 
              style={{ display: index === phases.length - 1 ? 'none' : 'block' }} 
            />
            
            {/* Phase Content */}
            <div className="flex items-start">
              {/* Phase Indicator */}
              <div className={`relative flex items-center justify-center w-6 h-6 rounded-full ${getStatusColor()} shrink-0`}>
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>

              {/* Phase Details */}
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">{phase.name}</h3>
                  <span className="text-sm text-gray-400">{completion}% Complete</span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getStatusColor()}`}
                    style={{ width: `${completion}%` }}
                  />
                </div>

                {/* Subphases */}
                <div className="mt-2 space-y-1">
                  {phase.subphases.map(subphase => (
                    <div key={subphase.id} className="flex items-center text-sm">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        subphase.completed >= 100 ? 'bg-green-500' :
                        subphase.completed > 0 ? 'bg-blue-500' :
                        'bg-gray-600'
                      }`} />
                      <span className="text-gray-400">{subphase.name}</span>
                      <span className="ml-auto text-gray-500">{subphase.completed}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Timeline;
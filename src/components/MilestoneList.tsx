import React from 'react';
import { Phase } from '../types/project';
import { Milestone, CheckCircle, Circle } from 'lucide-react';
import { calculatePhaseCompletion } from '../utils/project';

interface MilestoneListProps {
  phases: Phase[];
}

function MilestoneList({ phases }: MilestoneListProps) {
  const getUpcomingMilestones = () => {
    return phases
      .flatMap(phase => phase.subphases.map(subphase => ({
        name: subphase.name,
        phase: phase.name,
        completion: subphase.completed
      })))
      .filter(milestone => milestone.completion < 100)
      .slice(0, 5);
  };

  const upcomingMilestones = getUpcomingMilestones();

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Upcoming Milestones</h3>
        <Milestone className="h-5 w-5 text-monaco-bronze" />
      </div>

      <div className="space-y-4">
        {upcomingMilestones.map((milestone, index) => (
          <div key={index} className="flex items-start">
            {milestone.completion > 0 ? (
              <div className="text-yellow-500">
                <Circle className="h-5 w-5" />
              </div>
            ) : (
              <div className="text-gray-500">
                <Circle className="h-5 w-5" />
              </div>
            )}
            <div className="ml-3">
              <p className="text-white font-medium">{milestone.name}</p>
              <p className="text-sm text-gray-400">{milestone.phase}</p>
            </div>
            <div className="ml-auto text-sm text-gray-400">
              {milestone.completion}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MilestoneList;
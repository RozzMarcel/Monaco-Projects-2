import React from 'react';
import { Milestone, CheckCircle, Circle } from 'lucide-react';
import { Phase } from '../types/project';
import { calculatePhaseCompletion } from '../utils/project';

interface MilestoneOverviewProps {
  phases: Phase[];
}

function MilestoneOverview({ phases }: MilestoneOverviewProps) {
  const getUpcomingMilestones = () => {
    return phases
      .flatMap(phase => phase.subphases.map(subphase => ({
        name: subphase.name,
        phase: phase.name,
        completion: subphase.completed
      })))
      .filter(milestone => milestone.completion < 100)
      .sort((a, b) => a.completion - b.completion)
      .slice(0, 5);
  };

  const getCompletedMilestones = () => {
    return phases
      .flatMap(phase => phase.subphases.map(subphase => ({
        name: subphase.name,
        phase: phase.name,
        completion: subphase.completed
      })))
      .filter(milestone => milestone.completion === 100)
      .slice(-5);
  };

  const upcomingMilestones = getUpcomingMilestones();
  const completedMilestones = getCompletedMilestones();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Upcoming Milestones */}
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Upcoming Milestones</h3>
          <Milestone className="h-5 w-5 text-monaco-bronze" />
        </div>
        <div className="space-y-4">
          {upcomingMilestones.map((milestone, index) => (
            <div key={index} className="flex items-start">
              <div className="text-gray-500">
                <Circle className="h-5 w-5" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-white font-medium">{milestone.name}</p>
                <p className="text-sm text-gray-400">{milestone.phase}</p>
              </div>
              <div className="ml-4 text-sm text-gray-400">
                {milestone.completion}%
              </div>
            </div>
          ))}
          {upcomingMilestones.length === 0 && (
            <p className="text-gray-400 text-center">No upcoming milestones</p>
          )}
        </div>
      </div>

      {/* Completed Milestones */}
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Completed Milestones</h3>
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
        <div className="space-y-4">
          {completedMilestones.map((milestone, index) => (
            <div key={index} className="flex items-start">
              <div className="text-green-500">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">{milestone.name}</p>
                <p className="text-sm text-gray-400">{milestone.phase}</p>
              </div>
            </div>
          ))}
          {completedMilestones.length === 0 && (
            <p className="text-gray-400 text-center">No completed milestones yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MilestoneOverview;
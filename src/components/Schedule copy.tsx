import React, { useState, useEffect } from 'react';
import { Milestone } from 'lucide-react';

interface Milestone {
  name: string;
  dueDate: string;
  completedDate: string;
  diff: string;
}

function Schedule() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([
    { name: "Demolition completed", dueDate: "", completedDate: "", diff: "" },
    { name: "Groundworks completed", dueDate: "", completedDate: "", diff: "" },
    { name: "Foundations Completed", dueDate: "", completedDate: "", diff: "" },
    { name: "Infrastructure Completed", dueDate: "", completedDate: "", diff: "" },
    { name: "Superstructure completed", dueDate: "", completedDate: "", diff: "" },
    { name: "Shell and Core Watertight", dueDate: "", completedDate: "", diff: "" },
    { name: "Internal Partitions", dueDate: "", completedDate: "", diff: "" },
    { name: "HVAC", dueDate: "", completedDate: "", diff: "" },
    { name: "Electricity First Fix", dueDate: "", completedDate: "", diff: "" },
    { name: "Electricity Second Fix", dueDate: "", completedDate: "", diff: "" },
    { name: "Plumbing pipework", dueDate: "", completedDate: "", diff: "" },
    { name: "Internal Fit out", dueDate: "", completedDate: "", diff: "" },
    { name: "FF&E", dueDate: "", completedDate: "", diff: "" }
  ]);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('projectMilestones');
    if (savedData) {
      setMilestones(JSON.parse(savedData));
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('projectMilestones', JSON.stringify(milestones));
        setHasUnsavedChanges(false);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [hasUnsavedChanges, milestones]);

  const calculateWorkingDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    let days = 0;
    const current = new Date(start);
    
    while (current <= end) {
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        days++;
      }
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const handleMilestoneChange = (index: number, field: 'dueDate' | 'completedDate', value: string) => {
    setMilestones(prev => {
      const newMilestones = [...prev];
      const milestone = { ...newMilestones[index] };
      milestone[field] = value;

      if (milestone.dueDate && milestone.completedDate) {
        const workingDays = calculateWorkingDays(milestone.dueDate, milestone.completedDate);
        const dueDate = new Date(milestone.dueDate);
        const completedDate = new Date(milestone.completedDate);
        
        if (dueDate.getTime() === completedDate.getTime()) {
          milestone.diff = 'On time';
        } else {
          const isLate = completedDate > dueDate;
          milestone.diff = `${isLate ? '+' : '-'}${workingDays} working days`;
        }
      } else {
        milestone.diff = '';
      }

      newMilestones[index] = milestone;
      return newMilestones;
    });
    setHasUnsavedChanges(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Save Status Indicator */}
      <div className={`fixed bottom-4 right-4 transition-opacity duration-300 ${hasUnsavedChanges ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-monaco-bronze text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <span className="animate-pulse mr-2">●</span>
          Saving changes...
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 flex items-center">
        <Milestone className="h-5 w-5 mr-2 text-monaco-bronze" />
        PROJECT MILESTONES
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Milestone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Days Difference</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {milestones.map((milestone, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{milestone.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="date"
                    value={milestone.dueDate}
                    onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="date"
                    value={milestone.completedDate}
                    onChange={(e) => handleMilestoneChange(index, 'completedDate', e.target.value)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
                  />
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  milestone.diff.includes('+') ? 'text-red-600' :
                  milestone.diff === 'On time' ? 'text-green-600' :
                  milestone.diff.includes('-') ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {milestone.diff}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Schedule;
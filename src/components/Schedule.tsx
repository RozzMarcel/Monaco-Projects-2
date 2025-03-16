import React, { useState, useEffect } from 'react';
import { CalendarClock } from 'lucide-react';

interface Milestone {
  lot: string;
  description: string;
  dueDate: string;
  actualDate: string;
}

function Schedule() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([
    { lot: "Lot 01", description: "Demolition/Ground works", dueDate: "", actualDate: "" },
    { lot: "Lot 02", description: "Foundations / Support", dueDate: "", actualDate: "" },
    { lot: "Lot 03", description: "Major Building Works", dueDate: "", actualDate: "" },
    { lot: "Lot 04", description: "Facades", dueDate: "", actualDate: "" },
    { lot: "Lot 05", description: "Walls and Partitions", dueDate: "", actualDate: "" },
    { lot: "Lot 06", description: "External Joinery/ Closures", dueDate: "", actualDate: "" },
    { lot: "Lot 07", description: "LockSmith", dueDate: "", actualDate: "" },
    { lot: "Lot 08", description: "Flooring and wall coverings", dueDate: "", actualDate: "" },
    { lot: "Lot 09", description: "False Ceilings", dueDate: "", actualDate: "" },
    { lot: "Lot 10", description: "Painting", dueDate: "", actualDate: "" },
    { lot: "Lot 11", description: "Plumbing HVAC", dueDate: "", actualDate: "" },
    { lot: "Lot 12", description: "Lifts", dueDate: "", actualDate: "" },
    { lot: "Lot 13", description: "Electricity H/L Voltage", dueDate: "", actualDate: "" },
    { lot: "Lot 14", description: "Street and Mains Connections", dueDate: "", actualDate: "" },
    { lot: "Lot 15", description: "Internal Joinery", dueDate: "", actualDate: "" },
    { lot: "Lot 16", description: "Kitchens", dueDate: "", actualDate: "" },
    { lot: "Lot 17", description: "Other 1", dueDate: "", actualDate: "" },
    { lot: "Lot 18", description: "Other 2", dueDate: "", actualDate: "" },
    { lot: "Lot 19", description: "Other 3", dueDate: "", actualDate: "" },
    { lot: "Lot 20", description: "Other 4", dueDate: "", actualDate: "" },
    { lot: "Lot 21", description: "Other 5", dueDate: "", actualDate: "" },
    { lot: "Lot 22", description: "Other 6", dueDate: "", actualDate: "" },
    { lot: "Lot 23", description: "Other 7", dueDate: "", actualDate: "" },
    { lot: "Lot 24", description: "Other 8", dueDate: "", actualDate: "" },
    { lot: "Lot 25", description: "Other 9", dueDate: "", actualDate: "" },
    { lot: "Lot 26", description: "Other 10", dueDate: "", actualDate: "" }
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

  const handleDateChange = (index: number, field: 'dueDate' | 'actualDate', value: string) => {
    setMilestones(prev => prev.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    ));
    setHasUnsavedChanges(true);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    setMilestones(prev => prev.map((milestone, i) => 
      i === index ? { ...milestone, description: value } : milestone
    ));
    setHasUnsavedChanges(true);
  };

  const isDescriptionEditable = (lot: string) => {
    return lot.startsWith('Lot') && parseInt(lot.split(' ')[1]) >= 17;
  };

  return (
    <div className="space-y-6">
      {/* Save Status Indicator */}
      <div className={`fixed bottom-4 right-4 transition-opacity duration-300 ${hasUnsavedChanges ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-monaco-bronze text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <span className="animate-pulse mr-2">●</span>
          Saving changes...
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 flex items-center text-white">
        <CalendarClock className="h-5 w-5 mr-2 text-monaco-bronze" />
        Project Milestones
      </h2>

      <div className="bg-gray-800 rounded-lg p-6">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Lot</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actual Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {milestones.map((milestone, index) => (
              <tr key={milestone.lot}>
                <td className="px-6 py-4 text-white">{milestone.lot}</td>
                <td className="px-6 py-4">
                  {isDescriptionEditable(milestone.lot) ? (
                    <input
                      type="text"
                      value={milestone.description}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      className="w-full bg-gray-700 border-gray-600 rounded text-white px-3 py-1"
                    />
                  ) : (
                    <span className="text-white">{milestone.description}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <input
                    type="date"
                    value={milestone.dueDate}
                    onChange={(e) => handleDateChange(index, 'dueDate', e.target.value)}
                    className="bg-gray-700 border-gray-600 rounded text-white px-3 py-1"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="date"
                    value={milestone.actualDate}
                    onChange={(e) => handleDateChange(index, 'actualDate', e.target.value)}
                    className="bg-gray-700 border-gray-600 rounded text-white px-3 py-1"
                  />
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
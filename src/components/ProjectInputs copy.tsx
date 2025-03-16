import React from 'react';
import { WalletCards, Milestone, ClipboardList, CalendarClock } from 'lucide-react';
import Budget from './Budget';
import Phases from './Phases';
import Actual from './Actual';
import Schedule from './Schedule';

interface ProjectInputsProps {
  project: any;
  section: string;
}

function ProjectInputs({ project, section }: ProjectInputsProps) {
  const tabs = [
    { id: 'phases', name: 'Phases', icon: Milestone },
    { id: 'budget', name: 'Budget', icon: WalletCards },
    { id: 'actual', name: 'Actual', icon: ClipboardList },
    { id: 'schedule', name: 'Project Schedule', icon: CalendarClock }
  ];

  const renderContent = () => {
    switch (section) {
      case 'phases':
        return <Phases />;
      case 'budget':
        return <Budget />;
      case 'actual':
        return <Actual />;
      case 'schedule':
        return <Schedule />;
      default:
        return null;
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
}

export default ProjectInputs;
import React from 'react';
import Risks from './Risks';

interface RiskManagementProps {
  project: any;
}

function RiskManagement({ project }: RiskManagementProps) {
  return <Risks />;
}

export default RiskManagement;
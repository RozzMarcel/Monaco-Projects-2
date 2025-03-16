import { Phase } from '../types/project';

export const phasesData: Phase[] = [
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
      { id: "1.3", name: "Contracts", baseline: 15, completed: 0 },
      { id: "1.4", name: "Organisational Structure", baseline: 15, completed: 0 }
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
      { id: "5.5", name: "Mechanical, Electrical & Plumb", baseline: 10, completed: 0 },
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
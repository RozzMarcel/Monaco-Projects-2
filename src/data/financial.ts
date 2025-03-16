import { BudgetItem, ActualItem } from '../types/financial';

export const professionalBudget: BudgetItem[] = [
  { ref: 'P1', description: 'Project Manager', amount: 0 },
  { ref: 'P2', description: 'Architect', amount: 0 },
  { ref: 'P3', description: 'Designer', amount: 0 },
  { ref: 'P4', description: 'Syndic', amount: 0 },
  { ref: 'P5', description: 'Structural Engineer', amount: 0 },
  { ref: 'P6', description: 'Technical Engineers', amount: 0 },
  { ref: 'P7', description: 'Geotechnical', amount: 0 },
  { ref: 'P8', description: 'Topo', amount: 0 },
  { ref: 'P9', description: 'Bureau of Control', amount: 0 },
  { ref: 'P10', description: 'BIM', amount: 0 },
  { ref: 'P11', description: 'Synthesis', amount: 0 },
  { ref: 'P12', description: 'Huisseur', amount: 0 },
  { ref: 'P13', description: 'Other 1', amount: 0 },
  { ref: 'P14', description: 'Other 2', amount: 0 },
  { ref: 'P15', description: 'Other 3', amount: 0 },
  { ref: 'P16', description: 'Other 4', amount: 0 },
  { ref: 'P17', description: 'Other 5', amount: 0 }
];

export const contractorBudget: BudgetItem[] = [
  { ref: 'Lot 01', description: 'Demolition/Ground works', amount: 0 },
  { ref: 'Lot 02', description: 'Foundations / Support', amount: 0 },
  { ref: 'Lot 03', description: 'Major Building Works', amount: 0 },
  { ref: 'Lot 04', description: 'Facades', amount: 0 },
  { ref: 'Lot 05', description: 'Walls and Partitions', amount: 0 },
  { ref: 'Lot 06', description: 'External Joinery/ Closures', amount: 0 },
  { ref: 'Lot 07', description: 'LockSmith', amount: 0 },
  { ref: 'Lot 08', description: 'Flooring and wall coverings', amount: 0 },
  { ref: 'Lot 09', description: 'False Ceilings', amount: 0 },
  { ref: 'Lot 10', description: 'Painting', amount: 0 },
  { ref: 'Lot 11', description: 'Plumbing HVAC', amount: 0 },
  { ref: 'Lot 12', description: 'Lifts', amount: 0 },
  { ref: 'Lot 13', description: 'Electricity H/L Voltage', amount: 0 },
  { ref: 'Lot 14', description: 'Street and Mains Connections', amount: 0 },
  { ref: 'Lot 15', description: 'Internal Joinery', amount: 0 },
  { ref: 'Lot 16', description: 'Kitchens', amount: 0 },
  { ref: 'Lot 17', description: 'Other 1', amount: 0 },
  { ref: 'Lot 18', description: 'Other 2', amount: 0 },
  { ref: 'Lot 19', description: 'Other 3', amount: 0 },
  { ref: 'Lot 20', description: 'Other 4', amount: 0 },
  { ref: 'Lot 21', description: 'Other 5', amount: 0 },
  { ref: 'Lot 22', description: 'Other 6', amount: 0 },
  { ref: 'Lot 23', description: 'Other 7', amount: 0 },
  { ref: 'Lot 24', description: 'Other 8', amount: 0 },
  { ref: 'Lot 25', description: 'Other 9', amount: 0 },
  { ref: 'Lot 26', description: 'Other 10', amount: 0 }
];

export const professionalActual: ActualItem[] = professionalBudget.map(item => ({
  ref: item.ref,
  description: item.description,
  company: '',
  invoiceDate: '',
  invoiceNo: '',
  invoiceAmount: 0,
  paidDate: '',
  paidRef: '',
  paidAmount: 0
}));

export const contractorActual: ActualItem[] = contractorBudget.map(item => ({
  ref: item.ref,
  description: item.description,
  company: '',
  invoiceDate: '',
  invoiceNo: '',
  invoiceAmount: 0,
  paidDate: '',
  paidRef: '',
  paidAmount: 0
}));
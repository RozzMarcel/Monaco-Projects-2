import React, { useState, useEffect } from 'react';
import { Receipt, Building2 } from 'lucide-react';
import { professionalBudget, contractorBudget } from '../data/financial';
import { BudgetItem } from '../types/financial';
import { useProjectStore } from '../lib/store';

function Budget() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [professionalItems, setProfessionalItems] = useState<BudgetItem[]>(professionalBudget);
  const [contractorItems, setContractorItems] = useState<BudgetItem[]>(contractorBudget);
  const setFinancialSummary = useProjectStore(state => state.setFinancialSummary);
  
  // Load saved data on component mount
  useEffect(() => {
    const savedProfessional = localStorage.getItem('professionalBudget');
    const savedContractor = localStorage.getItem('contractorBudget');
    if (savedProfessional) setProfessionalItems(JSON.parse(savedProfessional));
    if (savedContractor) setContractorItems(JSON.parse(savedContractor));
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('professionalBudget', JSON.stringify(professionalItems));
        localStorage.setItem('contractorBudget', JSON.stringify(contractorItems));
        setHasUnsavedChanges(false);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [hasUnsavedChanges, professionalItems, contractorItems]);

  // Update financial summary whenever values change
  useEffect(() => {
    const summary = {
      budgeted: {
        opex: professionalItems.reduce((sum, item) => sum + (item.amount || 0), 0),
        capex: contractorItems.reduce((sum, item) => sum + (item.amount || 0), 0),
        total: 0
      },
      actual: {
        opex: 0,
        capex: 0,
        total: 0
      },
      variance: {
        opex: 0,
        capex: 0,
        total: 0
      }
    };

    summary.budgeted.total = summary.budgeted.opex + summary.budgeted.capex;
    summary.variance.opex = summary.actual.opex - summary.budgeted.opex;
    summary.variance.capex = summary.actual.capex - summary.budgeted.capex;
    summary.variance.total = summary.actual.total - summary.budgeted.total;

    setFinancialSummary(summary);
  }, [professionalItems, contractorItems, setFinancialSummary]);

  const handleAmountChange = (type: 'professional' | 'contractor', index: number, value: string) => {
    const numValue = value === '' ? 0 : Math.round(parseFloat(value));
    
    if (type === 'professional') {
      setProfessionalItems(items => items.map((item, i) => 
        i === index ? { ...item, amount: numValue } : item
      ));
    } else {
      setContractorItems(items => items.map((item, i) => 
        i === index ? { ...item, amount: numValue } : item
      ));
    }
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-8">
      {/* Save Status Indicator */}
      <div className={`fixed bottom-4 right-4 transition-opacity duration-300 ${hasUnsavedChanges ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-monaco-bronze text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <span className="animate-pulse mr-2">●</span>
          Saving changes...
        </div>
      </div>

      {/* Professional OPEX Budget Section */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center text-white">
          <Receipt className="h-5 w-5 mr-2 text-monaco-bronze" />
          Professional OPEX Budget
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ref</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {professionalItems.map((item, index) => (
                <tr key={item.ref}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.ref}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center justify-end">
                      <span className="text-gray-400 mr-2">€</span>
                      <input
                        type="number"
                        value={item.amount || ''}
                        onChange={(e) => handleAmountChange('professional', index, e.target.value)}
                        className="w-32 bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white text-right"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-900 font-bold">
                <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">Total:</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                  €{professionalItems.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Contractor CAPEX Budget Section */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center text-white">
          <Building2 className="h-5 w-5 mr-2 text-monaco-bronze" />
          Contractor CAPEX Budget
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ref</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {contractorItems.map((item, index) => (
                <tr key={item.ref}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.ref}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center justify-end">
                      <span className="text-gray-400 mr-2">€</span>
                      <input
                        type="number"
                        value={item.amount || ''}
                        onChange={(e) => handleAmountChange('contractor', index, e.target.value)}
                        className="w-32 bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white text-right"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-900 font-bold">
                <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">Total:</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                  €{contractorItems.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Budget;
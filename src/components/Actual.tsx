import React, { useState, useEffect } from 'react';
import { Receipt, Building2 } from 'lucide-react';
import { professionalActual, contractorActual } from '../data/financial';
import { ActualItem } from '../types/financial';
import { useProjectStore } from '../lib/store';

function Actual() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [professionalItems, setProfessionalItems] = useState<ActualItem[]>(professionalActual);
  const [contractorItems, setContractorItems] = useState<ActualItem[]>(contractorActual);
  const setFinancialSummary = useProjectStore(state => state.setFinancialSummary);
  
  // Load saved data on component mount
  useEffect(() => {
    const savedProfessional = localStorage.getItem('professionalActual');
    const savedContractor = localStorage.getItem('contractorActual');
    if (savedProfessional) setProfessionalItems(JSON.parse(savedProfessional));
    if (savedContractor) setContractorItems(JSON.parse(savedContractor));
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('professionalActual', JSON.stringify(professionalItems));
        localStorage.setItem('contractorActual', JSON.stringify(contractorItems));
        setHasUnsavedChanges(false);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [hasUnsavedChanges, professionalItems, contractorItems]);

  // Update financial summary whenever values change
  useEffect(() => {
    const summary = {
      budgeted: {
        opex: professionalItems.reduce((sum, item) => sum + item.invoiceAmount, 0),
        capex: contractorItems.reduce((sum, item) => sum + item.invoiceAmount, 0),
        total: 0
      },
      actual: {
        opex: professionalItems.reduce((sum, item) => sum + item.paidAmount, 0),
        capex: contractorItems.reduce((sum, item) => sum + item.paidAmount, 0),
        total: 0
      },
      variance: {
        opex: 0,
        capex: 0,
        total: 0
      }
    };

    summary.budgeted.total = summary.budgeted.opex + summary.budgeted.capex;
    summary.actual.total = summary.actual.opex + summary.actual.capex;
    summary.variance.opex = summary.actual.opex - summary.budgeted.opex;
    summary.variance.capex = summary.actual.capex - summary.budgeted.capex;
    summary.variance.total = summary.actual.total - summary.budgeted.total;

    setFinancialSummary(summary);
  }, [professionalItems, contractorItems, setFinancialSummary]);

  const handleInputChange = (type: 'professional' | 'contractor', ref: string, field: string, value: any) => {
    const setValue = (items: ActualItem[], setItems: React.Dispatch<React.SetStateAction<ActualItem[]>>) => {
      setItems(items.map(item =>
        item.ref === ref ? { ...item, [field]: value } : item
      ));
    };

    if (type === 'professional') {
      setValue(professionalItems, setProfessionalItems);
    } else {
      setValue(contractorItems, setContractorItems);
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
      
      {/* Professional OPEX Actual Section */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center text-white">
          <Receipt className="h-5 w-5 mr-2 text-monaco-bronze" />
          Professional OPEX Actual
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ref</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Invoice Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Invoice №</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Invoice Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Paid Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Paid Ref</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Paid Amount</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {professionalItems.map((item) => (
                <tr key={item.ref}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.ref}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <input
                      type="text"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                      value={item.company}
                      onChange={(e) => handleInputChange('professional', item.ref, 'company', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <input
                      type="date"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                      value={item.invoiceDate}
                      onChange={(e) => handleInputChange('professional', item.ref, 'invoiceDate', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <input
                      type="text"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                      value={item.invoiceNo}
                      onChange={(e) => handleInputChange('professional', item.ref, 'invoiceNo', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                    <input
                      type="number"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white text-right"
                      value={item.invoiceAmount}
                      onChange={(e) => handleInputChange('professional', item.ref, 'invoiceAmount', parseFloat(e.target.value))}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <input
                      type="date"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                      value={item.paidDate}
                      onChange={(e) => handleInputChange('professional', item.ref, 'paidDate', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <input
                      type="text"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                      value={item.paidRef}
                      onChange={(e) => handleInputChange('professional', item.ref, 'paidRef', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                    <input
                      type="number"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white text-right"
                      value={item.paidAmount}
                      onChange={(e) => handleInputChange('professional', item.ref, 'paidAmount', parseFloat(e.target.value))}
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-900 font-bold">
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">Total:</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                  €{professionalItems.reduce((sum, item) => sum + item.invoiceAmount, 0).toLocaleString()}
                </td>
                <td colSpan={2}></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                  €{professionalItems.reduce((sum, item) => sum + item.paidAmount, 0).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Contractor CAPEX Actual Section */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center text-white">
          <Building2 className="h-5 w-5 mr-2 text-monaco-bronze" />
          Contractor CAPEX Actual
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ref</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Invoice Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Invoice №</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Invoice Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Paid Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Paid Ref</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Paid Amount</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {contractorItems.map((item) => (
                <tr key={item.ref}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.ref}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <input
                      type="text"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                      value={item.company}
                      onChange={(e) => handleInputChange('contractor', item.ref, 'company', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <input
                      type="date"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                      value={item.invoiceDate}
                      onChange={(e) => handleInputChange('contractor', item.ref, 'invoiceDate', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <input
                      type="text"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                      value={item.invoiceNo}
                      onChange={(e) => handleInputChange('contractor', item.ref, 'invoiceNo', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                    <input
                      type="number"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white text-right"
                      value={item.invoiceAmount}
                      onChange={(e) => handleInputChange('contractor', item.ref, 'invoiceAmount', parseFloat(e.target.value))}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <input
                      type="date"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                      value={item.paidDate}
                      onChange={(e) => handleInputChange('contractor', item.ref, 'paidDate', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <input
                      type="text"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                      value={item.paidRef}
                      onChange={(e) => handleInputChange('contractor', item.ref, 'paidRef', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                    <input
                      type="number"
                      className="w-full bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white text-right"
                      value={item.paidAmount}
                      onChange={(e) => handleInputChange('contractor', item.ref, 'paidAmount', parseFloat(e.target.value))}
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-900 font-bold">
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">Total:</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                  €{contractorItems.reduce((sum, item) => sum + item.invoiceAmount, 0).toLocaleString()}
                </td>
                <td colSpan={2}></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-white">
                  €{contractorItems.reduce((sum, item) => sum + item.paidAmount, 0).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Actual;
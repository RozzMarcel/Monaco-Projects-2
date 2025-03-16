import React from 'react';
import { FinancialSummary } from '../types/financial';
import { formatCurrency } from '../utils/format';

interface BudgetChartProps {
  budgeted: FinancialSummary['budgeted'];
  actual: FinancialSummary['actual'];
}

function BudgetChart({ budgeted, actual }: BudgetChartProps) {
  const categories = [
    { name: 'OPEX', budgeted: budgeted.opex, actual: actual.opex },
    { name: 'CAPEX', budgeted: budgeted.capex, actual: actual.capex },
    { name: 'Total', budgeted: budgeted.total, actual: actual.total }
  ];

  const maxValue = Math.max(
    budgeted.total,
    actual.total
  );

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const budgetWidth = (category.budgeted / maxValue) * 100;
        const actualWidth = (category.actual / maxValue) * 100;
        const isOverBudget = category.actual > category.budgeted;

        return (
          <div key={category.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white font-medium">{category.name}</span>
              <span className="text-gray-400">
                {formatCurrency(category.actual)} / {formatCurrency(category.budgeted)}
              </span>
            </div>
            
            <div className="relative h-4">
              {/* Budget Bar */}
              <div className="absolute inset-0 bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-monaco-bronze rounded-full opacity-50"
                  style={{ width: `${budgetWidth}%` }}
                />
              </div>
              
              {/* Actual Bar */}
              <div 
                className={`absolute inset-0 h-2 mt-1 rounded-full transition-all duration-500 ${
                  isOverBudget ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${actualWidth}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BudgetChart;
import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface VarianceIndicatorProps {
  actual: number;
  budget: number;
  showAmount?: boolean;
  threshold?: number; // Percentage threshold for warning (default 10%)
}

export const VarianceIndicator: React.FC<VarianceIndicatorProps> = ({ 
  actual, 
  budget, 
  showAmount = false,
  threshold = 10 
}) => {
  if (!budget) return null;

  const variance = ((actual - budget) / budget) * 100;
  const absVariance = Math.abs(variance);
  const varianceAmount = Math.round(actual - budget);

  if (showAmount) {
    return (
      <span className={`${varianceAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
        €{Math.abs(varianceAmount).toLocaleString()}
      </span>
    );
  }

  if (absVariance < 0.1) {
    return (
      <div className="flex items-center text-gray-500">
        <Minus className="h-4 w-4 mr-1" />
        <span>On Budget</span>
      </div>
    );
  }

  if (variance > 0) {
    return (
      <div className={`flex items-center ${absVariance > threshold ? 'text-red-500' : 'text-orange-500'}`}>
        <TrendingUp className="h-4 w-4 mr-1" />
        <span>+{Math.round(absVariance)}%</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${absVariance > threshold ? 'text-green-500' : 'text-blue-500'}`}>
      <TrendingDown className="h-4 w-4 mr-1" />
      <span>-{Math.round(absVariance)}%</span>
    </div>
  );
};
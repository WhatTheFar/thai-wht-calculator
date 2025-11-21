import React from 'react';
import { formatCurrency } from '../services/calculator';

interface ResultRowProps {
  label: string;
  value: string;
  isHighlight?: boolean;
  isDeduction?: boolean;
  isAddition?: boolean;
}

export const ResultRow: React.FC<ResultRowProps> = ({ 
  label, 
  value, 
  isHighlight = false, 
  isDeduction = false,
  isAddition = false
}) => {
  return (
    <div className={`flex justify-between items-center py-3 border-b border-gray-100 last:border-0 ${isHighlight ? 'bg-blue-50 -mx-4 px-4 rounded-lg mt-2' : ''}`}>
      <span className={`text-gray-600 ${isHighlight ? 'text-blue-800 font-bold' : 'font-medium'}`}>
        {label}
      </span>
      <div className="flex flex-col items-end">
        <span className={`text-lg font-mono tabular-nums tracking-tight ${
          isHighlight ? 'text-blue-700 font-bold text-2xl' : 
          isDeduction ? 'text-red-500' : 
          isAddition ? 'text-gray-800' : 'text-gray-900'
        }`}>
          {isDeduction ? '-' : ''}{formatCurrency(value)}
        </span>
      </div>
    </div>
  );
};
import React from 'react';
import { PieChart, TrendingUp, Shield, Zap } from 'lucide-react';
import { AssetAllocation as AssetAllocationType } from '../types';
import { calculateAssetAllocation } from '../utils/calculations';

interface Props {
  horizonYears: number;
  riskProfile: string;
}

const AssetAllocation: React.FC<Props> = ({ horizonYears, riskProfile }) => {
  const allocation = calculateAssetAllocation(horizonYears, riskProfile);

  const getRiskIcon = () => {
    switch (riskProfile) {
      case 'conservative': return <Shield className="w-5 h-5 text-green-600" />;
      case 'aggressive': return <Zap className="w-5 h-5 text-red-600" />;
      default: return <TrendingUp className="w-5 h-5 text-blue-600" />;
    }
  };

  const getRiskColor = () => {
    switch (riskProfile) {
      case 'conservative': return 'text-green-600';
      case 'aggressive': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 p-2 rounded-lg">
          <PieChart className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Recommended Asset Allocation</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {getRiskIcon()}
            <span className={`font-semibold capitalize ${getRiskColor()}`}>
              {riskProfile} Risk Profile
            </span>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Equity</span>
                <span className="text-blue-600 font-semibold">{allocation.equity}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${allocation.equity}%` }}
                ></div>
              </div>
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Debt</span>
                <span className="text-green-600 font-semibold">{allocation.debt}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${allocation.debt}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Expected Return</span>
              <span className="text-purple-600 font-bold text-lg">
                {(allocation.expectedReturn * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Annual return based on historical averages
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Equity Allocation ({allocation.equity}%)</h4>
            <p className="text-sm text-gray-600 mb-2">Higher growth potential, higher volatility</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Large Cap Funds: 40-50%</li>
              <li>• Mid Cap Funds: 20-30%</li>
              <li>• Small Cap Funds: 10-20%</li>
              <li>• International Funds: 10-15%</li>
            </ul>
          </div>

          <div className="p-4 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Debt Allocation ({allocation.debt}%)</h4>
            <p className="text-sm text-gray-600 mb-2">Stable returns, lower risk</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Corporate Bond Funds: 40-50%</li>
              <li>• Government Securities: 30-40%</li>
              <li>• Liquid Funds: 10-20%</li>
            </ul>
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Allocation automatically adjusts based on your investment horizon and risk profile for optimal returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocation;
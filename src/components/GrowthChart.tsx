import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { SIPProjection } from '../types';
import { formatCurrency } from '../utils/calculations';

interface Props {
  projections: SIPProjection[];
}

const GrowthChart: React.FC<Props> = ({ projections }) => {
  if (!projections.length) return null;

  const maxValue = Math.max(...projections.map(p => p.projectedValue));
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-100 p-2 rounded-lg">
          <BarChart3 className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Growth Projection</h2>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Investment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Returns</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span className="text-sm text-gray-600">Total Value</span>
          </div>
        </div>

        <div className="relative h-64 flex items-end justify-between gap-1 bg-gray-50 p-4 rounded-lg">
          {projections.map((projection, index) => {
            const investmentHeight = (projection.cumulativeInvestment / maxValue) * 100;
            const returnsHeight = (projection.returns / maxValue) * 100;
            const totalHeight = (projection.projectedValue / maxValue) * 100;
            
            return (
              <div
                key={projection.year}
                className="flex-1 flex flex-col items-center group cursor-pointer"
              >
                <div className="relative w-full max-w-12 flex flex-col-reverse">
                  <div
                    className="bg-blue-500 transition-all duration-300 group-hover:bg-blue-600"
                    style={{ height: `${investmentHeight * 2}px` }}
                  ></div>
                  <div
                    className="bg-green-500 transition-all duration-300 group-hover:bg-green-600"
                    style={{ height: `${returnsHeight * 2}px` }}
                  ></div>
                </div>
                
                <div className="mt-2 text-xs text-gray-600 text-center">
                  Y{projection.year}
                </div>
                
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 absolute bg-gray-800 text-white p-2 rounded text-xs mt-8 z-10 transition-all duration-200 pointer-events-none">
                  <div>Year {projection.year}</div>
                  <div>Investment: {formatCurrency(projection.cumulativeInvestment)}</div>
                  <div>Returns: {formatCurrency(projection.returns)}</div>
                  <div>Total: {formatCurrency(projection.projectedValue)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {projections.filter((_, index) => index % Math.ceil(projections.length / 4) === 0).map((projection) => (
          <div key={projection.year} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800">Year {projection.year}</div>
            <div className="text-sm text-gray-600">{formatCurrency(projection.projectedValue)}</div>
            <div className="text-xs text-green-600">
              +{formatCurrency(projection.returns)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrowthChart;
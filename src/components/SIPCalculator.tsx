import React, { useState } from 'react';
import { Calculator, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { SIPInput, SIPProjection, FeasibilityAnalysis } from '../types';
import { calculateSIPProjections, calculateFeasibilityAnalysis, formatCurrency } from '../utils/calculations';

interface Props {
  onCalculate: (input: SIPInput, projections: SIPProjection[], analysis: FeasibilityAnalysis) => void;
}

const SIPCalculator: React.FC<Props> = ({ onCalculate }) => {
  const [input, setInput] = useState<SIPInput>({
    monthlyAmount: 5000,
    investmentHorizon: 10,
    targetAmount: 1000000,
    riskProfile: 'moderate'
  });

  const [projections, setProjections] = useState<SIPProjection[]>([]);
  const [analysis, setAnalysis] = useState<FeasibilityAnalysis | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleInputChange = (field: keyof SIPInput, value: number | string) => {
    setInput(prev => ({
      ...prev,
      [field]: value
    }));
    // Reset calculations when input changes
    if (hasCalculated) {
      setHasCalculated(false);
      setProjections([]);
      setAnalysis(null);
    }
  };

  const handleCalculate = () => {
    const newProjections = calculateSIPProjections(input);
    const newAnalysis = calculateFeasibilityAnalysis(input);
    setProjections(newProjections);
    setAnalysis(newAnalysis);
    setHasCalculated(true);
    onCalculate(input, newProjections, newAnalysis);
  };

  const finalValue = projections[projections.length - 1]?.projectedValue || 0;
  const totalInvestment = input.monthlyAmount * input.investmentHorizon * 12;
  const totalReturns = finalValue - totalInvestment;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Calculator className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">SIP Calculator</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly SIP Amount (₹)
            </label>
            <input
              type="number"
              value={input.monthlyAmount}
              onChange={(e) => handleInputChange('monthlyAmount', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter monthly SIP amount"
              min="500"
              step="500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Horizon (Years)
            </label>
            <input
              type="number"
              value={input.investmentHorizon}
              onChange={(e) => handleInputChange('investmentHorizon', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter investment horizon"
              min="1"
              max="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Amount (₹)
            </label>
            <input
              type="number"
              value={input.targetAmount}
              onChange={(e) => handleInputChange('targetAmount', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter target amount"
              min="10000"
              step="10000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risk Profile
            </label>
            <select
              value={input.riskProfile}
              onChange={(e) => handleInputChange('riskProfile', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="conservative">Conservative (Lower Risk, Stable Returns)</option>
              <option value="moderate">Moderate (Balanced Risk & Returns)</option>
              <option value="aggressive">Aggressive (Higher Risk, Higher Returns)</option>
            </select>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calculate SIP Projections
          </button>
        </div>

        <div className="space-y-4">
          {!hasCalculated ? (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg text-center">
              <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready to Calculate</h3>
              <p className="text-gray-500 text-sm">
                Enter your investment details and click "Calculate SIP Projections" to see realistic projections based on historical market returns.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Projected Results
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Investment:</span>
                    <span className="font-semibold text-lg">{formatCurrency(totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Projected Value:</span>
                    <span className="font-bold text-green-600 text-xl">{formatCurrency(finalValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Returns:</span>
                    <span className="font-semibold text-blue-600 text-lg">{formatCurrency(totalReturns)}</span>
                  </div>
                  <div className="pt-2 border-t border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Return Multiple:</span>
                      <span className="font-semibold text-purple-600">
                        {(finalValue / totalInvestment).toFixed(1)}x
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {analysis && (
                <div className={`p-4 rounded-lg border-2 ${
                  analysis.isAchievable 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {analysis.isAchievable ? (
                      <Target className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    )}
                    <h4 className="font-semibold text-gray-800">Goal Feasibility Analysis</h4>
                  </div>
                  
                  {analysis.isAchievable ? (
                    <div className="text-green-700">
                      <p className="font-medium mb-2">✅ Your target is achievable!</p>
                      <p className="text-sm">
                        Your projected value of {formatCurrency(finalValue)} exceeds your target of {formatCurrency(input.targetAmount)}.
                      </p>
                    </div>
                  ) : (
                    <div className="text-yellow-700 space-y-2">
                      <p className="font-medium">⚠️ Target may be challenging to achieve</p>
                      <div className="text-sm space-y-1">
                        <p><strong>Shortfall:</strong> {formatCurrency(analysis.shortfall)}</p>
                        <p><strong>Recommended SIP:</strong> ₹{analysis.recommendedSIP.toLocaleString()}/month</p>
                        <p><strong>Or consider:</strong> Extending investment horizon or adjusting target</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
                    <div className="grid grid-cols-2 gap-2">
                      <div>Required Return: {(analysis.requiredReturn * 100).toFixed(1)}%</div>
                      <div>Expected Return: {(analysis.expectedReturn * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Next Steps</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Check the "Asset Allocation" tab for investment mix</li>
                  <li>• View "Growth Chart" for year-wise projections</li>
                  <li>• Save this plan in "My Plans" for tracking</li>
                  <li>• Set up reminders for your SIP dates</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SIPCalculator;
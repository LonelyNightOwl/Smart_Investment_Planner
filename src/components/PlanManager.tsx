import React, { useState, useEffect } from 'react';
import { Save, Trash2, Plus, Calendar, Target, TrendingUp } from 'lucide-react';
import { SIPPlan, SIPInput, SIPProjection, FeasibilityAnalysis } from '../types';
import { formatCurrency } from '../utils/calculations';

interface Props {
  currentInput: SIPInput;
  currentProjections: SIPProjection[];
  currentAnalysis: FeasibilityAnalysis;
  onLoadPlan: (plan: SIPPlan) => void;
}

const PlanManager: React.FC<Props> = ({ 
  currentInput, 
  currentProjections, 
  currentAnalysis, 
  onLoadPlan 
}) => {
  const [savedPlans, setSavedPlans] = useState<SIPPlan[]>([]);
  const [planName, setPlanName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sipPlans');
    if (saved) {
      setSavedPlans(JSON.parse(saved).map((plan: any) => ({
        ...plan,
        createdAt: new Date(plan.createdAt),
        lastUpdated: new Date(plan.lastUpdated)
      })));
    }
  }, []);

  const savePlan = () => {
    if (!planName.trim()) return;

    const newPlan: SIPPlan = {
      id: Date.now().toString(),
      name: planName,
      input: currentInput,
      projections: currentProjections,
      assetAllocation: {
        equity: 70,
        debt: 30,
        expectedReturn: 0.1
      },
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    const updatedPlans = [...savedPlans, newPlan];
    setSavedPlans(updatedPlans);
    localStorage.setItem('sipPlans', JSON.stringify(updatedPlans));
    setPlanName('');
    setShowSaveDialog(false);
  };

  const deletePlan = (id: string) => {
    const updatedPlans = savedPlans.filter(plan => plan.id !== id);
    setSavedPlans(updatedPlans);
    localStorage.setItem('sipPlans', JSON.stringify(updatedPlans));
  };

  const loadPlan = (plan: SIPPlan) => {
    onLoadPlan(plan);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Save className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">My Plans</h2>
        </div>
        <button
          onClick={() => setShowSaveDialog(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Save Current Plan
        </button>
      </div>

      {showSaveDialog && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Enter plan name (e.g., Retirement Fund, Child Education)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={savePlan}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {savedPlans.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No saved plans yet. Create your first SIP plan and save it!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {savedPlans.map((plan) => {
            const finalProjection = plan.projections[plan.projections.length - 1];
            return (
              <div key={plan.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{plan.name}</h3>
                    <p className="text-sm text-gray-500">
                      Created: {plan.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadPlan(plan)}
                      className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Load Plan"
                    >
                      <TrendingUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePlan(plan.id)}
                      className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Monthly SIP:</span>
                    <div className="font-semibold">₹{plan.input.monthlyAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <div className="font-semibold">{plan.input.investmentHorizon} years</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Target:</span>
                    <div className="font-semibold">{formatCurrency(plan.input.targetAmount)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Projected:</span>
                    <div className="font-semibold text-green-600">
                      {formatCurrency(finalProjection?.projectedValue || 0)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                  Risk Profile: {plan.input.riskProfile} | 
                  Total Investment: {formatCurrency(plan.input.monthlyAmount * plan.input.investmentHorizon * 12)} |
                  Returns: {formatCurrency((finalProjection?.projectedValue || 0) - (plan.input.monthlyAmount * plan.input.investmentHorizon * 12))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlanManager;
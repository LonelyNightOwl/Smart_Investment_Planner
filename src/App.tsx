import React, { useState } from 'react';
import { Calculator, PieChart, TrendingUp, BookOpen, Save, Bell, Activity } from 'lucide-react';
import SIPCalculator from './components/SIPCalculator';
import AssetAllocation from './components/AssetAllocation';
import GrowthChart from './components/GrowthChart';
import KnowledgeHub from './components/KnowledgeHub';
import PlanManager from './components/PlanManager';
import ReminderSettings from './components/ReminderSettings';
import MarketDashboard from './components/MarketDashboard';
import { SIPInput, SIPProjection, FeasibilityAnalysis, SIPPlan } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [currentInput, setCurrentInput] = useState<SIPInput>({
    monthlyAmount: 5000,
    investmentHorizon: 10,
    targetAmount: 1000000,
    riskProfile: 'moderate'
  });
  const [currentProjections, setCurrentProjections] = useState<SIPProjection[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<FeasibilityAnalysis | null>(null);

  const handleCalculate = (input: SIPInput, projections: SIPProjection[], analysis: FeasibilityAnalysis) => {
    setCurrentInput(input);
    setCurrentProjections(projections);
    setCurrentAnalysis(analysis);
  };

  const handleLoadPlan = (plan: SIPPlan) => {
    setCurrentInput(plan.input);
    setCurrentProjections(plan.projections);
    // Recalculate analysis would happen in SIPCalculator component
    setActiveTab('calculator');
  };

  const tabs = [
    { id: 'calculator', label: 'SIP Calculator', icon: <Calculator className="w-5 h-5" /> },
    { id: 'market', label: 'Live Market', icon: <Activity className="w-5 h-5" /> },
    { id: 'allocation', label: 'Asset Allocation', icon: <PieChart className="w-5 h-5" /> },
    { id: 'projections', label: 'Growth Chart', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'knowledge', label: 'Knowledge Hub', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'plans', label: 'My Plans', icon: <Save className="w-5 h-5" /> },
    { id: 'reminders', label: 'Reminders', icon: <Bell className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart SIP Planner</h1>
              <p className="text-gray-600">Plan your investments with realistic projections & live market data</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 py-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'calculator' && (
          <SIPCalculator onCalculate={handleCalculate} />
        )}

        {activeTab === 'market' && <MarketDashboard />}

        {activeTab === 'allocation' && (
          <AssetAllocation 
            horizonYears={currentInput.investmentHorizon} 
            riskProfile={currentInput.riskProfile} 
          />
        )}

        {activeTab === 'projections' && (
          <GrowthChart projections={currentProjections} />
        )}

        {activeTab === 'knowledge' && <KnowledgeHub />}

        {activeTab === 'plans' && currentAnalysis && (
          <PlanManager
            currentInput={currentInput}
            currentProjections={currentProjections}
            currentAnalysis={currentAnalysis}
            onLoadPlan={handleLoadPlan}
          />
        )}

        {activeTab === 'reminders' && <ReminderSettings />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Smart SIP Planner</h3>
              <p className="text-gray-400 text-sm">
                Make informed investment decisions with realistic projections, live market data, and expert guidance.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Live market data & stock tracking</li>
                <li>• Realistic return projections</li>
                <li>• Goal feasibility analysis</li>
                <li>• Smart asset allocation</li>
                <li>• Investment recommendations</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Disclaimer</h3>
              <p className="text-gray-400 text-xs">
                Market data is for informational purposes only. Projections are based on historical averages and market assumptions. 
                Actual returns may vary. Please consult a financial advisor for personalized advice.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
            © 2025 Smart SIP Planner. Built for informed investing with real-time market insights.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
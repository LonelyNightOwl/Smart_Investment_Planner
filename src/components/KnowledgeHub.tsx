import React, { useState } from 'react';
import { BookOpen, TrendingUp, DollarSign, AlertTriangle, Calculator, Target } from 'lucide-react';

const KnowledgeHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basics');

  const knowledgeContent = {
    basics: {
      title: 'SIP Basics',
      icon: <BookOpen className="w-5 h-5" />,
      content: [
        {
          title: 'What is SIP?',
          content: 'Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly in mutual funds. It helps in rupee cost averaging and building wealth over time.'
        },
        {
          title: 'Benefits of SIP',
          content: 'SIP offers disciplined investing, rupee cost averaging, power of compounding, and flexibility to start with small amounts. It reduces market timing risk.'
        },
        {
          title: 'How SIP Works',
          content: 'You invest a fixed amount monthly. When markets are high, you buy fewer units. When markets are low, you buy more units, averaging your cost.'
        }
      ]
    },
    returns: {
      title: 'Expected Returns',
      icon: <TrendingUp className="w-5 h-5" />,
      content: [
        {
          title: 'Equity Funds (~12% annually)',
          content: 'Historically, equity mutual funds have delivered 10-15% returns over long term (15+ years). However, short-term volatility is high.'
        },
        {
          title: 'Debt Funds (~6% annually)',
          content: 'Debt funds typically provide 6-8% returns with lower volatility. They are suitable for conservative investors and short-term goals.'
        },
        {
          title: 'Balanced Funds (~9% annually)',
          content: 'Hybrid funds balance equity and debt, offering moderate returns with balanced risk. Good for moderate risk investors.'
        }
      ]
    },
    taxes: {
      title: 'Taxation',
      icon: <DollarSign className="w-5 h-5" />,
      content: [
        {
          title: 'Equity Fund Taxation',
          content: 'Long-term gains (>1 year): 10% tax above ₹1 lakh. Short-term gains: 15% tax. No tax on dividends received.'
        },
        {
          title: 'Debt Fund Taxation',
          content: 'Long-term gains (>3 years): 20% with indexation. Short-term gains: As per income tax slab. Dividends are taxable.'
        },
        {
          title: 'Tax Saving (ELSS)',
          content: 'ELSS funds offer tax deduction up to ₹1.5 lakh under 80C with 3-year lock-in period and potential for high returns.'
        }
      ]
    },
    risks: {
      title: 'Risk Management',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: [
        {
          title: 'Market Risk',
          content: 'Equity investments are subject to market volatility. Diversification and long-term investment help mitigate this risk.'
        },
        {
          title: 'Inflation Risk',
          content: 'Ensure your investments beat inflation (typically 5-6% annually) to maintain purchasing power over time.'
        },
        {
          title: 'Liquidity Risk',
          content: 'Some funds may have exit loads or lock-in periods. Plan your investments considering your liquidity needs.'
        }
      ]
    }
  };

  const tabs = Object.entries(knowledgeContent);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <BookOpen className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Knowledge Hub</h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b">
        {tabs.map(([key, tab]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
              activeTab === key
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-600 border-transparent hover:text-indigo-500'
            }`}
          >
            {tab.icon}
            {tab.title}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {knowledgeContent[activeTab as keyof typeof knowledgeContent].content.map((item, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-indigo-600" />
          <h4 className="font-semibold text-indigo-800">Pro Tips</h4>
        </div>
        <ul className="text-sm text-indigo-700 space-y-1">
          <li>• Start early to maximize compounding benefits</li>
          <li>• Increase SIP amount by 10-15% annually</li>
          <li>• Review and rebalance portfolio annually</li>
          <li>• Don't stop SIP during market downturns</li>
          <li>• Consider step-up SIP for salary increases</li>
        </ul>
      </div>
    </div>
  );
};

export default KnowledgeHub;
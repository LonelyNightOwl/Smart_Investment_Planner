import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Star, RefreshCw, DollarSign } from 'lucide-react';
import { MarketData, MutualFund, StockRecommendation } from '../types';
import { marketDataService } from '../services/marketDataService';

const MarketDashboard: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [mutualFunds, setMutualFunds] = useState<MutualFund[]>([]);
  const [recommendations, setRecommendations] = useState<StockRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stocks' | 'funds' | 'recommendations'>('stocks');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadMarketData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const [stocks, funds, recs] = await Promise.all([
        marketDataService.getMarketData(),
        marketDataService.getMutualFunds(),
        marketDataService.getStockRecommendations()
      ]);
      
      setMarketData(stocks);
      setMutualFunds(funds);
      setRecommendations(recs);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeBg = (change: number) => {
    return change >= 0 ? 'bg-green-100' : 'bg-red-100';
  };

  const topGainers = marketData.sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  const topLosers = marketData.sort((a, b) => a.changePercent - b.changePercent).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Live Market Data</h2>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          onClick={loadMarketData}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Top Gainers
          </h3>
          <div className="space-y-2">
            {topGainers.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{stock.symbol}</div>
                  <div className="text-xs text-gray-600">{formatCurrency(stock.price)}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-semibold text-sm">
                    {formatPercent(stock.changePercent)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            Top Losers
          </h3>
          <div className="space-y-2">
            {topLosers.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{stock.symbol}</div>
                  <div className="text-xs text-gray-600">{formatCurrency(stock.price)}</div>
                </div>
                <div className="text-right">
                  <div className="text-red-600 font-semibold text-sm">
                    {formatPercent(stock.changePercent)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'stocks', label: 'Live Stocks', icon: <Activity className="w-4 h-4" /> },
              { id: 'funds', label: 'Mutual Funds', icon: <DollarSign className="w-4 h-4" /> },
              { id: 'recommendations', label: 'Recommendations', icon: <Star className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading market data...</span>
            </div>
          ) : (
            <>
              {activeTab === 'stocks' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Stock</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-700">Price</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-700">Change</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-700">% Change</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-700">Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketData.map((stock) => (
                        <tr key={stock.symbol} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <div>
                              <div className="font-medium">{stock.symbol}</div>
                              <div className="text-sm text-gray-500">{stock.sector}</div>
                            </div>
                          </td>
                          <td className="text-right py-3 px-2 font-medium">
                            {formatCurrency(stock.price)}
                          </td>
                          <td className={`text-right py-3 px-2 font-medium ${getChangeColor(stock.change)}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                          </td>
                          <td className="text-right py-3 px-2">
                            <span className={`px-2 py-1 rounded text-sm font-medium ${getChangeBg(stock.changePercent)} ${getChangeColor(stock.changePercent)}`}>
                              {formatPercent(stock.changePercent)}
                            </span>
                          </td>
                          <td className="text-right py-3 px-2 text-sm text-gray-600">
                            {(stock.volume / 1000000).toFixed(1)}M
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'funds' && (
                <div className="grid gap-4">
                  {mutualFunds.map((fund) => (
                    <div key={fund.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">{fund.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">{fund.category}</span>
                            <span className="flex items-center">
                              {Array.from({ length: fund.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{fund.nav.toFixed(2)}</div>
                          <div className={`text-sm ${getChangeColor(fund.changePercent)}`}>
                            {formatPercent(fund.changePercent)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">1Y Return:</span>
                          <div className="font-semibold text-green-600">{fund.returns['1y'].toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-500">3Y Return:</span>
                          <div className="font-semibold text-green-600">{fund.returns['3y'].toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Min SIP:</span>
                          <div className="font-semibold">₹{fund.minSip}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Expense:</span>
                          <div className="font-semibold">{fund.expenseRatio.toFixed(2)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div key={rec.symbol} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">{rec.name}</h4>
                          <div className="text-sm text-gray-600">{rec.symbol}</div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            rec.recommendation === 'BUY' ? 'bg-green-100 text-green-800' :
                            rec.recommendation === 'SELL' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {rec.recommendation}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-500">Current Price:</span>
                          <div className="font-semibold">{formatCurrency(rec.currentPrice)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Target Price:</span>
                          <div className="font-semibold">{formatCurrency(rec.targetPrice)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Upside:</span>
                          <div className="font-semibold text-green-600">{rec.upside.toFixed(1)}%</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="font-medium text-gray-800 mb-1">Analysis:</h5>
                        <p className="text-sm text-gray-600">{rec.reasoning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketDashboard;
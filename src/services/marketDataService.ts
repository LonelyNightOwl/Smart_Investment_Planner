import axios from 'axios';
import { MarketData, MutualFund, StockRecommendation } from '../types';

// Mock API service - In production, you'd use real APIs like Alpha Vantage, Yahoo Finance, etc.
class MarketDataService {
  private baseURL = 'https://api.example.com'; // Replace with real API
  private mockData = true; // Set to false when using real API

  // Generate mock market data for demonstration
  private generateMockMarketData(): MarketData[] {
    const stocks = [
      { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking' },
      { symbol: 'INFY', name: 'Infosys Ltd', sector: 'IT' },
      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', sector: 'FMCG' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Banking' },
      { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking' },
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecom' },
      { symbol: 'ITC', name: 'ITC Ltd', sector: 'FMCG' },
      { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking' }
    ];

    return stocks.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      price: Math.random() * 3000 + 100,
      change: (Math.random() - 0.5) * 100,
      changePercent: (Math.random() - 0.5) * 10,
      volume: Math.random() * 10000000,
      marketCap: Math.random() * 500000,
      pe: Math.random() * 50 + 5,
      sector: stock.sector,
      lastUpdated: new Date()
    }));
  }

  private generateMockMutualFunds(): MutualFund[] {
    const funds = [
      { name: 'SBI Bluechip Fund', category: 'Large Cap', riskLevel: 'medium' as const },
      { name: 'HDFC Top 100 Fund', category: 'Large Cap', riskLevel: 'medium' as const },
      { name: 'Axis Midcap Fund', category: 'Mid Cap', riskLevel: 'high' as const },
      { name: 'ICICI Prudential Balanced Advantage', category: 'Hybrid', riskLevel: 'medium' as const },
      { name: 'Mirae Asset Large Cap Fund', category: 'Large Cap', riskLevel: 'medium' as const },
      { name: 'Parag Parikh Flexi Cap Fund', category: 'Flexi Cap', riskLevel: 'high' as const },
      { name: 'UTI Nifty Index Fund', category: 'Index', riskLevel: 'low' as const },
      { name: 'DSP Tax Saver Fund', category: 'ELSS', riskLevel: 'high' as const }
    ];

    return funds.map((fund, index) => ({
      id: `fund_${index}`,
      name: fund.name,
      category: fund.category,
      nav: Math.random() * 100 + 20,
      change: (Math.random() - 0.5) * 5,
      changePercent: (Math.random() - 0.5) * 3,
      aum: Math.random() * 50000 + 1000,
      expenseRatio: Math.random() * 2 + 0.5,
      returns: {
        '1y': Math.random() * 30 + 5,
        '3y': Math.random() * 25 + 8,
        '5y': Math.random() * 20 + 10
      },
      riskLevel: fund.riskLevel,
      rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
      minSip: Math.random() * 4500 + 500
    }));
  }

  private generateStockRecommendations(): StockRecommendation[] {
    const recommendations = [
      {
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        recommendation: 'BUY' as const,
        reasoning: 'Strong Q3 results, expanding digital transformation deals, robust margin outlook'
      },
      {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Ltd',
        recommendation: 'BUY' as const,
        reasoning: 'Market leader in retail banking, strong asset quality, digital banking growth'
      },
      {
        symbol: 'RELIANCE',
        name: 'Reliance Industries',
        recommendation: 'HOLD' as const,
        reasoning: 'Diversified business model, but oil volatility and high debt concerns'
      },
      {
        symbol: 'INFY',
        name: 'Infosys Ltd',
        recommendation: 'BUY' as const,
        reasoning: 'Consistent growth in digital services, strong client addition, margin expansion'
      }
    ];

    return recommendations.map(rec => ({
      ...rec,
      currentPrice: Math.random() * 3000 + 500,
      targetPrice: Math.random() * 3500 + 600,
      upside: Math.random() * 30 + 5,
      riskLevel: 'medium' as const
    }));
  }

  async getMarketData(): Promise<MarketData[]> {
    if (this.mockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.generateMockMarketData();
    }

    try {
      const response = await axios.get(`${this.baseURL}/market-data`);
      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      return this.generateMockMarketData();
    }
  }

  async getMutualFunds(): Promise<MutualFund[]> {
    if (this.mockData) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return this.generateMockMutualFunds();
    }

    try {
      const response = await axios.get(`${this.baseURL}/mutual-funds`);
      return response.data;
    } catch (error) {
      console.error('Error fetching mutual funds:', error);
      return this.generateMockMutualFunds();
    }
  }

  async getStockRecommendations(): Promise<StockRecommendation[]> {
    if (this.mockData) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return this.generateStockRecommendations();
    }

    try {
      const response = await axios.get(`${this.baseURL}/recommendations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return this.generateStockRecommendations();
    }
  }

  async getTopPerformers(period: '1d' | '1w' | '1m' = '1d'): Promise<MarketData[]> {
    const marketData = await this.getMarketData();
    return marketData
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5);
  }

  async getTopLosers(period: '1d' | '1w' | '1m' = '1d'): Promise<MarketData[]> {
    const marketData = await this.getMarketData();
    return marketData
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5);
  }
}

export const marketDataService = new MarketDataService();
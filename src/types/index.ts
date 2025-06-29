export interface SIPInput {
  monthlyAmount: number;
  investmentHorizon: number; // in years
  targetAmount: number;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
}

export interface SIPProjection {
  year: number;
  monthlyInvestment: number;
  cumulativeInvestment: number;
  projectedValue: number;
  returns: number;
}

export interface AssetAllocation {
  equity: number;
  debt: number;
  expectedReturn: number;
}

export interface SIPPlan {
  id: string;
  name: string;
  input: SIPInput;
  projections: SIPProjection[];
  assetAllocation: AssetAllocation;
  createdAt: Date;
  lastUpdated: Date;
}

export interface FeasibilityAnalysis {
  isAchievable: boolean;
  requiredReturn: number;
  expectedReturn: number;
  shortfall: number;
  recommendedSIP: number;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  sector: string;
  lastUpdated: Date;
}

export interface MutualFund {
  id: string;
  name: string;
  category: string;
  nav: number;
  change: number;
  changePercent: number;
  aum: number;
  expenseRatio: number;
  returns: {
    '1y': number;
    '3y': number;
    '5y': number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  rating: number;
  minSip: number;
}

export interface StockRecommendation {
  symbol: string;
  name: string;
  recommendation: 'BUY' | 'HOLD' | 'SELL';
  targetPrice: number;
  currentPrice: number;
  upside: number;
  reasoning: string;
  riskLevel: 'low' | 'medium' | 'high';
}
import { SIPInput, SIPProjection, AssetAllocation, FeasibilityAnalysis } from '../types';

// Historical average returns
const EQUITY_RETURN = 0.12; // 12%
const DEBT_RETURN = 0.06;   // 6%
const INFLATION_RATE = 0.06; // 6%

export const calculateAssetAllocation = (horizonYears: number, riskProfile: string): AssetAllocation => {
  let equityPercent: number;
  
  // Base allocation on horizon and risk profile
  if (horizonYears <= 3) {
    equityPercent = riskProfile === 'conservative' ? 20 : riskProfile === 'moderate' ? 40 : 60;
  } else if (horizonYears <= 7) {
    equityPercent = riskProfile === 'conservative' ? 40 : riskProfile === 'moderate' ? 60 : 80;
  } else {
    equityPercent = riskProfile === 'conservative' ? 60 : riskProfile === 'moderate' ? 80 : 90;
  }

  const debtPercent = 100 - equityPercent;
  const expectedReturn = (equityPercent / 100) * EQUITY_RETURN + (debtPercent / 100) * DEBT_RETURN;

  return {
    equity: equityPercent,
    debt: debtPercent,
    expectedReturn: expectedReturn
  };
};

export const calculateSIPProjections = (input: SIPInput): SIPProjection[] => {
  const assetAllocation = calculateAssetAllocation(input.investmentHorizon, input.riskProfile);
  const monthlyReturn = assetAllocation.expectedReturn / 12;
  const projections: SIPProjection[] = [];

  let cumulativeInvestment = 0;
  let currentValue = 0;

  for (let year = 1; year <= input.investmentHorizon; year++) {
    const monthsInYear = year === input.investmentHorizon ? 
      (input.investmentHorizon * 12) % 12 || 12 : 12;
    
    for (let month = 1; month <= monthsInYear; month++) {
      cumulativeInvestment += input.monthlyAmount;
      currentValue = (currentValue + input.monthlyAmount) * (1 + monthlyReturn);
    }

    projections.push({
      year,
      monthlyInvestment: input.monthlyAmount,
      cumulativeInvestment,
      projectedValue: Math.round(currentValue),
      returns: Math.round(currentValue - cumulativeInvestment)
    });
  }

  return projections;
};

export const calculateFeasibilityAnalysis = (input: SIPInput): FeasibilityAnalysis => {
  const assetAllocation = calculateAssetAllocation(input.investmentHorizon, input.riskProfile);
  const totalMonths = input.investmentHorizon * 12;
  const totalInvestment = input.monthlyAmount * totalMonths;
  
  // Calculate required return to achieve target
  const requiredMultiplier = input.targetAmount / totalInvestment;
  const requiredMonthlyReturn = Math.pow(requiredMultiplier, 1 / totalMonths) - 1;
  const requiredAnnualReturn = Math.pow(1 + requiredMonthlyReturn, 12) - 1;

  // Calculate what SIP amount would be needed with expected returns
  const expectedMonthlyReturn = assetAllocation.expectedReturn / 12;
  const futureValueFactor = (Math.pow(1 + expectedMonthlyReturn, totalMonths) - 1) / expectedMonthlyReturn;
  const recommendedSIP = Math.ceil(input.targetAmount / futureValueFactor);

  const projections = calculateSIPProjections(input);
  const finalProjectedValue = projections[projections.length - 1]?.projectedValue || 0;
  const shortfall = Math.max(0, input.targetAmount - finalProjectedValue);

  return {
    isAchievable: requiredAnnualReturn <= assetAllocation.expectedReturn * 1.1, // 10% buffer
    requiredReturn: requiredAnnualReturn,
    expectedReturn: assetAllocation.expectedReturn,
    shortfall,
    recommendedSIP
  };
};

export const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)} K`;
  }
  return `₹${amount.toLocaleString()}`;
};

export const calculateInflationAdjustedReturns = (nominalReturn: number): number => {
  return ((1 + nominalReturn) / (1 + INFLATION_RATE)) - 1;
};
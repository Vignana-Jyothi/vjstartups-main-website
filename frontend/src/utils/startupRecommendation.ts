// Startup Recommendation Logic
export interface QuestionnaireAnswers {
  [key: string]: string | number;
}

export interface StartupRecommendationCriteria {
  revenueModelValidated: boolean;
  customerWillingnessToPay: boolean;
  revenueGenerated: boolean;
  marketValidation: boolean;
  technicalReadiness: boolean;
  customerBase: boolean;
  scalabilityPlan: boolean;
}

export const evaluateStartupReadiness = (answers: QuestionnaireAnswers): StartupRecommendationCriteria => {
  console.log('Evaluating startup readiness with answers:', answers);
  
  const criteria = {
    // TRL 6 Criteria - Revenue Model Validation
    revenueModelValidated: answers.revenueModelIdentified === "Yes, validated with customers",
    
    // Customer Willingness to Pay
    customerWillingnessToPay: ["Yes, multiple customers confirmed", "Yes, few customers confirmed"].includes(
      answers.customerWillingnessToPay as string
    ),
    
    // Market Validation (score-based)
    marketValidation: (answers.marketValidationScore as number) >= 4,
    
    // TRL 7 Criteria - Revenue Generation
    revenueGenerated: ["Yes, consistent revenue stream", "Yes, initial sales completed", "Pre-orders/commitments received"].includes(
      answers.revenueGenerated as string
    ),
    
    // Technical Readiness - Based on testing methodology and performance optimization
    technicalReadiness: (() => {
      const hasGoodTesting = answers.testingMethodology && (answers.testingMethodology as string).length >= 50;
      const hasPerformanceOptimization = answers.performanceOptimization && (answers.performanceOptimization as string).length >= 30;
      const hasProductMarketFitEvidence = answers.productMarketFit && (answers.productMarketFit as string).length >= 40;
      
      // Technical readiness if they have solid testing methodology OR performance optimization OR strong PMF evidence
      return hasGoodTesting || hasPerformanceOptimization || hasProductMarketFitEvidence;
    })(),
    
    // Customer Base - Has paying customers
    customerBase: (() => {
      if (!answers.customerBase) return false;
      const customerCount = parseInt(answers.customerBase as string);
      return !isNaN(customerCount) && customerCount > 0;
    })(),
    
    // Scalability Plan - Has comprehensive scaling strategy
    scalabilityPlan: answers.scalabilityPlan && (answers.scalabilityPlan as string).length >= 50,
  };
  
  console.log('Evaluated criteria:', criteria);
  return criteria;
};

export const shouldRecommendStartup = (criteria: StartupRecommendationCriteria): boolean => {
  const metCriteria = Object.values(criteria).filter(Boolean).length;
  // Recommend startup if 5 or more criteria are met
  return metCriteria >= 5;
};

export const getRecommendationLevel = (criteria: StartupRecommendationCriteria): 'high' | 'medium' | 'low' => {
  const metCriteria = Object.values(criteria).filter(Boolean).length;
  
  if (metCriteria >= 6) return 'high';
  if (metCriteria >= 4) return 'medium';
  return 'low';
};

export const getRecommendationMessage = (level: 'high' | 'medium' | 'low'): string => {
  switch (level) {
    case 'high':
      return "🚀 Excellent! Your idea shows strong startup potential. You're ready to create a startup and scale your business.";
    case 'medium':
      return "⭐ Good progress! Your idea has startup potential. Consider addressing a few more criteria before transitioning to startup mode.";
    case 'low':
      return "💡 Keep developing! Focus on validating your revenue model and market demand before considering startup formation.";
    default:
      return "";
  }
};

export const getMissingCriteria = (criteria: StartupRecommendationCriteria): { trl6: string[], trl7: string[] } => {
  const trl6Missing: string[] = [];
  const trl7Missing: string[] = [];
  
  // TRL 6 Criteria (Current stage requirements)
  if (!criteria.revenueModelValidated) trl6Missing.push("Revenue model validation with customers");
  if (!criteria.customerWillingnessToPay) trl6Missing.push("Customer willingness to pay confirmation");
  if (!criteria.marketValidation) trl6Missing.push("Strong market validation (score 4+)");
  if (!criteria.technicalReadiness) trl6Missing.push("Technical readiness (testing/optimization)");
  
  // TRL 7 Criteria (Next stage requirements)
  if (!criteria.revenueGenerated) trl7Missing.push("Actual revenue generation");
  if (!criteria.customerBase) trl7Missing.push("Paying customer base");
  if (!criteria.scalabilityPlan) trl7Missing.push("Detailed scaling plan");
  
  return { trl6: trl6Missing, trl7: trl7Missing };
};
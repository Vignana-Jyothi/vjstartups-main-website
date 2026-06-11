const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const QuestionnaireResponse = require('../models/Questionnaire');

router.use(express.json());

// Startup worthiness evaluation function
const evaluateStartupWorthiness = (responses) => {
  const criteria = {
    // TRL 6 Criteria
    revenueModelValidated: responses.revenueModelIdentified === "Yes, validated with customers",
    customerWillingnessToPay: ["Yes, multiple customers confirmed", "Yes, few customers confirmed"].includes(
      responses.customerWillingnessToPay
    ),
    marketValidation: (responses.marketValidationScore || 0) >= 4,
    
    // TRL 7 Criteria
    revenueGenerated: ["Yes, consistent revenue stream", "Yes, initial sales completed", "Pre-orders/commitments received"].includes(
      responses.revenueGenerated
    ),
    technicalReadiness: (responses.testingMethodology && responses.testingMethodology.length >= 50) ||
                       (responses.performanceOptimization && responses.performanceOptimization.length >= 30) ||
                       (responses.productMarketFit && responses.productMarketFit.length >= 40),
    customerBase: responses.customerBase && parseInt(responses.customerBase) > 0,
    scalabilityPlan: responses.scalabilityPlan && responses.scalabilityPlan.length >= 50,
  };
  
  const metCriteria = Object.values(criteria).filter(Boolean).length;
  
  return {
    criteria,
    metCriteria,
    totalCriteria: Object.keys(criteria).length,
    isStartupWorthy: metCriteria >= 4, // Need at least 4/7 criteria
    worthinessLevel: metCriteria >= 6 ? 'high' : metCriteria >= 4 ? 'medium' : 'low'
  };
};

// Test endpoint to create database collection
router.post('/test-create', async (req, res) => {
  try {
    const testResponse = new QuestionnaireResponse({
      responseId: 'test-' + Date.now(),
      userId: 'test-user',
      userEmail: 'test@example.com',
      userName: 'Test User',
      responses: {
        problemDescription: 'Test problem description',
        problemSeverity: 5
      },
      score: {
        problemClarity: 75,
        marketPotential: 60,
        solutionViability: 80,
        competitivePosition: 70,
        executionReadiness: 65,
        overallScore: 70
      },
      recommendations: ['Test recommendation'],
      status: 'completed'
    });

    await testResponse.save();
    res.status(201).json({ 
      message: 'Test questionnaire created successfully! Database collection should now exist.',
      data: testResponse 
    });
  } catch (err) {
    console.error('Error creating test questionnaire:', err);
    res.status(500).json({ message: "Error creating test questionnaire", error: err.message });
  }
});

// Get all questionnaire responses for a user
router.get('/responses/:userEmail', async (req, res) => {
  try {
    const responses = await QuestionnaireResponse.find({ 
      userEmail: req.params.userEmail 
    }).sort({ createdAt: -1 });
    res.json(responses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching questionnaire responses", error: err.message });
  }
});

// Get a specific questionnaire response
router.get('/response/:responseId', async (req, res) => {
  try {
    const response = await QuestionnaireResponse.findOne({ 
      responseId: req.params.responseId 
    });
    if (!response) {
      return res.status(404).json({ message: "Questionnaire response not found" });
    }
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching questionnaire response", error: err.message });
  }
});

// Get questionnaire responses for a specific idea
router.get('/responses/idea/:ideaId', async (req, res) => {
  try {
    const responses = await QuestionnaireResponse.find({ 
      ideaId: req.params.ideaId 
    }).sort({ createdAt: -1 });
    res.json(responses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching idea questionnaire responses", error: err.message });
  }
});

// Create new questionnaire response
router.post('/response', async (req, res) => {
  try {
    const {
      userId,
      userEmail,
      userName,
      ideaId,
      stageTransition,
      responses,
      status = 'draft'
    } = req.body;

    // Calculate scores based on responses
    const scores = calculateScores(responses);
    const recommendations = generateRecommendations(scores, responses);
    
    // Calculate startup worthiness
    const startupEvaluation = evaluateStartupWorthiness(responses);

    const newResponse = new QuestionnaireResponse({
      responseId: uuidv4(),
      userId,
      userEmail,
      userName,
      ideaId,
      stageTransition,
      responses,
      score: scores,
      recommendations,
      startupWorthiness: startupEvaluation,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newResponse.save();
    
    // If idea is startup worthy and we have an ideaId, update the idea's startup status
    if (ideaId && startupEvaluation.isStartupWorthy) {
      try {
        // Import the Ideas model to update directly
        const Idea = require('../models/Ideas');
        
        await Idea.findOneAndUpdate(
          { ideaId: ideaId },
          {
            startupStatus: {
              isWorthy: true,
              level: startupEvaluation.worthinessLevel,
              evaluatedAt: new Date(),
              hasStartupCreated: false
            }
          },
          { new: true }
        );
        
        console.log(`✅ Updated startup status for idea ${ideaId}: ${startupEvaluation.worthinessLevel}`);
      } catch (ideaUpdateError) {
        console.log('❌ Could not update idea startup status:', ideaUpdateError.message);
        // Continue without failing the questionnaire response
      }
    }
    
    res.status(201).json(newResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating questionnaire response", error: err.message });
  }
});

// Update questionnaire response
router.put('/response/:responseId', async (req, res) => {
  try {
    const response = await QuestionnaireResponse.findOne({ 
      responseId: req.params.responseId 
    });
    
    if (!response) {
      return res.status(404).json({ message: "Questionnaire response not found" });
    }

    // Check if the user is the owner of the response
    if (response.userEmail !== req.body.userEmail) {
      return res.status(403).json({ message: "Unauthorized to update this response" });
    }

    // Update fields
    if (req.body.responses) {
      response.responses = { ...response.responses, ...req.body.responses };
      
      // Recalculate scores and recommendations
      const scores = calculateScores(response.responses);
      const recommendations = generateRecommendations(scores, response.responses);
      
      response.score = scores;
      response.recommendations = recommendations;
    }
    
    if (req.body.status) {
      response.status = req.body.status;
    }
    
    response.updatedAt = new Date();

    await response.save();
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating questionnaire response", error: err.message });
  }
});

// Delete questionnaire response
router.delete('/response/:responseId', async (req, res) => {
  try {
    const response = await QuestionnaireResponse.findOne({ 
      responseId: req.params.responseId 
    });
    
    if (!response) {
      return res.status(404).json({ message: "Questionnaire response not found" });
    }

    // Check if the user is the owner of the response
    if (response.userEmail !== req.body.userEmail) {
      return res.status(403).json({ message: "Unauthorized to delete this response" });
    }

    await QuestionnaireResponse.deleteOne({ responseId: req.params.responseId });
    res.json({ message: "Questionnaire response deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting questionnaire response", error: err.message });
  }
});

// Helper function to calculate scores
function calculateScores(responses) {
  const scores = {
    problemClarity: 0,
    marketPotential: 0,
    solutionViability: 0,
    competitivePosition: 0,
    executionReadiness: 0,
    overallScore: 0
  };

  // Problem Clarity Score (0-100)
  let problemScore = 0;
  if (responses.problemDescription && responses.problemDescription.length > 50) problemScore += 30;
  if (responses.problemSeverity >= 4) problemScore += 25;
  if (responses.problemFrequency === 'daily' || responses.problemFrequency === 'weekly') problemScore += 25;
  if (responses.customerValidation && responses.customerValidation.includes('interviewed')) problemScore += 20;
  scores.problemClarity = Math.min(problemScore, 100);

  // Market Potential Score (0-100)
  let marketScore = 0;
  if (responses.targetAudience && responses.targetAudience.length > 30) marketScore += 25;
  if (responses.audienceSize === 'large' || responses.audienceSize === 'medium') marketScore += 25;
  if (responses.marketSize === 'billion' || responses.marketSize === 'million') marketScore += 25;
  if (responses.earlyAdopters && responses.earlyAdopters.length > 20) marketScore += 25;
  scores.marketPotential = Math.min(marketScore, 100);

  // Solution Viability Score (0-100)
  let solutionScore = 0;
  if (responses.solutionDescription && responses.solutionDescription.length > 50) solutionScore += 25;
  if (responses.technicalFeasibility >= 4) solutionScore += 25;
  if (responses.uniqueValue && responses.uniqueValue.length > 30) solutionScore += 25;
  if (responses.revenueModel && responses.revenueModel.length > 10) solutionScore += 25;
  scores.solutionViability = Math.min(solutionScore, 100);

  // Competitive Position Score (0-100)
  let competitiveScore = 0;
  if (responses.competitiveAdvantage && responses.competitiveAdvantage.length > 30) competitiveScore += 35;
  if (responses.marketGaps && responses.marketGaps.length > 20) competitiveScore += 35;
  if (responses.existingSolutions && responses.existingSolutions.includes('limited')) competitiveScore += 30;
  scores.competitivePosition = Math.min(competitiveScore, 100);

  // Execution Readiness Score (0-100)
  let executionScore = 0;
  if (responses.resourceRequirements && responses.resourceRequirements.length > 20) executionScore += 20;
  if (responses.timeToMarket === '3-6 months' || responses.timeToMarket === '6-12 months') executionScore += 20;
  if (responses.immediateActions && responses.immediateActions.length > 0) executionScore += 30;
  if (responses.mitigationStrategies && responses.mitigationStrategies.length > 20) executionScore += 30;
  scores.executionReadiness = Math.min(executionScore, 100);

  // Overall Score (weighted average)
  scores.overallScore = Math.round(
    (scores.problemClarity * 0.25) +
    (scores.marketPotential * 0.25) +
    (scores.solutionViability * 0.20) +
    (scores.competitivePosition * 0.15) +
    (scores.executionReadiness * 0.15)
  );

  return scores;
}

// Helper function to generate recommendations
function generateRecommendations(scores, responses) {
  const recommendations = [];

  if (scores.problemClarity < 70) {
    recommendations.push("Conduct more customer interviews to better understand the problem");
    recommendations.push("Create detailed user personas and pain point analysis");
  }

  if (scores.marketPotential < 70) {
    recommendations.push("Research market size and growth trends more thoroughly");
    recommendations.push("Identify and validate your target customer segments");
  }

  if (scores.solutionViability < 70) {
    recommendations.push("Develop a minimum viable product (MVP) to test core assumptions");
    recommendations.push("Validate technical feasibility with prototypes or proof of concepts");
  }

  if (scores.competitivePosition < 70) {
    recommendations.push("Conduct comprehensive competitive analysis");
    recommendations.push("Identify and strengthen your unique value proposition");
  }

  if (scores.executionReadiness < 70) {
    recommendations.push("Create a detailed project timeline and resource plan");
    recommendations.push("Identify potential risks and develop mitigation strategies");
  }

  if (scores.overallScore >= 80) {
    recommendations.push("Your idea shows strong potential! Consider developing a business plan");
    recommendations.push("Start building an MVP and gathering early user feedback");
  } else if (scores.overallScore >= 60) {
    recommendations.push("Your idea has potential but needs refinement in key areas");
    recommendations.push("Focus on the lowest-scoring areas for improvement");
  } else {
    recommendations.push("Consider pivoting or significantly refining your idea");
    recommendations.push("Conduct more market research before proceeding");
  }

  return recommendations;
}

module.exports = router;

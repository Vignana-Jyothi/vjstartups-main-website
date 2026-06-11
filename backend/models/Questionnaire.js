const mongoose = require('mongoose');

const questionnaireResponseSchema = new mongoose.Schema({
  responseId: String,
  userId: String,
  userEmail: String,
  userName: String,
  ideaId: String, // Link to specific idea
  stageTransition: {
    from: Number,
    to: Number
  },
  responses: {
    // Dynamic responses based on stage-specific questionnaire
    type: mongoose.Schema.Types.Mixed
  },
  score: {
    problemClarity: { type: Number, min: 0, max: 100 },
    marketPotential: { type: Number, min: 0, max: 100 },
    solutionViability: { type: Number, min: 0, max: 100 },
    competitivePosition: { type: Number, min: 0, max: 100 },
    executionReadiness: { type: Number, min: 0, max: 100 },
    overallScore: { type: Number, min: 0, max: 100 }
  },
  recommendations: [String],
  startupWorthiness: {
    criteria: {
      revenueModelValidated: Boolean,
      customerWillingnessToPay: Boolean,
      marketValidation: Boolean,
      revenueGenerated: Boolean,
      technicalReadiness: Boolean,
      customerBase: Boolean,
      scalabilityPlan: Boolean
    },
    metCriteria: Number,
    totalCriteria: Number,
    isStartupWorthy: Boolean,
    worthinessLevel: { type: String, enum: ['high', 'medium', 'low'] }
  },
  status: { type: String, enum: ['draft', 'completed'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// // Force collection creation
// questionnaireResponseSchema.statics.createCollection = async function() {
//   try {
//     await this.createCollection();
//     console.log('✅ QuestionnaireResponse collection created');
//   } catch (error) {
//     if (error.code !== 48) { // Collection already exists
//       console.error('❌ Error creating QuestionnaireResponse collection:', error);
//     }
//   }
// };

const QuestionnaireResponse = mongoose.model('QuestionnaireResponse', questionnaireResponseSchema);

// Create the collection immediately when the model is loaded
// QuestionnaireResponse.createCollection().catch(err => {
//   if (err.code !== 48) { // Ignore "collection already exists" error
//     console.error('Collection creation error:', err);
//   }
// });

module.exports = QuestionnaireResponse;

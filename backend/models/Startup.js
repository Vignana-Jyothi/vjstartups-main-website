const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  }
});

const startupSchema = new mongoose.Schema({
  // Basic Information
  startupName: {
    type: String,
    required: true,
    trim: true
  },
  tagline: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Visual Assets
  coverImage: {
    type: String, // URL to uploaded cover image
    default: ''
  },
  logo: {
    type: String, // URL to uploaded logo
    default: ''
  },
  
  // Team Information
  founders: {
    type: String,
    required: true
  },
  team: [teamMemberSchema], // Structured team data
  
  // Business Information
  stage: {
    type: Number,
    min: 1,
    max: 9,
    required: true
  },
  fundingStatus: {
    type: String,
    required: true,
    enum: ['bootstrapped', 'seeking-funding', 'pre-seed', 'seed', 'series-a', 'later-stage']
  },
  fundingAmount: {
    type: String,
    default: ''
  },
  revenue: {
    type: String,
    default: ''
  },
  customers: {
    type: String,
    default: ''
  },
  markets: {
    type: String,
    default: ''
  },
  incorporationStatus: {
    type: String,
    required: true,
    enum: ['not-incorporated', 'incorporated', 'llc', 'partnership', 'other']
  },
  website: {
    type: String,
    default: ''
  },
  
  // Business Model & Strategy
  businessModel: {
    type: String,
    default: ''
  },
  keyFeatures: [{
    type: String
  }],
  technologyStack: [{
    type: String
  }],
  
  // Market Analysis
  marketSize: {
    type: String,
    default: ''
  },
  annualGrowthRate: {
    type: String,
    default: ''
  },
  targetUsers: {
    type: String,
    default: ''
  },
  
  // Progress & Recognition
  milestones: [milestoneSchema],
  supportPrograms: [{
    type: String
  }],
  teamSize: {
    type: Number,
    default: 1,
    min: 1,
    max: 10000
  },
  
  // Documents & Media
  pitchDeck: {
    type: String, // URL to uploaded pitch deck
    default: ''
  },
  onePager: {
    type: String, // URL to uploaded one pager
    default: ''
  },
  
  // Engagement
  upvotes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  
  // Pre-populated from idea validation
  problemStatement: {
    type: String,
    default: ''
  },
  solution: {
    type: String,
    default: ''
  },
  targetAudience: {
    type: String,
    default: ''
  },
  competitiveAdvantage: {
    type: String,
    default: ''
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.Mixed, // Flexible to handle ObjectId or string
    default: 'anonymous'
  },
  ideaId: {
    type: String // Changed from ObjectId to String to handle UUIDs
    // Removed ref since Ideas might use UUID instead of ObjectId
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
startupSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Startup', startupSchema);
const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  ideaId: String,
  title: String,
  description: String,
  titleImage: { type: String, default: "" },
  relatedProblemId: String,
  stage: { type: Number, default: 1 },
  upvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: String }],
  comments: { type: Array, default: [] },
  team: [{
    name: String,
    email: String,
    role: String,
    image: String
  }],
  mentor: String,
  contact: String,
  addedByName: String,
  addedByEmail: String,
  tags: [String],
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: String,
    accessLevel: { type: String, enum: ['public', 'private'], default: 'public' },
    uploadedBy: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  links: [{
    title: String,
    url: String,
    description: String,
    accessLevel: { type: String, enum: ['public', 'private'], default: 'public' },
    addedBy: String,
    addedAt: { type: Date, default: Date.now }
  }],
  collaborators: [{ type: String }], // Email addresses of collaborators
  targetCustomers: String,
  startupStatus: {
    isWorthy: { type: Boolean, default: false },
    level: { type: String, enum: ['high', 'medium', 'low'] },
    evaluatedAt: Date,
    hasStartupCreated: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Idea', ideaSchema);

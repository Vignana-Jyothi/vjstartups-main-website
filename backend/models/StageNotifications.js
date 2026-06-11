const mongoose = require('mongoose');

const stageNotificationSchema = new mongoose.Schema({
  ideaId: String,
  ideaTitle: String,
  userEmail: { type: String, required: true },
  userName: String,
  userAvatar: String,
  previousStage: { type: Number, required: true },
  newStage: { type: Number, required: true },
  stageName: String,
  stageType: { 
    type: String, 
    enum: ['problem', 'idea', 'startup'], 
    default: 'idea' 
  },
  createdAt: { type: Date, default: Date.now },
  // TTL index - automatically delete notifications after 30 days
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    index: { expires: 0 }
  }
});

// Index for efficient querying of recent notifications
stageNotificationSchema.index({ createdAt: -1 });
stageNotificationSchema.index({ userEmail: 1, createdAt: -1 });
stageNotificationSchema.index({ ideaId: 1, createdAt: -1 });

module.exports = mongoose.model('StageNotification', stageNotificationSchema);

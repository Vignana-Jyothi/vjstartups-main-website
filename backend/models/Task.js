const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorPicture: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'review', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['urgent', 'high', 'medium', 'low', 'none'],
    default: 'none'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignee: {
    userId: { type: String, default: null },
    name: { type: String, default: null },
    picture: { type: String, default: null }
  },
  labels: [{ type: String }],
  dueDate: {
    type: Date,
    default: null
  },
  order: {
    type: Number,
    default: 0 // for ordering within a status column
  },
  comments: [CommentSchema],
  createdBy: {
    userId: { type: String, required: true },
    name: { type: String, required: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

TaskSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for fast project-based queries
TaskSchema.index({ projectId: 1, status: 1 });
TaskSchema.index({ projectId: 1, order: 1 });

module.exports = mongoose.model('Task', TaskSchema);

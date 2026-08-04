const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: String,
  picture: String, // Google OAuth picture URL
  role: {
    type: String,
    enum: ['user', 'student', 'wing_member', 'wing_master', 'admin'],
    default: 'student'
  },
  adminToken: {
    type: String,
    default: null // UUID session token, only set when admin logs in
  },
  adminTokenCreatedAt: {
    type: Date,
    default: null
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);

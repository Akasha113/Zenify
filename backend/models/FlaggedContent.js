const mongoose = require('mongoose');

const flaggedContentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['chat', 'journal'],
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  keywords: [String],
  reason: String,
  flaggedAt: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'escalated', 'resolved'],
    default: 'pending'
  },
  notes: String,
  escalatedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  actionTaken: String,
  contactedUser: {
    type: Boolean,
    default: false
  },
  contactedAt: Date,
  contactMethod: String
});

// Index for admin queries
flaggedContentSchema.index({ status: 1, riskLevel: -1, flaggedAt: -1 });
flaggedContentSchema.index({ userId: 1, flaggedAt: -1 });

module.exports = mongoose.model('FlaggedContent', flaggedContentSchema);

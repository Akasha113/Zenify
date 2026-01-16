const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'neutral', 'anxious', 'angry', 'excited', 'calm', 'frustrated'],
    required: true
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  note: String,
  activities: [String],
  triggers: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
moodSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('MoodEntry', moodSchema);

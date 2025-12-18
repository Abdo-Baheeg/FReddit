const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetType: {
    type: String,
    enum: ['Post', 'Comment'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index - ensures one save per user per target
savedSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

// Index for finding user's saved items
savedSchema.index({ userId: 1, createdAt: -1 });

// Index for checking if target is saved
savedSchema.index({ targetId: 1, targetType: 1 });

module.exports = mongoose.model('Saved', savedSchema);
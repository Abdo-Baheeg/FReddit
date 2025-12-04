const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
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
  voteType: {
    type: Number,
    enum: [1, -1], // 1 = upvote, -1 = downvote
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index - ensures one vote per user per target
voteSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

// Index for counting votes on a target
voteSchema.index({ targetId: 1, targetType: 1, voteType: 1 });

// Index for finding user's votes
voteSchema.index({ userId: 1, targetType: 1 });

module.exports = mongoose.model('Vote', voteSchema);

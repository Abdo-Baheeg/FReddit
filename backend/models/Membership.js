const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  role: {
    type: String,
    enum: ['member', 'moderator'],
    default: 'member'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index - ensures one membership per user per community
membershipSchema.index({ userId: 1, communityId: 1 }, { unique: true });

// Index for finding all members of a community
membershipSchema.index({ communityId: 1, role: 1 });

// Index for finding all communities a user is in
membershipSchema.index({ userId: 1, joinedAt: -1 });

module.exports = mongoose.model('Membership', membershipSchema);

const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    memberCount: {
        type: Number,
        default: 0
    },
    rules: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    ageVerified: {
        type: Boolean,
        default: false
    },
    bannerUrl: {
        type: String,
        default: ''
    },
    avatarUrl: {
        type: String,
        default: ''
    },
    moderators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

});

// Indexes for faster queries
communitySchema.index({ name: 1 }, { unique: true });
communitySchema.index({ createdAt: -1 });
communitySchema.index({ memberCount: -1 });
communitySchema.index({ isPublic: 1 });
communitySchema.index({ ageVerified: 1 });

module.exports = mongoose.model('Community', communitySchema);
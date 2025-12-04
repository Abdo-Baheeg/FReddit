const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
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
    }
});

// Indexes for faster queries
communitySchema.index({ name: 1 }, { unique: true });
communitySchema.index({ memberCount: -1 });
communitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Community', communitySchema);
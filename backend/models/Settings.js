const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    darkMode: {
        type: Boolean,
        default: false
    },
    notificationsEnabled: {
        type: Boolean,
        default: true
    },
    NSFWFilter: {
        type: Boolean,
        default: false
    },
    NSFW: {
        type: Boolean,
        default: false
    }

});
module.exports = mongoose.model('Settings', settingsSchema);
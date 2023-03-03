const mongoose = require('mongoose');

const eventSubSecretSchema = new mongoose.Schema({
    token: {
        type: String
    }
}, {
    timestamps: true
});

const EventSubSecret = mongoose.model('EventSubSecret', eventSubSecretSchema);

module.exports = EventSubSecret;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const twitchWebhookSchema = new mongoose.Schema({
  id: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String
  },
  type: {
    type: String
  },
  condition: {
    type: Object
  },
  transport: {
    type: Object
  },
  secret: {
    type: String
  }
}, {
  timestamps: true
});

const TwitchWebhook = mongoose.model('TwitchWebhook', twitchWebhookSchema);

module.exports = TwitchWebhook;
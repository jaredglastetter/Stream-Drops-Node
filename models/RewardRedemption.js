const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rewardRedemptionSchema = new mongoose.Schema({
  id: {
    type: String
  },
  broadcasterId: {
    type: String
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reward: {
    type: Schema.Types.ObjectId,
    ref: 'Reward',
  },
  status: {
    type: String,
    enum: ["CANCELLED", "FULFILLED", "UNFULFILLED"]
  },
  redeemedAt: {
    type: Date
  },
  userInput: {
    type: String
  },
  nft: {
    type: Schema.Types.ObjectId,
    ref: "NFT"
  }

}, {
  timestamps: true
});

const RewardRedemption = mongoose.model('RewardRedemption', rewardRedemptionSchema);

module.exports = RewardRedemption;
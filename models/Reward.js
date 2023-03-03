const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rewardSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  id: {
    type: String
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  prompt: {
    type: String
  },
  cost: {
    type: String
  },
  totalSupply: {
    type: Number
  },
  image: {
    type: String
  },
  defaultImage: {
    type: Object
  },
  nftModel: {
    type: Schema.Types.ObjectId,
    ref: 'NFTModel'
  }
}, {
  timestamps: true
});

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward;
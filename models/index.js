const User = require('./User');
const Reward = require('./Reward');
const EventSubSecret = require('./EventSubSecret')
const RewardRedemption = require('./RewardRedemption')
const TwitchWebhook = require('./TwitchWebhook');
const Wallet = require('./Wallet')
const NFTModel = require('./NFTModel')
const NFT = require('./NFT');
const NFTSet = require('./NFTSet');

// add any other models you define in this folder

module.exports = {
  User,
  EventSubSecret,
  RewardRedemption,
  Reward,
  TwitchWebhook,
  Wallet,
  NFTModel,
  NFT,
  NFTSet

  // export any other models you define in this folder
};
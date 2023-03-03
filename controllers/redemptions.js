const mongoose = require('mongoose');
const User = mongoose.model('User')
const RewardRedemption = mongoose.model('RewardRedemption')

exports.redemptions_reward_get = async function (req, res) {
  let redemptions = await RewardRedemption.find({ reward: req.params.rewardId }).populate('owner', 'username profileImageUrl').populate('creator', 'username profileImageUrl').populate('reward', 'title cost');
  res.send(redemptions);
}

exports.redemptions_user_get = async function (req, res) {
  let user = req.params?.userId || req.user;
  console.log(req.params)
  console.log('redemptions user', user);
  let redemptions = await RewardRedemption.find({ owner: user }).populate('owner', 'username profileImageUrl').populate('creator', 'username profileImageUrl').populate('reward', 'title cost image');
  res.send(redemptions);
}

exports.redemptions_get = async function (req, res) {
  let redemptions = await RewardRedemption.find()

  res.send(redemptions);
}

exports.redemption_get = async function (req, res) {
  let redemption = await RewardRedemption.findById(req.params.id).populate('owner', 'username profileImageUrl').populate('creator', 'username profileImageUrl').populate('reward', 'title cost image');

  res.send(redemption);
}

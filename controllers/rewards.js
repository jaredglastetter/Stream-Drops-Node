const mongoose = require('mongoose');
const User = mongoose.model('User')
const Reward = mongoose.model('Reward')

exports.rewards_get = async function (req, res) {
  //TODO: consider unjanking this by separating into 'my rewards' and rewards search routes
  let user = req.query?.user || req.user;
  let rewards = await Reward.find({ user: user });
  res.send(rewards);
}

exports.reward_get = async function (req, res) {
  let reward = await Reward.findById(req.params.id).populate('user', 'username profileImageUrl')

  res.send(reward);
}

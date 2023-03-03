const mongoose = require('mongoose');
const User = mongoose.model('User')

exports.users_get = async function (req, res) {
  let query = req.query;
  let users = await User.find({ broadcasterType: query.broadcasterType })

  res.send(users);
}

exports.user_get = async function (req, res) {
  let username = req.params.username;
  let user = await User.findOne({ username: username })

  res.send(user);
}
const mongoose = require('mongoose');
const axios = require('axios');
const qs = require('qs');

const userSchema = new mongoose.Schema({
  twitchId: {
    type: String,
    // required: true
  },
  accessToken: {
    type: String,
    // required: true
  },
  refreshToken: {
    type: String
  },
  broadcasterType: String,
  username: String,
  email: String,
  profileImageUrl: String,
  eventSubSecret: {
    ref: 'eventSubSecret',
    type: mongoose.Types.ObjectId
  },
  wallet: {
    type: mongoose.Types.ObjectId
  },
  nftSet: {
    type: mongoose.Types.ObjectId,
  },
  nfts: {
    type: Array,
    default: []
  }
}, {
  timestamps: true
});

userSchema.methods.generateAccessToken = async function () {
  console.log('checking if token valid: ')
  //validate first
  let validity = await axios.get("https://id.twitch.tv/oauth2/validate", { headers: { Authorization: 'OAuth ' + this.acessToken } })
    .catch((e) => {
      return e;
    });
  console.log('valid token check: ', validity?.data)

  //generate new one if invalid, else return current
  if (!validity?.data?.status || validity?.data?.status == 401) {
    console.log('generating new access token')
    const data = qs.stringify({
      refresh_token: this.refreshToken,
      client_id: process.env.twitchClientId,
      client_secret: process.env.twitchClientSecret,
      grant_type: "refresh_token"
    });

    let tokenData = await axios.post("https://id.twitch.tv/oauth2/token", data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log(tokenData)
    console.log("new access token: ", tokenData?.data.access_token)
    this.accessToken = tokenData?.data.access_token;
    await this.save();
  }
  return this.accessToken;

}

const User = mongoose.model('User', userSchema);

module.exports = User;

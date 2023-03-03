const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User')
const Wallet = mongoose.model('Wallet')

var request = require('request');
const e = require('express');

const { createWalletForUser } = require('../services/wallet');
const { createNFTSet } = require('../services/nft')

OAuth2Strategy.prototype.userProfile = function (accessToken, done) {
  console.log('grabbing user data')
  var options = {
    url: 'https://api.twitch.tv/helix/users',
    method: 'GET',
    headers: {
      'Client-ID': process.env.twitchClientId,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Authorization': 'Bearer ' + accessToken
    }
  };

  request(options, function (error, response, body) {
    if (response && response.statusCode == 200) {
      done(null, JSON.parse(body));
    } else {
      done(JSON.parse(body));
    }
  });
}

// Configure Twitch authentication strategy
passport.use('twitch', new OAuth2Strategy({
  authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
  tokenURL: 'https://id.twitch.tv/oauth2/token',
  clientID: process.env.twitchClientId,
  clientSecret: process.env.twitchClientSecret,
  callbackURL: process.env.apiDomain + '/api/auth/twitch/callback',
  state: true,
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let data = profile.data[0];
      console.log(data);
      data.accessToken = accessToken;
      data.refreshToken = refreshToken;
      data.twitchId = data.id;
      data.username = data.login;
      data.broadcasterType = data.broadcaster_type;
      data.profileImageUrl = data.profile_image_url;

      console.log('authenticating: ', data)
      // Find or create a user in the database
      let user = await User.findOne({ twitchId: data.twitchId });

      // New User
      if (!user) {
        //Create User
        let newUser = new User(
          data
        )
        console.log("new User", newUser)

        user = await newUser.save();
      }

      // Create Wallet
      if (!user.wallet) {
        let wallet = await createWalletForUser(user._id)
        user.wallet = wallet._id
        await user.save();
      }

      // Create NFTSet
      if (!user.nftSet) {
        await createNFTSet(user, "Base Set").catch((err) => {
          console.log("error while creating nftSet for user", err)
        })
      }


      return done(null, user);

    } catch (err) {
      console.log('auth err: ', err)
      return done(err);
    }




  },
  (err) => {
    console.log('passport auth err: ', err)
  }
));

// Serialize and deserialize user for session support
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  try {
    user = await User.findById(user._id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;

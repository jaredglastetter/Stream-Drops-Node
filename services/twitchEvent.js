const axios = require('axios');
const crypto = require('crypto')
const mongoose = require('mongoose');
const EventSubSecret = mongoose.model('EventSubSecret');
const User = mongoose.model('User');

const TWITCH_ACCESS_TOKEN = process.env.twitchAppAccessToken;
const CLIENT_ID = process.env.twitchClientId;
const CALLBACK_URL = process.env.appDomain + "/api/twitch/event/redemption"

async function createEventSubSubscription(type, condition, callbackUrl, accessToken) {

  //Create Secret which twitch writes in the header of future messages from this sub
  const secret = crypto.randomBytes(32).toString('hex');
  let newSecret = new EventSubSecret({
    token: secret
  })

  let createdSecret = await newSecret.save();

  let data = {
    type: type,
    version: '1',
    condition: condition,
    transport: {
      method: 'webhook',
      callback: callbackUrl,
      secret: secret,
    },
  };

  console.log('accessToken', accessToken)

  const response = await axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', data, {
    headers: {
      'Client-ID': process.env.twitchClientId,
      'Authorization': `Bearer ${process.env.twitchAppAccessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response) {
    let subscription = response?.data?.data[0];
    subscription.secret = createdSecret.token;
    return subscription;
  } else {
    const error = await response.json();
    throw new Error(`Failed to create EventSub subscription: ${error.message}`);
  }
}

async function deleteEventSubSubscription(subscriptionId, accessToken) {
  const response = await axios.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscriptionId}`, {
    headers: {
      'Client-ID': CLIENT_ID,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return true;
  } else {
    const error = await response.json();
    throw new Error(`Failed to delete EventSub subscription: ${error.message}`);
  }
}


// create EventSub subscription for channel points redemption
async function subscribeToChannelPointsRedemption(channelId, accessToken) {
  try {
    const subscription = await createEventSubSubscription(
      'channel.channel_points_custom_reward_redemption.add',
      {
        broadcaster_user_id: channelId,
      },
      'https://streamdrops.xyz/api/twitch/event/redemption', //only works on prod
      accessToken,
    );
    console.log(`Subscribed to channel points redemption: ${JSON.stringify(subscription)}`);

    return subscription;
  } catch (error) {
    console.error(`Failed to subscribe to channel points redemption:`, error);
  }

}

module.exports = {
  createEventSubSubscription,
  deleteEventSubSubscription,
  subscribeToChannelPointsRedemption
};
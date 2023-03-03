const axios = require('axios');

const CLIENT_ID = process.env.twitchClientId;

async function createCustomReward(authToken, channelId, reward) {
  const config = {
    headers: {
      'Client-ID': CLIENT_ID,
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  };

  const data = {
    title: reward.title,
    prompt: reward.prompt,
    cost: reward.cost,
    is_user_input_required: reward.prompt ? true : false
  };

  const apiUrl = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${channelId}`
  let response = await axios.post(apiUrl, data, config)
  return response?.data?.data[0];
}

async function getCustomRewards(accessToken, broadcasterId, rewardId) {
  const config = {
    headers: {
      'Client-Id': CLIENT_ID,
      'Authorization': `Bearer ${accessToken}`
    }
  };

  let url = "https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=" + broadcasterId;

  if (rewardId) {
    url += "&id=" + rewardId;
  }

  let response = await axios.get(url, config);
  console.log(response);

  return response?.data;
}

async function getCustomRedemptions(accessToken, broadcasterId, rewardId, status) {
  const config = {
    headers: {
      'Client-Id': CLIENT_ID,
      'Authorization': `Bearer ${accessToken}`
    }
  };

  // let params = {
  //   broadcaster_id: broadcasterId
  // }

  // let response = await axios.get("https://api.twitch.tv/helix/channel_points/custom_rewards", { params: params }, config);
  let response = await axios.get("https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=" + broadcasterId + "&reward_id=" + rewardId + "&status=" + status, config);
  console.log(response);

  return response?.data;
}


module.exports = {
  createCustomReward: createCustomReward,
  getCustomRewards: getCustomRewards,
  getCustomRedemptions: getCustomRedemptions
};

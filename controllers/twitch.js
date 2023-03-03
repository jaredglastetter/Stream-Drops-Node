const mongoose = require('mongoose');
const User = mongoose.model('User')
const Reward = mongoose.model('Reward')
const NFTSet = mongoose.model('NFTSet')
const NFTModel = mongoose.model('NFTModel')
const Wallet = mongoose.model('Wallet')
const RewardRedemption = mongoose.model('RewardRedemption')
const TwitchWebhook = mongoose.model('TwitchWebhook')

const crypto = require('crypto')

const { getCustomRewards, getCustomRedemptions, createCustomReward } = require('../services/twitchRewards.js');
const { subscribeToChannelPointsRedemption } = require('../services/twitchEvent.js');
const { mintNFT, createNFTModel, transferNFT } = require('../services/nft.js')
const { createWalletForUser } = require('../services/wallet.js')

const HMAC_PREFIX = 'sha256=';

// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
const MESSAGE_TYPE_NOTIFICATION = 'notification';
const MESSAGE_TYPE_REVOCATION = 'revocation';

exports.rewards_get = async function (req, res) {
  let rewards = await getCustomRewards(req.user?.accessToken, req.user?.twitchId);

  res.send(rewards);
}

exports.reward_get = async function (req, res) {
  let rewards = await getCustomRewards(req.user?.accessToken, req.user?.twitchId, req.params?.id);
  let reward = rewards.data[0];

  res.send(reward);
}


exports.redemptions_get = async function (req, res) {
  let rewards = await getCustomRedemptions(req.user?.accessToken, req.user?.twitchId, req.query.rewardId, "FULFILLED");

  res.send(rewards);
}

exports.rewards_redeem_post = async function (req, res) {
  const id = req.params.id
  //find existing reward
  let reward = await Reward.findOne({ _id: id })

  const user = req.user;

  //Create wallet if no wallet
  if (!user.wallet) {
    try {
      const wallet = await createWalletForUser(user._id)
      user.wallet = wallet._id
      await user.save();
    } catch (err) {
      console.log("Error while creating user wallet", err);
    }
  }

  //Mint and Transfer NFT
  try {
    let nftModel = await NFTModel.findOne({ _id: reward.nftModel })
    const nft = await mintNFT(user, nftModel.id, 1)

    let wallet = await Wallet.findOne({ _id: user.wallet })
    console.log("the wallet", wallet)
    let response = await transferNFT(wallet.address, nft.id, nftModel.id, wallet.id)
    if (!response) {
      console.log("NFT was not transferred", response)
    }

    let redemption = await RewardRedemption.create({ owner: req.user, creator: reward.user, reward: id, nft: nft })

  } catch (err) {
    console.log("error while minting and transfering nft", err)
    return res.sendStatus(400)
  }

  res.sendStatus(200)

}

exports.rewards_create_post = async function (req, res) {
  const { reward } = req.body
  const { title, totalSupply, description } = reward;

  let user = req.user;
  if (!user) {
    return res.sendStatus(400);
  }

  try {

    let twitchReward = await createCustomReward(user.accessToken, user.twitchId, reward);

    // Create NFTModel on flow
    let nftSet = await NFTSet.findOne({ _id: user.nftSet })
    console.log("nftSet id", nftSet)
    let nftModel = await createNFTModel(user._id, nftSet.id, title, totalSupply, description);

    //save reward in database
    if (twitchReward) {
      console.log(twitchReward)
      let newReward = new Reward({
        user: user,
        id: twitchReward.id,
        title: reward.title,
        prompt: reward.prompt,
        cost: reward.cost,
        totalSupply: reward.totalSupply,
        image: reward.image,
        defaultImage: twitchReward.default_image,
        nftModel: nftModel._id
      })
      await newReward.save();

      // Subscription Logic
      let hasSubscription = await TwitchWebhook.findOne({ user: req.user._id, type: "channel.channel_points_custom_reward_redemption.add" })
      console.log('hasSubscription: ', hasSubscription)
      //setup eventsub if needed
      if (!hasSubscription) {
        let subscription = await subscribeToChannelPointsRedemption(req.user.twitchId, req.user.accessToken);

        subscription.user = req.user?._id;
        console.log("subscription: ", subscription);

        let newSubscription = await TwitchWebhook.create(subscription);

        //save on to user
        // await User.updateOne({ _id: req.user._id }, { $set: { eventSubSecret: createdSecret } })
      }

      return res.send(newReward._id);
    } else {
      return res.sendStatus(400)
    }

  } catch (e) {
    console.log(e);
    return res.sendStatus(400)
  }
}

// User redeeming reward
exports.redemptions_add_webhook = async function (req, res) {
  //webhook challenge verification
  // Notification request headers
  try {
    // Get JSON object from body, so you can process the message.
    let notification = req.body;

    console.log('notification: ', notification);
    console.log('body type', typeof notification)

    let subscription = req.body.subscription;

    console.log('subscription', subscription);

    let twitchWebhook = await TwitchWebhook.findOne({ id: subscription.id });
    console.log('our webhook: ', twitchWebhook);
    let secret = twitchWebhook.secret;

    console.log('our secret: ', secret)

    // console.log('raw body', JSON.stringify(request.body))

    let message = getHmacMessage(req);
    let hmac = HMAC_PREFIX + getHmac(secret, message);  // Signature to compare

    console.log('message: ', message);
    console.log('hmac', hmac);


    if (true === verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
      if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
        // TODO: Do something with the event's data.
        console.log('notification data: ', notification);

        console.log(`Event type: ${notification.subscription.type}`);
        console.log(JSON.stringify(notification.event, null, 4));

        //find existing reward
        let reward = await Reward.findOne({ id: notification.reward.id })

        // Still need to add notification.owner
        notification.creator = reward.user;
        notification.reward = reward._id;
        notification.redeemedAt = notification.redeemed_at;
        notification.broadcasterId = notification.broadcaster_user_id;
        notification.broadcasterName = notification.broadcaster_user_name;
        //create redemption
        await RewardRedemption.create(notification);

        //create user if needed
        const user = await User.findOneAndUpdate(
          { twitchId: notification.user_id },
          {
            twitchId: notification.user_id,
            username: notification.user_name
          },
          { new: true, upsert: true }
        );

        //Create wallet if no wallet
        if (!user.wallet) {
          try {
            const wallet = await createWalletForUser(user._id)
            user.wallet = wallet._id
            await user.save();
          } catch (err) {
            console.log("Error while creating user wallet", err);
          }
        }

        //Mint and Transfer NFT
        try {
          let nftModel = await NFTModel.findOne({ _id: reward.nftModel })
          const nft = await mintNFT(user, nftModel.id, 1)

          let wallet = await Wallet.findOne({ _id: user.wallet })
          console.log("the wallet", wallet)
          let response = await transferNFT(wallet.address, nft.id, nftModel.id, wallet.id)
          if (!response) {
            console.log("NFT was not transferred", response)
          }

          let redemption = await RewardRedemption.create({ owner: req.user, creator: reward.user, reward: id, nft: nft })

        } catch (err) {
          console.log("error while minting and transfering nft", err)
          return res.sendStatus(400)
        }


        res.sendStatus(204);
      }
      else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
        res.status(200).send(notification.challenge);
      }
      else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
        res.sendStatus(204);

        console.log(`${notification.subscription.type} notifications revoked!`);
        console.log(`reason: ${notification.subscription.status}`);
        console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
      }
      else {
        res.sendStatus(204);
        console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
      }
    } else {
      res.send(500); //failed to verify incoming message
    }

  } catch (e) {
    console.log('error parsing webhook event: ', e)
  }
}


// Build the message used to get the HMAC.
function getHmacMessage(request) {
  return (request.headers[TWITCH_MESSAGE_ID] +
    request.headers[TWITCH_MESSAGE_TIMESTAMP] +
    JSON.stringify(request.body));
}


// Get the HMAC.
function getHmac(secret, message) {
  return crypto.createHmac('sha256', secret)
    .update(message)
    .digest('hex');
}

// Verify whether our hash matches the hash that Twitch passed in the header.
function verifyMessage(hmac, verifySignature) {
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}
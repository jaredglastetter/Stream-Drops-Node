var express = require('express');
var router = express.Router();

const twitch_controller = require('../../controllers/twitch')


//Call back from channel points redemption 
router.post('/event/redemption', twitch_controller.redemptions_add_webhook);


/* Reward Zone */

router.get("/rewards", async (req, res, next) => {
  await req.user.generateAccessToken();
  next();
}, twitch_controller.rewards_get);

router.post("/rewards/:id/redeem", async (req, res, next) => {
  await req.user.generateAccessToken();
  next();
}, twitch_controller.rewards_redeem_post);

router.get("/rewards/:id", async (req, res, next) => {
  await req.user.generateAccessToken();
  next();
}, twitch_controller.reward_get);

router.post('/rewards/create', async (req, res, next) => {
  await req.user.generateAccessToken();
  next();
}, twitch_controller.rewards_create_post);


/* Redemption Zone */

router.get("/redemptions",
  async (req, res, next) => {
    await req.user.generateAccessToken();
    next();
  }, twitch_controller.redemptions_get);

module.exports = router;


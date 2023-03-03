var express = require('express');
var router = express.Router();

const redemptions_controller = require('../../controllers/redemptions')

router.get("/", redemptions_controller.redemptions_get);

router.get("/:id", redemptions_controller.redemption_get);

router.get("/reward/:rewardId", redemptions_controller.redemptions_reward_get);

router.get("/user/:userId", redemptions_controller.redemptions_user_get);

module.exports = router;
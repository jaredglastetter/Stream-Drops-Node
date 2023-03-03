var express = require('express');
var router = express.Router();

const rewards_controller = require('../../controllers/rewards')

router.get("/", rewards_controller.rewards_get);

router.get("/:id", rewards_controller.reward_get);

module.exports = router;
const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/auth', require('./auth'));
router.use('/twitch', require('./twitch'));
router.use('/rewards', require('./rewards'));
router.use('/redemptions', require('./redemptions'));
router.use('/nfts', require('./nfts'));

module.exports = router;
var express = require('express');
var router = express.Router();

const passport = require('passport');

router.get('/twitch', passport.authenticate('twitch', { scope: 'channel:manage:redemptions' }));

router.get('/twitch/callback', passport.authenticate('twitch', { successRedirect: process.env.appDomain, failureMessage: true }));

router.get('/me', (req, res) => {
  //send currently logged in person
  if (req.user) {
    res.send(req.user);
  } else {
    res.sendStatus(401);
  }
});

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.sendStatus(200);
  })
});

module.exports = router;
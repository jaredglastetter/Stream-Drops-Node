var express = require('express');
var router = express.Router();

const client = require('../../config/graphql');
const { createWalletOnFlow } = require('../../services/wallet');

const users_controller = require('../../controllers/users')

/* GET users listing. */
router.get('/', users_controller.users_get);

router.get('/:username', users_controller.user_get);

/* Create user wallet */
router.post('/create-wallet', async function (req, res, next) {

  let data = await createWalletOnFlow()
  res.send(data)
})


module.exports = router;

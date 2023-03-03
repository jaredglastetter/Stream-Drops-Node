var express = require('express');
var router = express.Router();

const nfts_controller = require('../../controllers/nfts')

router.post('/create-set', nfts_controller.nfts_set_create_post);

router.post('/create-model', nfts_controller.nfts_model_create_post);

router.post('/mint', nfts_controller.nfts_mint_post);

router.get('/:id', nfts_controller.nft_get_by_id_get)

module.exports = router;

const mongoose = require('mongoose');
const User = mongoose.model('User')
const NFT = mongoose.model('NFT')

const { createNFTSet, createNFTModel, mintNFT, updateNFT } = require('../services/nft.js');

exports.nfts_set_create_post = async function (req, res) {
    const { title } = req.body

    console.log("title ", title)

    let data = await createNFTSet(title)

    res.send(data)
}

exports.nfts_model_create_post = async function (req, res) {
    const { set, title } = req.body

    // metadata is stored on blackchain, attributes are not
    let metaData = {};

    let data = await createNFTModel(set, title, 5, {}, metaData).catch((er) => {
        console.log("error", er)
    })

    res.send(data)
}

exports.nfts_mint_post = async function (req, res) {
    const { model } = req.body

    let data = await mintNFT(model, 1).catch((er) => {
        console.log("error", er)
    })

    res.send(data)
}

exports.nft_get_by_id_get = async function (req, res) {
    const id = req.params.id
    console.log("id", id)

    nft = await updateNFT(id);
    //get query then update nft then return 
    console.log("NFT", nft)
    res.send(nft)
}
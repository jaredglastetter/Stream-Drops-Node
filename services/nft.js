const mongoose = require('mongoose')
const NFT = mongoose.model('NFT')
const NFTSet = mongoose.model('NFTSet')
const NFTModel = mongoose.model('NFTModel')
const User = mongoose.model('User')

const axios = require('axios');

const client = require('../config/graphql');
const { CREATE_NFT_SET, CREATE_NFT_MODEL, MINT_NFT, TRANSFER_NFT, GET_NFT } = require('../utility/graphQL');

async function createNFTSet(user, title, attributes = {}) {
    console.log("title ", title)

    let variables = {
        appId: process.env.niftoryAppId,
        data: {
            title: title,
            attributes: attributes
        }
    }

    const data = await client.request(CREATE_NFT_SET, variables);
    console.log("data from creating nft set", data)

    let nftSet = await NFTSet.create({ ...data.createNFTSet, user: user._id })

    //update user
    user.nftSet = nftSet._id
    await user.save()

    return nftSet;
}

async function createNFTModel(userId, set, title, quantity, description = "", attributes = {}, metadata = {}) {

    console.log("quantity before", quantity)
    quantity = parseInt(quantity);
    console.log("quantity after", quantity)
    let variables = {
        setId: set,
        data: {
            title: title,
            attributes: attributes,
            metadata: metadata,
            quantity: quantity,
            description: description,
        }
    }

    const data = await client.request(CREATE_NFT_MODEL, variables);
    console.log("create nft model data", data);

    let nftModel = await NFTModel.create({ ...data.createNFTModel, user: userId })

    return nftModel;
}

async function mintNFT(user, modelId, quantity) {

    let variables = {
        appId: process.env.niftoryAppId,
        id: modelId,
        quantity: quantity
    }

    const data = await client.request(MINT_NFT, variables);
    console.log("mint nft data", data)

    console.log("NFTS", data.mintNFTModel.nfts);
    let mintedNft = data.mintNFTModel.nfts[data.mintNFTModel.nfts.length - 1]
    console.log("NFT Minted", mintedNft);

    let nft = await NFT.create({ ...mintedNft, user: user._id })

    //update user
    user.nfts.push(nft);
    await user.save()

    return nft;
}

async function updateNFT(id) {
    let variables = {
        id: id
    }

    const data = await client.request(GET_NFT, variables);
    console.log("NFT data", data)

    let udpatedNFT = await NFT.findOneAndUpdate({ id: id }, data.nft)

    return udpatedNFT;

}

async function transferNFT(address, nftId, nftModelId, walletId) {

    let variables = {
        appId: process.env.niftoryAppId,
        // address: address,
        id: nftId,
        nftModelId: nftModelId,
    }
    if (walletId) {
        variables.walletId = walletId
    }

    const data = await client.request(TRANSFER_NFT, variables);
    console.log("transfer data", data)

    return data.transfer;
}

module.exports = {
    createNFTSet,
    createNFTModel,
    mintNFT,
    updateNFT,
    transferNFT

}
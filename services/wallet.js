const mongoose = require('mongoose');
const Wallet = mongoose.model('Wallet')

const axios = require('axios');
const client = require('../config/graphql');
const { CREATE_WALLET } = require('../utility/graphQL');



async function createWalletOnFlow() {
    let variables = {
        appId: process.env.niftoryAppId,
        data: {}
    }

    const data = await client.request(CREATE_WALLET, variables);
    console.log("wallet created", data)

    return data;
}

async function createWalletForUser(user) {
    try {
        const walletData = await createWalletOnFlow();
        const wallet = new Wallet({
            ...walletData.createNiftoryWallet,
            user: user,
        });
        const walletDoc = await wallet.save();
        return wallet;
    } catch (error) {
        console.error("Error while creating or assigning wallet", error);
        return null;
    }
}

module.exports = {
    createWalletOnFlow,
    createWalletForUser
}
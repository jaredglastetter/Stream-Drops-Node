const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    address: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    attributes: {
        type: Object
    },
    id: {
        type: String
    },
    nfts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NFT',
        },
    ],
    state: {
        type: String
    },
    verificationCode: {
        type: String
    },
    walletType: {
        type: String
    },
},
    {
        timestamps: true
    }
);

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;

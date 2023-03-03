const mongoose = require('mongoose');

const nftSetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String
    },
    id: {
        type: String
    },
    blockchainId: {
        type: String
    },
    metadata: {
        type: Object
    },
    attributes: {
        type: Object
    },
    image: {
        type: String,
    },
    status: {
        type: String
    },
    state: {
        type: String
    }
},
    {
        timestamps: true
    }
);

const NFTSet = mongoose.model('NFTSet', nftSetSchema);

module.exports = NFTSet;

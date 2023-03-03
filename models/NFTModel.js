const mongoose = require('mongoose');

const nftModelSchema = new mongoose.Schema({
    title: {
        type: String
    },
    id: {
        type: String
    },
    blockchainId: {
        type: String
    },
    description: {
        type: String,
    },
    quantity: {
        type: Number
    },
    set: {
        type: mongoose.Types.ObjectId,
        ref: "NFTSet"
    },
    metadata: {
        type: Object
    },
    status: {
        type: String
    },
},
    {
        timestamps: true
    }
);

const NFTModel = mongoose.model('NFTModel', nftModelSchema);

module.exports = NFTModel;

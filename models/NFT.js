const mongoose = require('mongoose');
const Schema = mongoose.Schema

const nftSchema = new Schema({

  blockchainId: {
    type: String
  },
  blockchainState: {
    type: String
  },
  id: {
    type: String
  },
  metadata: {
    type: Object
  },
  // model: NFTModel,
  modelId: {
    type: String
  },
  saleState: {
    type: String
  },
  serialNumber: {
    type: String
  },
  status: {
    type: String
  },
  blockchainTransaction: {
    type: Object
  },
  wallet: {
    type: Object
  },
  walletId: {
    type: Schema.Types.ObjectId,
    ref: 'Wallet',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
},
  {
    timestamps: true
  }
);

const NFT = mongoose.model('NFT', nftSchema);

module.exports = NFT;

const { gql } = require('graphql-request');
const fragments = require('./graphQlFragments')

/*       WALLETS               */

/*
variables = {
        appId: process.env.niftoryAppId,
        data: {}
    }
*/
const CREATE_WALLET = gql`
    mutation createNiftoryWallet(
        $appId: ID,
        $data: CreateNiftoryWalletInput,
        $userId: ID
      ) {
        createNiftoryWallet(
          appId: $appId,
          data: $data,
          userId: $userId
        ) {
          address
          attributes
          createdAt
          id
          state
          updatedAt
          verificationCode
          walletType
        }
      }
    `

// {"id": "4"}
const GET_WALLET_BY_ID = gql`
    query walletByAddress(
      $address: String!,
      $appId: ID
    ) {
      walletByAddress(
        address: $address,
        appId: $appId
      ) {
        address
        attributes
        createdAt
        id
        nfts {
          ${fragments.NFTFragment}
        }
        state
        updatedAt
        verificationCode
        walletType
      }
    }
    `


/*       NFTS          */



/**
 *  variables: {
    appId: process.env.niftoryAppId,
    title: "NFT Set",
    data: {
      attributes: {
        creator: {creator},
      },
    }
  }
 */
const CREATE_NFT_SET = gql`
  mutation CreateSet($data: NFTSetCreateInput!) {
    createNFTSet(data: $data) {
        id
        title
        attributes
    }
}
  `

/**
 * {
  "setId": "f29f68ac-43a2-46da-b56b-01e3423719f5",
  "data": {
      "title": "My NFTModel",
      "description": "My NFT template",
      "quantity": 5,
      "contentId": "be040196-421c-48a8-8749-44edc7a92cdd",
      "metadata": {
          "this": "ends up on the blockchain"
      },
      "attributes": {
          "properties": {
              "that": "are private to your app",
              "and": "don't get added to the blockchain"
          }
      }
  }
}
 */
const CREATE_NFT_MODEL = gql`
mutation CreateModel($setId: ID!, $data: NFTModelCreateInput!) {
  createNFTModel(setId: $setId, data: $data) {
      id
      quantity
      title
      attributes
      metadata
  }
}
`
/**
 * {"appId": "4", "id": 4, "quantity": 123}
 */
const MINT_NFT = gql`
mutation mintNFTModel(
  $appId: ID,
  $id: ID!,
  $quantity: PositiveInt
) {
  mintNFTModel(
    appId: $appId,
    id: $id,
    quantity: $quantity
  ) {
    attributes
    blockchainId
    description
    createdAt
    id
    nfts {
     ${fragments.NFTFragment}
    }
    metadata
    quantity
    quantityMinted
    rarity
    state
    status
    title
    updatedAt
  }
}
`

//{"id": "4"}
const GET_NFT = gql`
query nft($id: ID!) {
  nft(id: $id) {
    blockchainId
    blockchainState
    id
    metadata
    model {
      ${fragments.NFTModelFragment}
    }
    modelId
    saleState
    serialNumber
    status
    transactions {
      ${fragments.BlockchainTransactionFragment}
    }
    wallet {
      ${fragments.WalletFragment}
    }
  }
}
`

/*
{
  "address": "xyz789",
  "appId": "4",
  "force": true,
  "id": "4",
  "nftModelId": "4",
  "userId": 4,
  "walletId": 4
}
*/
const TRANSFER_NFT = gql`
mutation transfer(
  $address: String,
  $appId: ID,
  $force: Boolean,
  $id: ID,
  $nftModelId: ID,
  $userId: ID,
  $walletId: ID
) {
  transfer(
    address: $address,
    appId: $appId,
    force: $force,
    id: $id,
    nftModelId: $nftModelId,
    userId: $userId,
    walletId: $walletId
  ) {
    blockchainId
    blockchainState
    id
    metadata
    transactions {
      ${fragments.BlockchainTransactionFragment}
    }
    modelId
    saleState
    serialNumber
    status
  }
}`






module.exports = {
  CREATE_WALLET,
  CREATE_NFT_SET,
  CREATE_NFT_MODEL,
  MINT_NFT,
  GET_NFT,
  TRANSFER_NFT
};
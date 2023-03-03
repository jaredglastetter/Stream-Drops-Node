const NFTFragment = `
    blockchainId
    blockchainState
    id
    metadata
    modelId
    saleState
    serialNumber
    status
`

const NFTListingFragment = `

`

const NFTSetFragment = `

`

const NFTContentFragment = `

`

const BlockchainTransactionFragment = `
    blockchain
    hash
    name
`

/* missing:
content {
        ${NFTContentFragment}
    }
 nftListings {
        ${NFTListingFragment}
    } 
     set {
        ${NFTSetFragment}
    }

*/
const NFTModelFragment = `
    attributes
    blockchainId
    
    createdAt
    description
    id
    metadata
    nfts {
        ${NFTFragment}
    }
    quantity
    quantityMinted
    rarity
    state
    status
    title
    updatedAt
`

const WalletFragment = `
  address
  attributes
  createdAt
  id
  nfts {
    ${NFTFragment}
  }
  state
  updatedAt
  verificationCode
  walletType
`

module.exports = {
    NFTFragment,
    BlockchainTransactionFragment,
    NFTModelFragment,
    WalletFragment
}
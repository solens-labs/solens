const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  symbol: {type: String},
  mint: {type: String, require: true},
  owner: {type: String},
  new_owner: {type: String},
  escrow: {type: String},
  bidder: {type: String},
  price: {type: Number},
  date: {type: Date, require: true},
  marketplace: {
    type: String,
    require: true,
    enum: [
      'solanart',
      'magiceden',
      'digitaleyes',
      'solsea',
      'alphaart',
      'smb'
    ]
  },
  type:
  {
    type: String,
    require: true,
    enum: [
      'list',
      'cancel',
      'update',
      'buy',
      'offer',
      'cancel_offer',
      'accept_offer'
    ]
  },
  tx: {type: String, require: true, unique: true, index: true},
})

// for getting live floor, listings, topNFTs for a symbol
transactionSchema.index({ 'symbol': 1, 'type': 1, 'date': -1, 'price': -1 } )

// for getting topNFTs of the entire market
transactionSchema.index({ 'type': 1, 'price': -1 } )

// for getting mint history
transactionSchema.index({ 'mint': 1, 'type': 1, 'date': -1} )

// for getting wallet history
transactionSchema.index({ 'owner': 1, 'type': 1, 'date': -1} )
transactionSchema.index({ 'new_owner': 1, 'type': 1, 'date': -1} )

module.exports = mongoose.model('Transaction', transactionSchema)

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
  historical: {type: Boolean, default: false},
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
  tx: {type: String, require: true},
  ix: {type: Number}
})

// for getting live floor, listings
transactionSchema.index({ 'symbol': 1, 'type': 1, 'date': -1, 'price': -1 } )
// transactionSchema.index({ 'historical': 1, 'symbol': 1, 'type': 1, 'date': -1, 'price': -1 } )
// transactionSchema.index({ 'historical': 1, 'symbol': 1, 'type': 1, 'mint': 1, 'date': -1, 'price': -1 } )

// for getting topNFTs
transactionSchema.index({ 'symbol': 1, 'type': 1, 'price': -1, 'date': -1} )
transactionSchema.index({ 'type': 1, 'price': -1, 'date': -1} )

// for getting mint history
transactionSchema.index({ 'mint': 1, 'type': 1, 'date': -1} )

// for getting wallet history
transactionSchema.index({ 'owner': 1, 'type': 1, 'date': -1} )
transactionSchema.index({ 'new_owner': 1, 'type': 1, 'date': -1} )

// tx uniqueness
transactionSchema.index({ 'tx': 1, 'ix': 1}, {unique: true})


module.exports = mongoose.model('Transaction', transactionSchema)

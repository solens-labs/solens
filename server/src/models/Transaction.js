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
      'buy',
      'offer',
      'cancel_offer'
    ]
  },
  subtype:
  {
    type: String,
    enum: [
      'update',
      'accept_offer'
    ]
  },
  tx: {type: String, require: true},
  ix: {type: Number},
  version: {type: Number},
})

// for getting listings
transactionSchema.index({ 'mint': 1, 'date': -1} ) // For individual mint listing stats
transactionSchema.index({ 'symbol': 1}, { partialFilterExpression: { type: 'list', historical: false }, name: 'symbol_1_type_list_historical_false'})

// for getting listings
transactionSchema.index({ 'symbol': 1, price: 1}, { partialFilterExpression: { type: 'list', historical: false }, name: 'symbol_1_price_1_type_list_historical_false'})

// for getting topNFTs
transactionSchema.index({ 'symbol': 1, 'price': -1, 'date': -1}, { partialFilterExpression: { type: 'buy' }, name: 'symbol_1_price_-1_date_-1_type_buy'})
transactionSchema.index({ 'price': -1, 'date': -1}, { partialFilterExpression: { type: 'buy' }, name: 'price_-1_date_-1_type_buy'})

// for recentCollectionActivity
transactionSchema.index({ 'symbol': 1, 'date': -1}, { partialFilterExpression: { type: 'buy' }, name: 'symbol_1_date_-1_type_buy'})

// for getting mint history
transactionSchema.index({ 'mint': 1, 'date': -1} )

// for getting wallet history
transactionSchema.index({ 'owner': 1, 'date': -1}, { partialFilterExpression: { type: 'buy' }, name: 'owner_1_date_-1_type_buy'})
transactionSchema.index({ 'new_owner': 1, 'date': -1}, { partialFilterExpression: { type: 'buy' }, name: 'new_owner_1_date_-1_type_buy'})

// tx uniqueness
transactionSchema.index({ 'tx': 1, 'ix': 1}, {unique: true})

// for tx_historical trigger
transactionSchema.index({ 'mint': 1, 'date': -1}, { partialFilterExpression: { historical: false }, name: "mint_1_date_-1_historical_false"})

// for historical floors
transactionSchema.index({ 'symbol': 1 })


module.exports = mongoose.model('Transaction', transactionSchema)

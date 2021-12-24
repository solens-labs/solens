const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  symbol: {type: String, index: true},
  mint: {type: String, require: true, index: true},
  owner: {type: String, require: true, index: true},
  new_owner: {type: String, index: true},
  bidder: {type: String},
  price: {type: Number},
  date: {type: Date, require: true, index: true},
  marketplace: {
    type: String,
    enum: [
      'solanart',
      'magiceden',
      'digitaleyes',
      'solsea',
      'alphaart',
    ]
  },
  type:
  {
    type: String,
    enum: [
      'list',
      'cancel',
      'update',
      'buy',
      'offer',
      'cancel_offer',
      'accept_offer'
    ],
    require: true
  },
  tx: {type: String, require: true, unique: true},
})

module.exports = mongoose.model('Transaction', transactionSchema)

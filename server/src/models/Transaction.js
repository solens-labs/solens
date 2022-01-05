const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  symbol: {type: String, index: true},
  mint: {type: String, require: true, index: true},
  owner: {type: String, index: true},
  new_owner: {type: String, index: true},
  bidder: {type: String},
  price: {type: Number},
  date: {type: Date, require: true, index: true},
  marketplace: {
    type: String,
    index: true,
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
  tx: {type: String, require: true, unique: true},
})

module.exports = mongoose.model('Transaction', transactionSchema)

const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
  wallet: {type: String, require: true},
  symbol: {type: String, require: true},
  type: {
    type: String,
    require: true,
    enum: [ 'buyer', 'seller' ]
  },
  count: {type: Number, require: true},
  volume: {type: Number, require: true},
  min: {type: Number, require: true},
  max: {type: Number, require: true},
  avg: {type: Number}
})

walletSchema.index(
  {
    'symbol': 1,
    'type': 1,
    'volume': -1,
    'count': -1,
  }
)

walletSchema.index(
  {
    'wallet': 1,
    'symbol': 1,
    'type': 1
  },
  { unique: true },
)

module.exports = mongoose.model('Wallets', walletSchema)

const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
  symbol: {type: String, require: true, index: true, unique: true},
  name: {type: String, require: true},
  image: {type: String, require: true},
  description: {type: String, require: true},
  candyMachineIds: { 
    type: 'array',
    items: { type: 'string', uniqueItems: true },
    require: true
  },
  updateAuthorities: { 
    type: 'array',
    items: { type: 'string', uniqueItems: true },
    require: true
  },
  mint: { 
    type: 'array',
    items: { type: 'string', uniqueItems: true , index: true},
    require: true
  },
  supply: { type: Number },
  createdAt: {type: String},
  website: {type: String},
  twitter: {type: String},
  discord: {type: String},
  floor: { type: Number },
  floor_marketplace: {type: String},
  total_volume: { type: Number },
  weekly_volume: { type: Number },
  daily_volume: { type: Number },
  past_day_volume: { type: Number }
})

module.exports = mongoose.model('Collection', collectionSchema)

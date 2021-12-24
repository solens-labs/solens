const mongoose = require('mongoose')

const allTimeStatsSchema = new mongoose.Schema({
  symbol: {type: String, require: true, index: true},
  marketplace: {type: String, require: true},
  count: {type: Number, require: true},
  volume: {type: Number, require: true},
  min: {type: Number, require: true},
  max: {type: Number, require: true},
  avg: {type: Number, require: true},
})

allTimeStatsSchema.index({ symbol: 1, marketplace: 1 }, { unique: true })

module.exports = mongoose.model('AllTimeStats', allTimeStatsSchema)

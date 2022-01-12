const mongoose = require('mongoose')

const dailyStatsSchema = new mongoose.Schema({
  symbol: {type: String, require: true, index: true},
  marketplace: {type: String, require: true},
  start: {type: Date, require: true},
  end: {type: Date, require: true},
  count: {type: Number, require: true},
  volume: {type: Number, require: true},
  min: {type: Number, require: true},
  max: {type: Number, require: true},
  avg: {type: Number, require: true},
})

dailyStatsSchema.index({ symbol: 1, start: 1, marketplace: 1 }, { unique: true })

module.exports = mongoose.model('DailyStats', dailyStatsSchema)

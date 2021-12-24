const mongoose = require('mongoose')

const hourlyStatsSchema = new mongoose.Schema({
  symbol: {type: String, require: true, index: true},
  marketplace: {type: String, require: true},
  start: {type: Date, require: true, index: true},
  end: {type: Date, require: true},
  count: {type: Number, require: true},
  volume: {type: Number, require: true},
  min: {type: Number, require: true},
  max: {type: Number, require: true},
  avg: {type: Number, require: true},
  tx: { 
    type: 'array',
    items: { type: 'string', uniqueItems: true },
    require: true
  },
})

hourlyStatsSchema.index({ symbol: 1, start: 1, marketplace: 1 }, { unique: true })

module.exports = mongoose.model('HourlyStats', hourlyStatsSchema)

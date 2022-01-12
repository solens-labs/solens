const mongoose = require('mongoose')

const floorSchema = new mongoose.Schema({
  symbol: {type: String, require: true},
  date: {type: Date, require: true},
  floor: {type: Number, require: true},
  marketplace: {type: String, require: true},
})

floorSchema.index({ symbol: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('Floor', floorSchema)

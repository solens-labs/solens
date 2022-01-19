const mongoose = require('mongoose')

const statusSchema = new mongoose.Schema({
  live: {type: Boolean, index: true},
})

module.exports = mongoose.model('Status', statusSchema)

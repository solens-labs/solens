const boom = require('@hapi/boom')

const AllTimeStats = require('../models/AllTimeStats')

// Get all allTimeStatss
exports.getAllTimeStats = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entries = await AllTimeStats.find(data)
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Add new allTimeStats entries
exports.addAllTimeStats = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entry = new AllTimeStats(data)
    return entry.save()
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Delete a allTimeStats entry
exports.deleteAllTimeStats = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entry = await AllTimeStats.findOneAndRemove(data)
    return entry
  } catch (err) {
    throw boom.boomify(err)
  }
}

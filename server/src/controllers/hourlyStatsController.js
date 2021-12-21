const boom = require('@hapi/boom')

const HourlyStats = require('../models/HourlyStats')

// Get all hourlyStatss
exports.getHourlyStats = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entries = await HourlyStats.find(data)
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Add new hourlyStats entries
exports.addHourlyStats = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entry = new HourlyStats(data)
    return entry.save()
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Delete a hourlyStats entry
exports.deleteHourlyStats = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entry = await HourlyStats.findOneAndRemove(data)
    return entry
  } catch (err) {
    throw boom.boomify(err)
  }
}

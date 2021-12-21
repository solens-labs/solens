const boom = require('@hapi/boom')

const DailyStats = require('../models/DailyStats')

// Get all dailyStatss
exports.getDailyStats = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entries = await DailyStats.find(data)
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Add new dailyStats entries
exports.addDailyStats = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entry = new DailyStats(data)
    return entry.save()
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Delete a dailyStats entry
exports.deleteDailyStats = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entry = await DailyStats.findOneAndRemove(data)
    return entry
  } catch (err) {
    throw boom.boomify(err)
  }
}

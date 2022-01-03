const boom = require('@hapi/boom')

const Floor = require('../models/Floor')

exports.getFloor = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entries = await Floor.find(data)
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.addFloor = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entry = new Floor(data)
    return entry.save()
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.updateFloor = async (req, reply) => {
  try {
    const { ...data } = req.body

    const entry = Floor.findOneAndUpdate(
      {symbol: data.symbol},
      data,
      {
        upsert: true,
        returnNewDocument: true
      }
    )
    return entry
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.deleteFloor = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entry = await Floor.findOneAndRemove(data)
    return entry
  } catch (err) {
    throw boom.boomify(err)
  }
}

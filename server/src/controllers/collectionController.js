const boom = require('@hapi/boom')

const Collection = require('../models/Collection')

exports.getCollection = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entries = await Collection.find(data)
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.getSymbolFromMint = async (req, reply) => {
  try {
    const mint = req.params.mint
    const entries = await Collection.findOne({mint}, {_id: 0, symbol: 1})
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.addCollection = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entry = new Collection(data)
    return entry.save()
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.updateCollection = async (req, reply) => {
  try {
    const { ...data } = req.body

    const entry = Collection.findOneAndUpdate(
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

exports.deleteCollection = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entry = await Collection.findOneAndRemove(data)
    return entry
  } catch (err) {
    throw boom.boomify(err)
  }
}

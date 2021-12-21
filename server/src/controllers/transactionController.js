const boom = require('@hapi/boom')

const Transaction = require('../models/Transaction')

// Get all transactions
exports.getTransaction = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entries = await Transaction.find(data)
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Add new transaction entries
exports.addTransaction = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entry = new Transaction(data)
    return entry.save()
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.updateTransaction = async (req, reply) => {
  try {
    const { ...data } = req.body

    const entry = Transaction.findOneAndUpdate(
      {tx: data.tx},
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

// Delete a transaction entry
exports.deleteTransaction = async (req, reply) => {
  try {
    const { ...data } = req.body
    const entry = await Transaction.findOneAndRemove(data)
    return entry
  } catch (err) {
    throw boom.boomify(err)
  }
}

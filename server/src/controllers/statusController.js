const boom = require('@hapi/boom')

const Status = require('../models/Status')

exports.updateStatus = async (req, reply) => {
  try {
    return Status.findOneAndUpdate({}, {$set: {live: req.body.live}})
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.getStatus = async (req, reply) => {
  try {
    return Status.findOne({}, {_id: 0, live: 1})
  } catch (err) {
    throw boom.boomify(err)
  }
}
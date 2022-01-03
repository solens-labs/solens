const boom = require('@hapi/boom')
const _ = require('lodash')

const Transaction = require('../models/Transaction')
const Collection = require('../models/Collection')
const HourlyStats = require('../models/HourlyStats')
const DailyStats = require('../models/DailyStats')
const Floor = require('../models/Floor')
const AllTimeStats = require('../models/AllTimeStats')

const helpers = require('./helpers')

exports.dailyStats = async (req, reply) => {
  try {
    const { ...query } = req.query
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - query.days);

    const entries = DailyStats.aggregate([
      { $match: {
        start: { $gte: startDate },
        symbol: query.symbol
      } },
      { $sort: { start: 1 } },
      { $addFields: {
        date: '$start'
      }},
      { $project : {
        _id: 0,
        start: 0,
        symbol: 0,
        end: 0,
        tx: 0
      }}
    ])
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.hourlyStats = async (req, reply) => {
  try {
    const { ...query } = req.query
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - query.days);

    const entries = HourlyStats.aggregate([
      { $match: {
        start: { $gte: startDate },
        symbol: query.symbol
      } },
      { $sort: { start: 1 } },
      { $addFields: {
        date: '$start'
      }},
      { $project : {
        _id: 0,
        start: 0,
        symbol: 0,
        end: 0,
        tx: 0
      }}
    ])
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.marketStats = async (req, reply) => {
  try {
    const { ...query } = req.query
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - query.days);

    const entries = DailyStats.aggregate([
      { $match: {
        start: { $gte: startDate },
      } },
      { $group:
        {
          _id: {date: "$start"},
          volume: { $sum: "$volume"},
          count: { $sum: "$count" },
        },
      },
      { $project:
        {
          date: "$_id.date",
          volume: { $round: ["$volume", 2] },
          count: 1,
          _id: 0,
        }
      },
      { $sort: { date: 1 } },
    ])
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.allCollections = async (req, reply) => {
  try {
    const entries = await Collection.aggregate([
      helpers.lookupAggregatedStats('alltimestats'),
      { $addFields: {
        total_volume: {$round: [{$sum: '$alltimestats.volume'}, 2]},
      }},

      helpers.lookupAggregatedStats('dailystats', days = 14),
      { $addFields: {
        weekly_volume: {$round: [{$sum: '$dailystats.volume'}, 2]},
      }},

      helpers.lookupAggregatedStats('hourlystats'),
      { $addFields: {
        daily_volume: {$round: [{$sum: '$hourlystats.volume'}, 2]},
      }},

      helpers.lookupAggregatedStats('hourlystats', days = 2, skip = 1, 'pastdaystats'),
      { $addFields: {
        past_day_volume: {$round: [{$sum: '$pastdaystats.volume'}, 2]},
      }},

      { $project: {
        mint: 0,
        candyMachineIds: 0,
        updateAuthorities: 0,
        alltimestats: 0,
        dailystats: 0,
        hourlystats: 0,
        pastdaystats: 0,
        __v: 0,
        _id: 0
      }}
    ])
    return _.sortBy(entries, ['total_volume']).reverse()
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.collection = async (req, reply) => {
  try {
    
    let project = { 
      $project: {
        candyMachineIds: 0,
        updateAuthorities: 0,
        __v: 0,
        _id: 0
      }
    }

    if (!req.query.mint) {
      project.$project.mint = 0
    }

    const entries = await Collection.aggregate([
      { $match: {
        symbol: req.query.symbol,
      }},

      helpers.lookupAggregatedStats('alltimestats'),
      helpers.lookupAggregatedStats('dailystats', days = 365),
      project
    ])
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.topTrades = async (req, reply) => {
  try {
    const { ...query } = req.query
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - query.days);

    let match = { $match: {
      date: { $gte: startDate },
      ...helpers.matchBuyTxs(),
    } }
    if (query.symbol) {
      match.$match.symbol = query.symbol
    }

    const entries = Transaction.aggregate([
      match,
      { $sort: { price: -1} },
      { $limit: 100 },
      { $project:
        {
          seller : "$owner",
          buyer: "$new_owner",
          date: 1,
          symbol: 1,
          price: { $round: ["$price", 2] },
          mint: 1,
          _id: 0
        }
      }
    ])
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.topTraders = async (req, reply) => {
  try {
    const { ...query } = req.query
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - query.days);

    let match = { $match: {
      date: { $gte: startDate },
      ...helpers.matchBuyTxs(),
    } }
    if (query.symbol) {
      match.$match.symbol = query.symbol
    }
    let key = 'new_owner'
    if (query.type == 'sellers') {
      key = 'owner'
    }

    let accounts = await Transaction.aggregate([
      match,
      { $sort: {price: -1} },
      { $limit: 1000 },
      { $group: {
        _id: {account: `$${key}`}
      } },
      { $project: {
        account: "$_id.account",
        _id: 0,
      } }
    ])
    accounts = accounts.map(acc => acc.account)

    const entries = Transaction.aggregate([
      match,
      {$match: {
        [key]: {$in: accounts}
      }},
      helpers.groupTxStats(id = key),
      { $sort: { [query.sortBy]: -1} },
      { $limit: 25 },
      helpers.projectTxStats(id = key, idProjection = 'account'),
      { $project : { _id: 0 } }
    ],
    {allowDiskUse: true})
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.topNFTs = async (req, reply) => {
  try {
    const { ...query } = req.query
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - query.days);

    let match = { $match: {
      date: { $gte: startDate },
      ...helpers.matchBuyTxs(),
    } }
    if (query.symbol) {
      match.$match.symbol = query.symbol
    }

    const entries = await Transaction.aggregate([
      match,
      { $sort: {price: -1} },
      { $limit: 10000 },
      helpers.groupTxStats(id = 'mint'),
      { $sort: { [query.sortBy]: -1} },
      { $limit: 100 },
      helpers.projectTxStats(id = 'mint', idProjection = 'mint'),
      { $project : { _id: 0 } }
    ])
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.floor = async (req, reply) => {
  try {
    const { ...query } = req.query
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - query.days);

    console.log(query)
    return Floor.aggregate([
      {$match: {
        symbol: query.symbol,
        date: { $gte: startDate }
      }},
      {$addFields: {
        day: {$dayOfMonth: "$date"},
        month: {$month: "$date"},
        year: {$year: "$date"}
      }},
      { $group:
        {
          _id : {day: "$day", month: "$month", year: "$year"},
          floor: { $min: "$floor" }
        }
      },
      { $project:
        {
          _id : 0,
          date: {$dateFromParts: {day: "$_id.day", month: "$_id.month", year: "$_id.year"}},
          floor: 1
        }
      },
      {$sort: {
        date: 1
      }}
    ])
  } catch (err) {
    throw boom.boomify(err)
  }
}

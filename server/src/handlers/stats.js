const boom = require('@hapi/boom')
const _ = require('lodash')

const Transaction = require('../models/Transaction')
const Collection = require('../models/Collection')
const HourlyStats = require('../models/HourlyStats')
const DailyStats = require('../models/DailyStats')
const Wallets = require('../models/Wallets')
const DailyWallets = require('../models/DailyWallets')
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

// indexes used: symbol_1_date_-1_type_buy
exports.recentCollectionActivity = async (req, reply) => {
  try {
    return Transaction.aggregate([
      { $match: {
        symbol: req.query.symbol,
        type: "buy",
      } },
      {$sort: {date: -1}},
      { $project:
        {
          type: helpers.projectTypes(),
          price: 1,
          date: 1,
          owner: 1,
          new_owner: 1,
          mint: 1,
          marketplace: 1,
          tx: 1,
          _id: 0,
        }
      },
      { $limit: 100 },
    ])
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
      helpers.lookupAggregatedStats('dailystats', days = 14),
      project
    ])
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

// indexes used: symbol_1_price_-1_date_-1_type_buy
// indexes used: price_-1_date_-1_type_buy
exports.topNFTs = async (req, reply) => {
  try {
    const { ...query } = req.query
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - query.days);

    let match = { $match: {
      date: { $gte: startDate },
      type: "buy"
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

exports.symbol = async (req, reply) => {
  try {
    return Collection.findOne(
      {mint: req.query.mint},
      {symbol: 1, _id: 0}
    )
  } catch (err) {
    throw boom.boomify(err)
  }
}

// indexes used: mint_1_date_-1
exports.mintHistory = async (req, reply) => {
  try {
    const entries = Transaction.aggregate([
      { $match: {
        mint: req.query.mint,
      } },
      { $sort: { date: -1} },
      { $limit: 10 },
      { $project:
        {
          seller : "$owner",
          buyer: "$new_owner",
          date: 1,
          symbol: 1,
          type: helpers.projectTypes(),
          marketplace: helpers.projectMarketplaces(),
          escrow: 1,
          tx: 1,
          price: { $round: ["$price", 4] },
          _id: 0
        }
      }
    ])
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

// indexes used: new_owner_1_date_-1_type_buy
// indexes used: owner_1_date_-1_type_buy
exports.walletHistory = async (req, reply) => {
  try {
    const entries = Transaction.aggregate([
      { $match: {
        type: "buy",
        $and: [
          {$or: [
            {owner: req.query.wallet},
            {new_owner: req.query.wallet}
          ]}
        ]
      } },
      { $sort: { date: -1} },
      { $limit: 10 },
      { $project:
        {
          seller : "$owner",
          buyer: "$new_owner",
          date: 1,
          symbol: 1,
          mint: 1,
          tx: 1,
          marketplace: helpers.projectMarketplaces(),
          price: { $round: ["$price", 2] },
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
    const startDate = new Date()
    startDate.setUTCHours(0)
    startDate.setUTCMinutes(0)
    startDate.setUTCSeconds(0)
    startDate.setUTCMilliseconds(0)

    let DBCollection = Wallets

    let match = { $match: {
    } }
    if (!query.all_time) {
      DBCollection = DailyWallets
      match.$match.start = startDate
    }
    if (query.symbol) {
      match.$match.symbol = query.symbol
    } else {
      match.$match.symbol = 'all'
    }
    if (query.type == 'buyers') {
      match.$match.type = 'buyer'
    } else {
      match.$match.type = 'seller'
    }
    return DBCollection.aggregate([
      match,
      { $sort: { [query.sortBy]: -1} },
      { $limit: 25 },
      { $project:
        {
          volume: { $round: ["$volume", 2] },
          min: { $round: ["$min", 2] },
          max: { $round: ["$max", 2] },
          avg: { $round: ["$avg", 2] },
          wallet: 1,
          symbol: 1,
          count: 1,
          _id: 0,
        }
      }
    ])
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.floor = async (req, reply) => {
  try {
    const { ...query } = req.query
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - query.days);

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

exports.totalMarketVolume = async (req, reply) => {
  return await Wallets.aggregate([
    {$match: {
      symbol: 'all'
    }},
    {$group : {
      _id: 0,
      volume: {$sum: '$volume'},
    }},
    {$project:{
      _id : 0
    }}
  ])
}


// indexes used: mint_1_date_-1
// indexes used: symbol_1_type_list_historical_false
exports.listings = async (req, reply) => {

  if (req.query.mint) {
    return Transaction.aggregate([
      {$match: {
        mint: req.query.mint,
      }},
      {$sort: { date: -1}},
      {$limit: 1},
      {$match: {
        historical: false,
        type: 'list'
      }},
      {$project : {
        symbol: 1,
        mint: 1,
        owner: 1,
        price: 1,
        escrow: 1,
        marketplace: helpers.projectMarketplaces(),
        _id: 0
      }}
    ])
  }

  return Transaction.aggregate([
    {$match: {
      symbol: req.query.symbol,
      historical: false,
      type: 'list'
    }},
    {$project : {
      mint: 1,
      owner: 1,
      price: 1,
      escrow: 1,
      marketplace: helpers.projectMarketplaces(),
      _id: 0
    }},
  ])
}

// indexes used: symbol_1_type_list_historical_false
exports.currentFloor = async (req, reply) => {
  return Transaction.aggregate([
    {$match: {
      symbol: req.query.symbol,
      historical: false,
      type: 'list'
    }},
    {$group : {
      _id: {marketplace: '$marketplace'},
      floor: {$min: '$price'},
    }},
    {$project : {
      marketplace: "$_id.marketplace",
      floor: 1,
      _id: 0
    }}
  ])
}

// indexes used: owner_1_type_list_historical_false
exports.walletListings = async (req, reply) => {
  return Transaction.aggregate([
    {$match: {
      owner: req.query.wallet,
      historical: false,
      type: 'list'
    }},
    {$project : {
      mint: 1,
      owner: 1,
      price: 1,
      escrow: 1,
      marketplace: helpers.projectMarketplaces(),
      _id: 0
    }},
  ])
}

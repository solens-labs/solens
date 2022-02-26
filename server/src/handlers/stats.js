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
    const startDate = new Date(query.from);

    const entries = await DailyStats.aggregate([
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
    return _.groupBy(entries, "marketplace")
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.hourlyStats = async (req, reply) => {
  try {
    const { ...query } = req.query
    const startDate = new Date(query.from);

    const entries = await HourlyStats.aggregate([
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
    return _.groupBy(entries, "marketplace")
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

// indexes used: symbol_1_price_-1_date_-1_type_buy
// indexes used: price_-1_date_-1_type_buy
exports.topNFTs = async (req, reply) => {
  try {
    const { ...query } = req.query
    const startDate = new Date(query.from);

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
          marketplace: 1,
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
      { $project:
        {
          seller : "$owner",
          buyer: "$new_owner",
          date: 1,
          symbol: 1,
          mint: 1,
          tx: 1,
          marketplace: 1,
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

exports.floor = async (req, reply) => {
  try {
    const { ...query } = req.query
    const startDate = new Date(query.from);

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
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 1)
  console.log(startDate)

  return await Transaction.aggregate([
    {$match: {
      date: {$gte: startDate},
      type: "buy"
    }},
    {$group : {
      _id: {marketplace: "$marketplace"},
      volume: {$sum: '$price'},
      count: {$sum: 1},
    }},
    {$project:{
      marketplace: "$_id.marketplace",
      volume: 1,
      count: 1,
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
        marketplace: 1,
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
      marketplace: 1,
      _id: 0
    }},
  ])
}

// exports.listings = async (req, reply) => {

//   if (req.query.mint) {
//     return Transaction.aggregate([
//       {$match: {
//         mint: req.query.mint,
//         historical: false,
//         ...helpers.matchMainTxs()
//       }},
//       {$sort: {mint: 1, date: -1}},
//       {$limit: 1},
//       {$match: {
//         $or: [
//           {type: { $eq: "list"}},
//           {type: { $eq: "update"}},
//         ]
//       }},
//       {$project : {
//         symbol: 1,
//         mint: 1,
//         owner: 1,
//         price: 1,
//         escrow: 1,
//         marketplace: 1,
//         _id: 0
//       }}
//     ])
//   }

//   return Transaction.aggregate([
//     {$match: {
//       symbol: req.query.symbol,
//       historical: false,
//       ...helpers.matchMainTxs()
//     }},
//     {$sort: {mint: 1, date: -1}},
//     {$group : {
//       _id: {mint: '$mint'},
//       owner: {$first: '$owner'},
//       price: {$first: '$price'},
//       type: {$first: '$type'},
//       marketplace: {$first: '$marketplace'}
//     }},
//     {$match: {
//       $or: [
//         {type: { $eq: "list"}},
//         {type: { $eq: "update"}},
//       ]
//     }},
//     {$project : {
//       mint: '$_id.mint',
//       owner: 1,
//       price: 1,
//       escrow: 1,
//       marketplace: 1,
//       _id: 0
//     }},
//   ])
// }

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
      marketplace: 1,
      _id: 0
    }},
  ])
}

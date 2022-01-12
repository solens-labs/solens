const boom = require('@hapi/boom')
const helpers = require('./helpers')

const Transaction = require('../models/Transaction')
const Wallets = require('../models/Wallets')
const DailyWallets = require('../models/DailyWallets')
const HourlyWallets = require('../models/HourlyWallets')
const Collection = require('../models/Collection')
const HourlyStats = require('../models/HourlyStats')
const DailyStats = require('../models/DailyStats')
const AllTimeStats = require('../models/AllTimeStats')

/**
 * Updates transaction symbols based on all the
 * available collections.
 **/
async function updateTransactions(symbol) {
  let txResults = []
  let mints = await Collection.findOne({symbol}, {mint: 1, _id: 0})
  console.log('Updating transactions: ', symbol)
  let updateResult = await Transaction.updateMany(
    {
      mint: mints.mint
    },
    [{$addFields: {symbol: symbol}}]
  )
  updateResult.symbol = symbol
  txResults.push(updateResult)

  return txResults
}

/**
 * Updates hourlystats for the given symbol.
 **/
async function updateHourlyStats(symbol) {
  console.log('Updating hourly stats:', symbol);
  await Transaction.aggregate([
    { $match: {
      symbol: symbol,
      ...helpers.matchBuyTxs()
    }},
    {$addFields: {
      hour: {$hour: "$date"},
      day: {$dayOfMonth: "$date"},
      month: {$month: "$date"},
      year: {$year: "$date"}
    }},
    { $group:
      {
        _id : {symbol: '$symbol', marketplace: '$marketplace', hour: "$hour", day: "$day", month: "$month", year: "$year"},
        volume: { $sum: "$price"},
        min: { $min: "$price" },
        max: { $max: "$price" },
        avg: { $avg: "$price" },
        tx: { $push: "$tx" },
        count: { $sum: 1 },
      }
    },
    {$addFields: {
      endHour: {$add: ["$_id.hour", 1]}
    }},
    { $project:
      {
        symbol : "$_id.symbol",
        marketplace: '$_id.marketplace',
        start: {$dateFromParts: {hour: "$_id.hour", day: "$_id.day", month: "$_id.month", year: "$_id.year"}},
        end: {$dateFromParts: {hour: "$endHour", day: "$_id.day", month: "$_id.month", year: "$_id.year"}},
        volume: { $round: ["$volume", 2] },
        min: { $round: ["$min", 2] },
        max: { $round: ["$max", 2] },
        avg: { $round: ["$avg", 2] },
        tx: 1,
        count: 1,
        _id: 0,
      }
    },
    { $merge: {
      into: "hourlystats",
      on: [ "start", "symbol", "marketplace" ],
      whenMatched: "replace",
      whenNotMatched: "insert"
    }}
  ]);

  return {}
}

/**
 * Updates dailystats for the given symbol.
 **/
async function updateDailyStats(symbol) {
  console.log('Updating daily stats:', symbol);
  await Transaction.aggregate([
    { $match: {
      symbol: symbol,
      ...helpers.matchBuyTxs()
    }},
    {$addFields: {
      day: {$dayOfMonth: "$date"},
      month: {$month: "$date"},
      year: {$year: "$date"}
    }},
    { $group:
      {
        _id : {symbol: '$symbol', marketplace: '$marketplace', day: "$day", month: "$month", year: "$year"},
        volume: { $sum: "$price"},
        min: { $min: "$price" },
        max: { $max: "$price" },
        avg: { $avg: "$price" },
        count: { $sum: 1 },
      }
    },
    {$addFields: {
      endDay: {$add: ["$_id.day", 1]}
    }},
    { $project:
      {
        symbol : "$_id.symbol",
        marketplace: '$_id.marketplace',
        start: {$dateFromParts: {day: "$_id.day", month: "$_id.month", year: "$_id.year"}},
        end: {$dateFromParts: {day: "$endDay", month: "$_id.month", year: "$_id.year"}},
        volume: { $round: ["$volume", 2] },
        min: { $round: ["$min", 2] },
        max: { $round: ["$max", 2] },
        avg: { $round: ["$avg", 2] },
        count: 1,
        _id: 0,
      }
    },
    { $merge: {
      into: "dailystats",
      on: [ "start", "symbol", "marketplace" ],
      whenMatched: "replace",
      whenNotMatched: "insert"
    }}
  ]);

  return {}
}

/**
 * Updates alltimestats for the given symbol.
 **/
async function updateAlltimeStats(symbol) {
  console.log('Updating alltime stats for:', symbol);
  await DailyStats.aggregate([
    { $match: {
      symbol: symbol
    }},
    { $group:
      {
        _id : {symbol: '$symbol', marketplace: '$marketplace'},
        volume: { $sum: "$volume"},
        min: { $min: "$min" },
        max: { $max: "$max" },
        count: { $sum: "$count" }
      }
    },
    { $addFields: {
      avg: { $divide: [ '$volume', '$count' ] }
    }},
    { $project:
      {
        symbol : "$_id.symbol",
        marketplace: '$_id.marketplace',
        volume: { $round: ["$volume", 2] },
        min: { $round: ["$min", 2] },
        max: { $round: ["$max", 2] },
        avg: { $round: ["$avg", 2] },
        count: 1,
        _id: 0
      }
    },
    { $merge: {
      into: "alltimestats",
      on: [ "symbol", "marketplace" ],
      whenMatched: "replace",
      whenNotMatched: "insert"
    }}
  ]);

  return {}
}

/**
 * Updates everything in the database for the query
 * symbol.
 * 
 * First, updates the transactions and adds the
 * right symbol based on collection mints.
 * Second, updates the daily and hourly tats.
 * Lastly, updates the alltime stats.
 * 
 * This function will take a while to finish.
 * This is especially the case if symbols is a long list.
 * 
 * This function overrides the existing symbols in
 * transactions. It also overrides the values in the
 * aggregated databases.
 **/
 exports.updateEverything = async (req, reply) => {
  // const symbols = await Collection.find({}, {symbol: 1, _id: 0})
  try {
    // const symbols = req.body.symbols
    let symbols = await Collection.find({}, {_id:0, symbol:1})
    symbols = symbols.map(x => x.symbol)
    console.log(symbols)
    for (let i = 0; i < symbols.length; i++) {
      // await updateTransactions(symbols[i])
      await updateHourlyStats(symbols[i])
      await updateDailyStats(symbols[i])
      await updateAlltimeStats(symbols[i]) 
    }
    return true
  } catch (err) {
    throw boom.boomify(err)
  }
}


// exports.updateWallets = async (req, reply) => {
//   const entries = await Transaction.aggregate([
//     {$match:{
//       ...helpers.matchBuyTxs(),
//       // date: {$gte: new Date('2022-01-07')},
//       symbol: {$exists: true}
//     }},
//     { $group:
//       {
//         _id : {symbol: '$symbol', wallet: '$owner'}, // owner
//         volume: { $sum: "$price"},
//         min: { $min: "$price" },
//         max: { $max: "$price" },
//         avg: { $avg: "$price" },
//         count: { $sum: 1 }
//       }
//     },
//     {$project: {
//       'wallet': '$_id.wallet',
//       'symbol': '$_id.symbol',
//       'type': 'seller', // seller
//       'volume': 1,
//       'count': 1,
//       'min': 1,
//       'max': 1,
//       'avg': 1,
//       _id: 0
//     }},
//     { $merge: {
//       into: "wallets",
//       on: [ "wallet", "symbol", "type" ],
//       let: {
//         volume: "$volume",
//         count: "$count",
//         min: "$min",
//         max: "$max"
//       },
//       whenMatched: [
//         { $set:
//           {
//             'volume': {$sum: ['$volume', '$$volume'] }
//           }
//         },
//         { $set:
//           {
//             'count': {$sum: ['$count', '$$count'] }
//           }
//         },
//         { $set:
//           {
//             'min': {$min: ['$min', '$$min'] }
//           }
//         },
//         { $set:
//           {
//             'max': {$max: ['$max', '$$max'] }
//           }
//         },
//         { $set: 
//           {
//             'avg': { $divide: ['$volume', '$count'] }
//           }
//         },
//       ],
//       whenNotMatched: "insert"
//     }}
//   ],
//   {allowDiskUse: true})
//   return entries
// }

// exports.updateMarketWallet = async (req, reply) => {
//   const entries = await Transaction.aggregate([
//     {$match:{
//       ...helpers.matchBuyTxs(),
//     }},
//     { $group:
//       {
//         _id : {wallet: '$owner'}, // owner
//         volume: { $sum: "$price"},
//         min: { $min: "$price" },
//         max: { $max: "$price" },
//         avg: { $avg: "$price" },
//         count: { $sum: 1 }
//       }
//     },
//     {$project: {
//       'wallet': '$_id.wallet',
//       'symbol': 'all',
//       'type': 'seller', // seller
//       'volume': 1,
//       'count': 1,
//       'min': 1,
//       'max': 1,
//       'avg': 1,
//       _id: 0
//     }},
//     { $merge: {
//       into: "wallets",
//       on: [ "wallet", "symbol", "type" ],
//       let: {
//         volume: "$volume",
//         count: "$count",
//         min: "$min",
//         max: "$max"
//       },
//       whenMatched: [
//         { $set:
//           {
//             'volume': {$sum: ['$volume', '$$volume'] }
//           }
//         },
//         { $set:
//           {
//             'count': {$sum: ['$count', '$$count'] }
//           }
//         },
//         { $set:
//           {
//             'min': {$min: ['$min', '$$min'] }
//           }
//         },
//         { $set:
//           {
//             'max': {$max: ['$max', '$$max'] }
//           }
//         },
//         { $set: 
//           {
//             'avg': { $divide: ['$volume', '$count'] }
//           }
//         },
//       ],
//       whenNotMatched: "insert"
//     }}
//   ],
//   {allowDiskUse: true})
//   return entries
// }

// exports.updateHourlyWallets = async (req, reply) => {
//   const entries = await Transaction.aggregate([
//     {$match:{
//       ...helpers.matchBuyTxs(),
//       // date: {$gte: new Date('2022-01-07')},
//       symbol: {$exists: true}
//     }},
//     {$addFields: {
//       hour: {$hour: "$date"},
//       day: {$dayOfMonth: "$date"},
//       month: {$month: "$date"},
//       year: {$year: "$date"}
//     }},
//     { $group:
//       {
//         // change wallet
//         _id : {symbol: '$symbol', wallet: '$owner', hour: "$hour", day: "$day", month: "$month", year: "$year"},
//         volume: { $sum: "$price"},
//         min: { $min: "$price" },
//         max: { $max: "$price" },
//         avg: { $avg: "$price" },
//         count: { $sum: 1 }
//       }
//     },
//     {$addFields: {
//       endHour: {$add: ["$_id.hour", 1]}
//     }},
//     {$project: {
//       'wallet': '$_id.wallet',
//       'symbol': '$_id.symbol',
//       'start': {$dateFromParts: {hour: "$_id.hour", day: "$_id.day", month: "$_id.month", year: "$_id.year"}},
//       'end': {$dateFromParts: {hour: "$endHour", day: "$_id.day", month: "$_id.month", year: "$_id.year"}},
//       'type': 'seller', // change buyer seller
//       'volume': 1,
//       'count': 1,
//       'min': 1,
//       'max': 1,
//       'avg': 1,
//       _id: 0
//     }},
//     { $merge: {
//       into: "hourlywallets", // changedaily hourlywallets
//       on: [ "wallet", "symbol", "type", "start" ],
//       let: {
//         volume: "$volume",
//         count: "$count",
//         min: "$min",
//         max: "$max"
//       },
//       whenMatched: [
//         { $set:
//           {
//             'volume': {$sum: ['$volume', '$$volume'] }
//           }
//         },
//         { $set:
//           {
//             'count': {$sum: ['$count', '$$count'] }
//           }
//         },
//         { $set:
//           {
//             'min': {$min: ['$min', '$$min'] }
//           }
//         },
//         { $set:
//           {
//             'max': {$max: ['$max', '$$max'] }
//           }
//         },
//         { $set: 
//           {
//             'avg': { $divide: ['$volume', '$count'] }
//           }
//         },
//       ],
//       whenNotMatched: "insert"
//     }}
//   ],
//   {allowDiskUse: true})
//   return entries
// }

// exports.updateHourlyMarketWallets = async (req, reply) => {
//   const entries = await Transaction.aggregate([
//     {$match:{
//       ...helpers.matchBuyTxs(),
//     }},
//     {$addFields: {
//       hour: {$hour: "$date"},
//       day: {$dayOfMonth: "$date"},
//       month: {$month: "$date"},
//       year: {$year: "$date"}
//     }},
//     { $group:
//       {
//         // change wallet
//         _id : {wallet: '$new_owner', hour: "$hour", day: "$day", month: "$month", year: "$year"},
//         volume: { $sum: "$price"},
//         min: { $min: "$price" },
//         max: { $max: "$price" },
//         avg: { $avg: "$price" },
//         count: { $sum: 1 }
//       }
//     },
//     {$addFields: {
//       endHour: {$add: ["$_id.hour", 1]}
//     }},
//     {$project: {
//       'wallet': '$_id.wallet',
//       'symbol': 'all',
//       'start': {$dateFromParts: {hour: "$_id.hour", day: "$_id.day", month: "$_id.month", year: "$_id.year"}},
//       'end': {$dateFromParts: {hour: "$endHour", day: "$_id.day", month: "$_id.month", year: "$_id.year"}},
//       'type': 'buyer', // change buyer seller
//       'volume': 1,
//       'count': 1,
//       'min': 1,
//       'max': 1,
//       'avg': 1,
//       _id: 0
//     }},
//     { $merge: {
//       into: "hourlywallets", // changedaily hourlywallets
//       on: [ "wallet", "symbol", "type", "start" ],
//       let: {
//         volume: "$volume",
//         count: "$count",
//         min: "$min",
//         max: "$max"
//       },
//       whenMatched: [
//         { $set:
//           {
//             'volume': {$sum: ['$volume', '$$volume'] }
//           }
//         },
//         { $set:
//           {
//             'count': {$sum: ['$count', '$$count'] }
//           }
//         },
//         { $set:
//           {
//             'min': {$min: ['$min', '$$min'] }
//           }
//         },
//         { $set:
//           {
//             'max': {$max: ['$max', '$$max'] }
//           }
//         },
//         { $set: 
//           {
//             'avg': { $divide: ['$volume', '$count'] }
//           }
//         },
//       ],
//       whenNotMatched: "insert"
//     }}
//   ],
//   {allowDiskUse: true})
//   return entries
// }

// exports.updateDailyWallets = async (req, reply) => {
//   const entries = await Transaction.aggregate([
//     {$match:{
//       ...helpers.matchBuyTxs(),
//       // date: {$gte: new Date('2022-01-07')},
//       symbol: {$exists: true}
//     }},
//     {$addFields: {
//       day: {$dayOfMonth: "$date"},
//       month: {$month: "$date"},
//       year: {$year: "$date"}
//     }},
//     { $group:
//       {
//         // change wallet
//         _id : {symbol: '$symbol', wallet: '$owner', day: "$day", month: "$month", year: "$year"},
//         volume: { $sum: "$price"},
//         min: { $min: "$price" },
//         max: { $max: "$price" },
//         avg: { $avg: "$price" },
//         count: { $sum: 1 }
//       }
//     },
//     {$addFields: {
//       endDay: {$add: ["$_id.day", 1]}
//     }},
//     {$project: {
//       'wallet': '$_id.wallet',
//       'symbol': '$_id.symbol',
//       'start': {$dateFromParts: {day: "$_id.day", month: "$_id.month", year: "$_id.year"}},
//       'end': {$dateFromParts: {day: "$endDay", month: "$_id.month", year: "$_id.year"}},
//       'type': 'seller', // change buyer seller
//       'volume': 1,
//       'count': 1,
//       'min': 1,
//       'max': 1,
//       'avg': 1,
//       _id: 0
//     }},
//     { $merge: {
//       into: "dailywallets", // changedaily hourlywallets
//       on: [ "wallet", "symbol", "type", "start" ],
//       let: {
//         volume: "$volume",
//         count: "$count",
//         min: "$min",
//         max: "$max"
//       },
//       whenMatched: [
//         { $set:
//           {
//             'volume': {$sum: ['$volume', '$$volume'] }
//           }
//         },
//         { $set:
//           {
//             'count': {$sum: ['$count', '$$count'] }
//           }
//         },
//         { $set:
//           {
//             'min': {$min: ['$min', '$$min'] }
//           }
//         },
//         { $set:
//           {
//             'max': {$max: ['$max', '$$max'] }
//           }
//         },
//         { $set: 
//           {
//             'avg': { $divide: ['$volume', '$count'] }
//           }
//         },
//       ],
//       whenNotMatched: "insert"
//     }}
//   ],
//   {allowDiskUse: true})
//   return entries
// }

// exports.updateDailyMarketWallets = async (req, reply) => {
//   const entries = await Transaction.aggregate([
//     {$match:{
//       ...helpers.matchBuyTxs(),
//     }},
//     {$addFields: {
//       day: {$dayOfMonth: "$date"},
//       month: {$month: "$date"},
//       year: {$year: "$date"}
//     }},
//     { $group:
//       {
//         // change wallet
//         _id : {wallet: '$new_owner', day: "$day", month: "$month", year: "$year"},
//         volume: { $sum: "$price"},
//         min: { $min: "$price" },
//         max: { $max: "$price" },
//         avg: { $avg: "$price" },
//         count: { $sum: 1 }
//       }
//     },
//     {$addFields: {
//       endDay: {$add: ["$_id.day", 1]}
//     }},
//     {$project: {
//       'wallet': '$_id.wallet',
//       'symbol': 'all',
//       'start': {$dateFromParts: {day: "$_id.day", month: "$_id.month", year: "$_id.year"}},
//       'end': {$dateFromParts: {day: "$endDay", month: "$_id.month", year: "$_id.year"}},
//       'type': 'buyer', // change buyer seller
//       'volume': 1,
//       'count': 1,
//       'min': 1,
//       'max': 1,
//       'avg': 1,
//       _id: 0
//     }},
//     { $merge: {
//       into: "dailywallets", // changedaily hourlywallets
//       on: [ "wallet", "symbol", "type", "start" ],
//       let: {
//         volume: "$volume",
//         count: "$count",
//         min: "$min",
//         max: "$max"
//       },
//       whenMatched: [
//         { $set:
//           {
//             'volume': {$sum: ['$volume', '$$volume'] }
//           }
//         },
//         { $set:
//           {
//             'count': {$sum: ['$count', '$$count'] }
//           }
//         },
//         { $set:
//           {
//             'min': {$min: ['$min', '$$min'] }
//           }
//         },
//         { $set:
//           {
//             'max': {$max: ['$max', '$$max'] }
//           }
//         },
//         { $set: 
//           {
//             'avg': { $divide: ['$volume', '$count'] }
//           }
//         },
//       ],
//       whenNotMatched: "insert"
//     }}
//   ],
//   {allowDiskUse: true})
//   return entries
// }

// exports.test = async (req, reply) => {
//   const entries = await Wallets.aggregate([
//     {$match:{symbol: 'all', }},
//     {$sort: {volume: -1}},
//     {$limit: 10}
//   ])
//   return entries
// }

// exports.test = async (req, reply) => {
//   const entries = await Transaction.aggregate([
//     {$match:{
//       new_owner: 'HFPaT6WKk9SkwtYVZ5m5Sqw7ZbyehGu9GHjsctigm49S',
//       $and: [
//         {date: {$gte: new Date('2021-08-15T09:00:00.000Z')}},
//         {date: {$lt: new Date('2021-08-15T10:00:00.000Z')}},
//       ],
//       symbol: 'degenape'
//     }},
//     {$group: {
//       _id: 0,
//       count: {$sum: 1}
//     }}
//     // {$sort: {volume: -1}},
//     // {$limit: 10}
//   ])
//   return entries
// }

exports.test = async (req, reply) => {
  return await Wallets.aggregate([ 
    { $indexStats: { } },
    { $sort: {"accesses.ops": 1} }
  ])
}
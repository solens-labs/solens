const boom = require('@hapi/boom')
const helpers = require('./helpers')

const Transaction = require('../models/Transaction')
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
    const symbols = req.body.symbols
    
    for (let i = 0; i < symbols.length; i++) {
      await updateTransactions(symbols[i])
      await updateHourlyStats(symbols[i])
      await updateDailyStats(symbols[i])
      await updateAlltimeStats(symbols[i]) 
    }
    return true
  } catch (err) {
    throw boom.boomify(err)
  }
}

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
async function updateTransactions(symbol, startDate) {
  let txResults = []
  let mints = await Collection.findOne({symbol}, {mint: 1, _id: 0})
  console.log('Updating transactions for: ', symbol)
  let updateResult = await Transaction.updateMany(
    {
      $and: [
        {date: {$gte: startDate}},
        {mint: mints.mint}
      ]
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
async function updateHourlyStats(symbol, startDate) {
  const end = new Date(startDate);
  end.setUTCHours(1)
  end.setUTCMinutes(0)
  end.setUTCSeconds(0)
  end.setUTCMilliseconds(0)
  
  for (end; end <= new Date(); end.setHours(end.getHours() + 1)) {
    const start = new Date(end)
    start.setUTCHours(end.getUTCHours() - 1)
    start.setUTCMinutes(0)
    start.setUTCSeconds(0)
    start.setUTCMilliseconds(0)

    console.log('Updating hourly stats between:', start, end, symbol);
    await Transaction.aggregate([
      { $match: {
        symbol: symbol,
        $and: [
          {date: { $gte: start }},
          {date: { $lt: end }}
        ],
        ...helpers.matchBuyTxs()
      }},
      { $project : {
        _id: 0,
        tx: 1,
        price: 1,
        marketplace: 1,
        symbol: 1
      }},
      { $group:
        {
          _id : {symbol: '$symbol', marketplace: '$marketplace'},
          volume: { $sum: "$price"},
          min: { $min: "$price" },
          max: { $max: "$price" },
          avg: { $avg: "$price" },
          tx: { $push: "$tx" },
          count: { $sum: 1 },
        }
      },
      { $project:
        {
          symbol : "$_id.symbol",
          marketplace: '$_id.marketplace',
          volume: { $round: ["$volume", 2] },
          start: start,
          end: end,
          min: { $round: ["$min", 2] },
          max: { $round: ["$max", 2] },
          avg: { $round: ["$avg", 2] },
          tx: '$tx',
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
  }

  return {}
}

/**
 * Updates dailystats for the given symbol.
 **/
async function updateDailyStats(symbol, startDate) {
  const end = new Date(startDate);
  
  for (end; end <= new Date(); end.setDate(end.getDate() + 1)) {
    
    end.setUTCHours(0)
    end.setUTCMinutes(0)
    end.setUTCSeconds(0)
    end.setUTCMilliseconds(0)

    const start = new Date(end)
    start.setDate(end.getDate() - 1)
    start.setUTCHours(0)
    start.setUTCMinutes(0)
    start.setUTCSeconds(0)
    start.setUTCMilliseconds(0)

    console.log('Updating daily stats between:', start, end, symbol);
    await Transaction.aggregate([
      { $match: {
        symbol: symbol,
        $and: [
          {date: { $gte: start }},
          {date: { $lt: end }}
        ],
        ...helpers.matchBuyTxs()
      }},
      { $project : {
        _id: 0,
        tx: 1,
        price: 1,
        marketplace: 1,
        symbol: 1
      }},
      { $group:
        {
          _id : {symbol: '$symbol', marketplace: '$marketplace'},
          volume: { $sum: "$price"},
          min: { $min: "$price" },
          max: { $max: "$price" },
          avg: { $avg: "$price" },
          count: { $sum: 1 },
        }
      },
      { $project:
        {
          symbol : "$_id.symbol",
          marketplace: '$_id.marketplace',
          volume: { $round: ["$volume", 2] },
          start: start,
          end: end,
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
  }

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

async function getFirstTxDate(symbols) {
  let startDates = []
  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i]
    const date = await Transaction.aggregate([
      { $match: {
        symbol: symbol,
        ...helpers.matchBuyTxs()
      }},
      { $project : {
        _id: 0,
        date: 1
      }},
      {$sort: {date: 1}},
      {$limit: 1}
    ]);
    if (date.length) {
      startDates.push(new Date(date[0].date))
    } else {
      const newDate = new Date()
      newDate.setHours(newDate.getHours() - 1)
      startDates.push(newDate)
    }
  }
  return startDates
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
 * This is especially the case if startDate is not
 * specified.
 * 
 * This function overrides the existing symbols in
 * transactions. It also overrides the values in the
 * aggregated databases.
 **/
 async function updateEverything(req, reply) {
  // const symbols = await Collection.find({}, {symbol: 1, _id: 0})
  try {
    const symbols = req.body.symbols
    const startDates = await getFirstTxDate(symbols)
    
    for (let i = 0; i < symbols.length; i++) {
      let start = new Date(req.body.startDate)
      await updateTransactions(symbols[i], start)

      if (start < startDates[i]) {
        start = startDates[i]
      }
      await updateHourlyStats(symbols[i], start)
      await updateDailyStats(symbols[i], start)
      await updateAlltimeStats(symbols[i]) 
    }
    return true
  } catch (err) {
    throw boom.boomify(err)
  }
}

const getCollection = async (req, reply) => {
  try {
    console.log(req.query)
    const entries = await Collection.aggregate([
      { $match: {
        symbol: req.query.symbol,
      }}
    ])
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

module.exports = {
  updateEverything,
  updateTransactions,
  updateHourlyStats,
  updateDailyStats,
  updateAlltimeStats,
  getCollection
}
const boom = require('@hapi/boom')
const _ = require('lodash')

const Transaction = require('../models/Transaction')
const Collection = require('../models/Collection')
const HourlyStats = require('../models/HourlyStats')
const DailyStats = require('../models/DailyStats')
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
    console.log(req.query)
    const entries = await Collection.aggregate([
      { $match: {
        symbol: req.query.symbol,
      }},

      helpers.lookupAggregatedStats('alltimestats'),
      helpers.lookupAggregatedStats('dailystats', days = 14),
      helpers.lookupAggregatedStats('hourlystats', days = 2),

      { $project: {
        mint: 0,
        candyMachineIds: 0,
        updateAuthorities: 0,
        __v: 0,
        _id: 0
      }}
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

    const entries = Transaction.aggregate([
      match,
      helpers.groupTxStats(id = key),
      { $sort: { [query.sortBy]: -1} },
      { $limit: 100 },
      helpers.projectTxStats(id = key, idProjection = 'account'),
      { $project : { _id: 0 } }
    ])
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

// exports.test = async (req, reply) => {
//   try {
//     const symbol = req.params.symbol

//     const end = new Date(2021, 7, 1);
//     end.setUTCHours(0);
//     end.setUTCMinutes(0);
//     end.setUTCSeconds(0);
//     end.setUTCMilliseconds(0);
    
    
//     for (var endDate = end; endDate <= new Date(); endDate.setDate(endDate.getDate() + 1)) {
//       const startDate = new Date(endDate);
//       startDate.setDate(endDate.getDate() - 1);
//       console.log(startDate, endDate);

//       const entries = await Transaction.aggregate([
//         { $match: {
//           $or: [
//             {type: { $eq: "buy"}},
//             {type: { $eq: "accept_offer"}},
//           ],
//           $and: [
//             {date: { $gte: new Date('2021-12-1') }},
//             {date: { $lt: new Date('2021-12-1') }}
//           ]
//         }},
//         { $group:
//           {
//             _id : {mint: '$owner'},
//             volume: { $sum: "$price"},
//             count: { $sum: 1 },
//           }
//         },
//         { $sort: { volume: -1 } },
//         { $limit: 10 },  
//         { $project : {
//           mint: '$_id.mint',
//           volume: 1,
//           count: 1
//         }},
//         { $project : {
//           _id: 0,
//           __v: 0,
//         }}
//       ])
//     }
//   } catch (err) {
//     throw boom.boomify(err)
//   }
// }

// exports.test = async (req, reply) => {
//   try {

//     const entries = Transaction.aggregate([
//       { $match: {
//         $or: [
//           {type: { $eq: "buy"}},
//           {type: { $eq: "accept_offer"}},
//         ],
//         $and: [
//           {date: { $gte: new Date('2021-12-1') }},
//           {date: { $lt: new Date('2021-12-2') }}
//         ]
//       }},
//       { $group:
//         {
//           _id : {mint: '$mint' },
//           volume: { $sum: "$price" },
//           min: { $min: "$price" },
//           max: { $max: "$price" },
//           count: { $sum: 1 },
//           marketplace: "$marketplace"
//         }
//       },
//       { $sort: { volume: -1 } },
//       { $limit: 100 },  
//       { $project : {
//         mint: '$_id.mint',
//         volume: 1,
//         count: 1
//       }},
//       { $project : {
//         _id: 0,
//         __v: 0,
//       }}
//     ])
//     return entries
//   } catch (err) {
//     throw boom.boomify(err)
//   }
// }

// exports.test = async (req, reply) => {
//   try {

//     const startDate = new Date();
//   startDate.setUTCHours(0);
//   startDate.setUTCMinutes(0);
//   startDate.setUTCSeconds(0);
//   startDate.setUTCMilliseconds(0);
  
//   const endDate = new Date(startDate);
//   endDate.setDate(startDate.getDate() + 1);
//   endDate.setUTCHours(0);
//   endDate.setUTCMinutes(0);
//   endDate.setUTCSeconds(0);
//   endDate.setUTCMilliseconds(0);
  
//   console.log(startDate, endDate);
  
  
//   return Transaction.aggregate([
//     { $match: {
//       $and: [
//         {date: { $gte: startDate }},
//         // {date: { $lt: endDate }}
//       ],
//       $or: [
//         {type: { $eq: "buy"}},
//         {type: { $eq: "accept_offer"}},
//       ]
//     }},
//     { $lookup: {
//       from: 'collections',
//       localField: 'mint',
//       foreignField: 'mint',
//       as: 'collection',
//     }},
//     { $project : {
//       _id: 0,
//       price: 1,
//       marketplace: 1,
//       symbol: '$collection.symbol',
//       tx: 1,
//     }},
//     { $unwind: '$symbol' },
//     { $match: {symbol: "turtles"}},
//     { $group:
//       {
//         _id : {symbol: '$symbol', marketplace: '$marketplace', price: "$price"},
//         volume: { $sum: "$price"},
//         min: { $min: "$price" },
//         max: { $max: "$price" },
//         avg: { $avg: "$price" },
//         count: { $sum: 1 },
//       }
//     },
//     { $project:
//       {
//         symbol : "$_id.symbol",
//         marketplace: '$_id.marketplace',
//         price: "$_id.price",
//         tx: "$_id.tx",
//         volume: { $round: ["$volume", 2] },
//         start: startDate,
//         end: endDate,
//         min: { $round: ["$min", 2] },
//         max: { $round: ["$max", 2] },
//         avg: { $round: ["$avg", 2] },
//         count: 1,
//         _id: 0,
//       }
//     }
//   ]);
//   } catch (err) {
//     throw boom.boomify(err)
//   }
// }

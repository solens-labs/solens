const boom = require('@hapi/boom')
const _ = require('lodash')
const moment = require('moment');

const Transaction = require('../models/Transaction')
const Collection = require('../models/Collection')
const HourlyStats = require('../models/HourlyStats')
const DailyStats = require('../models/DailyStats')
const AllTimeStats = require('../models/AllTimeStats')

exports.getDailyStats = async (req, reply) => {
  try {
    const symbol = req.params.symbol

    const entries = DailyStats.aggregate([
      { $match: {
        symbol: { $eq: symbol},
        start: { $gt: moment().subtract(15,'d')._d }
      }},
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

exports.getHourlyStats = async (req, reply) => {
  try {
    const symbol = req.params.symbol

    const entries = HourlyStats.aggregate([
      { $match: {
        symbol: { $eq: symbol},
        start: { $gt: moment().subtract(25,'h')._d }
      }},
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

exports.getAllCollections = async (req, reply) => {
  try {
    const entries = await Collection.aggregate([
      { $lookup: {
        from: 'alltimestats',
        localField: 'symbol',
        foreignField: 'symbol',
        pipeline: [
          { $project: {
            _id: 0
          }}
        ],
        as: 'stats',
      }},
      { $addFields: {
        total_volume: {$sum: '$stats.volume'},
      }},

      { $lookup: {
        from: 'dailystats',
        localField: 'symbol',
        foreignField: 'symbol',
        pipeline: [
          { $match: {
            start: { $gt: moment().subtract(8,'d')._d }
          } }
        ],
        as: 'stats1',
      }},
      { $addFields: {
        weekly_volume: {$sum: '$stats1.volume'},
      }},

      { $lookup: {
        from: 'hourlystats',
        localField: 'symbol',
        foreignField: 'symbol',
        pipeline: [
          { $match: {
            start: { $gt: moment().subtract(25,'h')._d }
          } }
        ],
        as: 'stats2',
      }},
      { $addFields: {
        daily_volume: {$sum: '$stats2.volume'},
      }},

      { $lookup: {
        from: 'hourlystats',
        localField: 'symbol',
        foreignField: 'symbol',
        pipeline: [
          { $match: {
            $and: [
              { start: { $gt: moment().subtract(49,'h')._d } },
              { start: { $lte: moment().subtract(25,'h')._d } }
            ]
          } },
          { $sort: { start: -1 } },
        ],
        as: 'stats3',
      }},
      { $addFields: {
        past_day_volume: {$sum: '$stats3.volume'},
      }},

      { $project: {
        mint: 0,
        candyMachineIds: 0,
        updateAuthorities: 0,
        stats: 0,
        stats1: 0,
        stats2: 0,
        stats3: 0,
        __v: 0,
        _id: 0
      }},
    ])
    return _.sortBy(entries, ['total_volume']).reverse()
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.getCollection = async (req, reply) => {
  try {
    const symbol = req.params.symbol

    const entries = await Collection.aggregate([
      { $match: {
        symbol: symbol,
      }},

      { $lookup: {
        from: 'alltimestats',
        let: {},
        pipeline: [
          { $match: {
            symbol: symbol,
          } },
          { $project: {
            _id: 0,
            symbol: 0
          } }
        ],
        as: 'alltimestats'
      } },
      { $addFields: {
        total_volume: {$sum: '$alltimestats.volume'},
      }},

      { $lookup: {
        from: 'dailystats',
        let: {},
        pipeline: [
          { $match: {
            symbol: symbol,
            start: { $gt: moment().subtract(15,'d')._d }
          } },
          { $sort: { start: -1 } },
          { $project: {
            _id: 0,
            symbol: 0,
            end: 0,
          } }
        ],
        as: 'dailystats'
      } },
      { $addFields: {
        weekly_volume: {$sum: '$dailystats.volume'},
      }},

      { $lookup: {
        from: 'hourlystats',
        let: {},
        pipeline: [
          { $match: {
            symbol: symbol,
            start: { $gt: moment().subtract(49,'h')._d }
          } },
          { $sort: { start: -1 } },
          { $project: {
            _id: 0,
            symbol: 0,
            end: 0,
            tx: 0
          } }
        ],
        as: 'hourlystats'
      } },

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

exports.getTopBuys = async (req, reply) => {
  try {
    const symbol = req.params.symbol

    const entries = Transaction.aggregate([
      { $match: {
        symbol: { $eq: symbol},
        $or: [
          {type: { $eq: "buy"}},
          {type: { $eq: "accept_offer"}},
        ]
      }},
      { $sort: { price: -1} },
      { $limit: 100 },
      { $project:
        {
          account : "$new_owner", // new_owner is payer
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

exports.getTopSellers = async (req, reply) => {
  try {
    const symbol = req.params.symbol

    const entries = Collection.aggregate([
      { $match: {
        symbol: { $eq: symbol},
      }},
      { $lookup: {
        from: 'transactions',
        localField: 'mint',
        foreignField: 'mint',
        pipeline: [
          {$match: {
            $or: [
              {type: { $eq: "buy"}},
              {type: { $eq: "accept_offer"}},
            ]
          }},
          { $group:
            {
              _id : {owner: '$owner'}, // owner is seller
              total: { $sum: "$price"},
              min: { $min: "$price" },
              max: { $max: "$price" },
              avg: { $avg: "$price" },
              count: { $sum: 1 },
            },
          },
          { $sort: { total: -1} },
          { $limit: 100 },
          { $project:
            {
              account : "$_id.owner",
              total: { $round: ["$total", 2] },
              min: { $round: ["$min", 2] },
              max: { $round: ["$max", 2] },
              avg: { $round: ["$avg", 2] },
              count: 1,
              _id: 0,
            }
          }
        ],
        as: 'stats',
      }},
      { $project : {
        _id: 0,
        stats: 1
      }}
    ])
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.getTopBuyers = async (req, reply) => {
  try {
    const symbol = req.params.symbol

    const entries = Collection.aggregate([
      { $match: {
        symbol: { $eq: symbol},
      }},
      { $lookup: {
        from: 'transactions',
        localField: 'mint',
        foreignField: 'mint',
        pipeline: [
          {$match: {
            $or: [
              {type: { $eq: "buy"}},
              {type: { $eq: "accept_offer"}},
            ]
          }},
          { $group:
            {
              _id : {new_owner: '$new_owner'}, // new_owner is seller
              total: { $sum: "$price"},
              min: { $min: "$price" },
              max: { $max: "$price" },
              avg: { $avg: "$price" },
              count: { $sum: 1 },
            },
          },
          { $sort: { total: -1} },
          { $limit: 100 },
          { $project:
            {
              account : "$_id.new_owner",
              total: { $round: ["$total", 2] },
              min: { $round: ["$min", 2] },
              max: { $round: ["$max", 2] },
              avg: { $round: ["$avg", 2] },
              count: 1,
              _id: 0,
            }
          }
        ],
        as: 'stats',
      }},
      { $project : {
        _id: 0,
        stats: 1
      }}
    ])
    return entries
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.dailyTopVolumeNFTs = async (req, reply) => {
  try {

    const symbol = req.params.symbol

    const startDate = new Date();
    
    startDate.setDate(startDate.getDate() - 1);
    console.log(startDate);
    
    const entries = await Collection.aggregate([
      { $match: {
        symbol: { $eq: symbol},
      }},
      { $lookup: {
        from: 'transactions',
        localField: 'mint',
        foreignField: 'mint',
        pipeline: [
          {$match: {
            date: { $gte: startDate },
            $or: [
              {type: { $eq: "buy"}},
              {type: { $eq: "accept_offer"}},
            ]
          }},
          { $group : {
            _id: {mint: "$mint"},
            volume: { $sum: "$price"},
            min: { $min: "$price" },
            max: { $max: "$price" },
            avg: { $avg: "$price" },
            count: { $sum: 1 },
          }},
          { $project:
            {
              mint: "$_id.mint",
              volume: { $round: ["$volume", 2] },
              min: { $round: ["$min", 2] },
              max: { $round: ["$max", 2] },
              avg: { $round: ["$avg", 2] },
              count: 1,
              _id: 0,
            }
          },
          { $sort: {volume: -1}},
          { $limit: 100 }
        ],
        as: 'stats',
      }},
      { $project : {
        // _id: 0,
        // mint: 0,
        stats: 1
      }}
    ])
    return entries.length ? entries[0].stats : []
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.dailyTopTradedNFTs = async (req, reply) => {
  try {

    const symbol = req.params.symbol

    const startDate = new Date();
    
    startDate.setDate(startDate.getDate() - 1);
    console.log(startDate);
    
    const entries = await Collection.aggregate([
      { $match: {
        symbol: { $eq: symbol},
      }},
      { $lookup: {
        from: 'transactions',
        localField: 'mint',
        foreignField: 'mint',
        pipeline: [
          {$match: {
            date: { $gte: startDate },
            $or: [
              {type: { $eq: "buy"}},
              {type: { $eq: "accept_offer"}},
            ]
          }},
          { $group : {
            _id: {mint: "$mint"},
            volume: { $sum: "$price"},
            min: { $min: "$price" },
            max: { $max: "$price" },
            avg: { $avg: "$price" },
            count: { $sum: 1 },
          }},
          { $project:
            {
              mint: "$_id.mint",
              volume: { $round: ["$volume", 2] },
              min: { $round: ["$min", 2] },
              max: { $round: ["$max", 2] },
              avg: { $round: ["$avg", 2] },
              count: 1,
              _id: 0,
            }
          },
          { $sort: {count: -1}},
          { $limit: 100 }
        ],
        as: 'stats',
      }},
      { $project : {
        // _id: 0,
        // mint: 0,
        stats: 1
      }}
    ])
    return entries.length ? entries[0].stats : []
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.dailyMarketTopVolumeNFTs = async (req, reply) => {
  try {

  const startDate = new Date();
  
  startDate.setDate(startDate.getDate() - 1);
  console.log(startDate);
  
  
  return Transaction.aggregate([
    { $match: {
      date: { $gte: startDate },
      $or: [
        {type: { $eq: "buy"}},
        {type: { $eq: "accept_offer"}},
      ]
    }},
    { $group : {
      _id: {mint: "$mint"},
      volume: { $sum: "$price"},
      min: { $min: "$price" },
      max: { $max: "$price" },
      avg: { $avg: "$price" },
      count: { $sum: 1 },
    }},
    { $project:
      {
        mint: "$_id.mint",
        volume: { $round: ["$volume", 2] },
        min: { $round: ["$min", 2] },
        max: { $round: ["$max", 2] },
        avg: { $round: ["$avg", 2] },
        count: 1,
        _id: 0,
      }
    },
    { $sort: { volume: -1 } },
    { $limit: 100 }
  ]);
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.dailyMarketTopTradedNFTs = async (req, reply) => {
  try {

  const startDate = new Date();
  
  startDate.setDate(startDate.getDate() - 1);
  console.log(startDate);
  
  
  return Transaction.aggregate([
    { $match: {
      date: { $gte: startDate },
      $or: [
        {type: { $eq: "buy"}},
        {type: { $eq: "accept_offer"}},
      ]
    }},
    { $group : {
      _id: {mint: "$mint"},
      volume: { $sum: "$price"},
      min: { $min: "$price" },
      max: { $max: "$price" },
      avg: { $avg: "$price" },
      count: { $sum: 1 },
    }},
    { $project:
      {
        mint: "$_id.mint",
        volume: { $round: ["$volume", 2] },
        min: { $round: ["$min", 2] },
        max: { $round: ["$max", 2] },
        avg: { $round: ["$avg", 2] },
        count: 1,
        _id: 0,
      }
    },
    { $sort: { count: -1 } },
    { $limit: 100 }
  ]);
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.dailyTopBuyers = async (req, reply) => {
  try {

  const startDate = new Date();
  
  startDate.setDate(startDate.getDate() - 1);
  console.log(startDate);
  
  
  return Transaction.aggregate([
    { $match: {
      date: { $gte: startDate },
      $or: [
        {type: { $eq: "buy"}},
        {type: { $eq: "accept_offer"}},
      ]
    }},
    { $group : {
      _id: {wallet: "$new_owner"},
      volume: { $sum: "$price"},
      min: { $min: "$price" },
      max: { $max: "$price" },
      avg: { $avg: "$price" },
      count: { $sum: 1 },
    }},
    { $project:
      {
        wallet: "$_id.wallet",
        volume: { $round: ["$volume", 2] },
        min: { $round: ["$min", 2] },
        max: { $round: ["$max", 2] },
        avg: { $round: ["$avg", 2] },
        count: 1,
        _id: 0,
      }
    },
    { $sort: { volume: -1 } },
    { $limit: 100 }
  ]);
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.dailyTopSellers = async (req, reply) => {
  try {

  const startDate = new Date();
  
  startDate.setDate(startDate.getDate() - 1);
  console.log(startDate);
  
  
  return Transaction.aggregate([
    { $match: {
      date: { $gte: startDate },
      $or: [
        {type: { $eq: "buy"}},
        {type: { $eq: "accept_offer"}},
      ]
    }},
    { $group : {
      _id: {wallet: "$owner"},
      volume: { $sum: "$price"},
      min: { $min: "$price" },
      max: { $max: "$price" },
      avg: { $avg: "$price" },
      count: { $sum: 1 },
    }},
    { $project:
      {
        wallet: "$_id.wallet",
        volume: { $round: ["$volume", 2] },
        min: { $round: ["$min", 2] },
        max: { $round: ["$max", 2] },
        avg: { $round: ["$avg", 2] },
        count: 1,
        _id: 0,
      }
    },
    { $sort: { volume: -1 } },
    { $limit: 100 }
  ]);
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.dailyActiveBuyers = async (req, reply) => {
  try {

  const startDate = new Date();
  
  startDate.setDate(startDate.getDate() - 1);
  console.log(startDate);
  
  
  return Transaction.aggregate([
    { $match: {
      date: { $gte: startDate },
      $or: [
        {type: { $eq: "buy"}},
        {type: { $eq: "accept_offer"}},
      ]
    }},
    { $group : {
      _id: {wallet: "$new_owner"},
      volume: { $sum: "$price"},
      min: { $min: "$price" },
      max: { $max: "$price" },
      avg: { $avg: "$price" },
      count: { $sum: 1 },
    }},
    { $project:
      {
        wallet: "$_id.wallet",
        volume: { $round: ["$volume", 2] },
        min: { $round: ["$min", 2] },
        max: { $round: ["$max", 2] },
        avg: { $round: ["$avg", 2] },
        count: 1,
        _id: 0,
      }
    },
    { $sort: { count: -1 } },
    { $limit: 100 }
  ]);
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.dailyActiveSellers = async (req, reply) => {
  try {

  const startDate = new Date();
  
  startDate.setDate(startDate.getDate() - 1);
  console.log(startDate);
  
  
  return Transaction.aggregate([
    { $match: {
      date: { $gte: startDate },
      $or: [
        {type: { $eq: "buy"}},
        {type: { $eq: "accept_offer"}},
      ]
    }},
    { $group : {
      _id: {wallet: "$owner"},
      volume: { $sum: "$price"},
      min: { $min: "$price" },
      max: { $max: "$price" },
      avg: { $avg: "$price" },
      count: { $sum: 1 },
    }},
    { $project:
      {
        wallet: "$_id.wallet",
        volume: { $round: ["$volume", 2] },
        min: { $round: ["$min", 2] },
        max: { $round: ["$max", 2] },
        avg: { $round: ["$avg", 2] },
        count: 1,
        _id: 0,
      }
    },
    { $sort: { count: -1 } },
    { $limit: 100 }
  ]);
  } catch (err) {
    throw boom.boomify(err)
  }
}

// exports.test = async (req, reply) => {
//   try {
//     const symbol = req.params.symbol

//     const entries = Transaction.aggregate([
//       { $match: {
//         $or: [
//           {type: { $eq: "buy"}},
//           {type: { $eq: "accept_offer"}},
//         ],
//         $and: [
//           {date: { $gte: new Date('2021-12-1') }},
//           // {date: { $lt: new Date('2021-12-1') }}
//         ]
//       }},
//       { $group:
//         {
//           _id : {mint: '$owner'},
//           volume: { $sum: "$price"},
//           count: { $sum: 1 },
//         }
//       },
//       { $sort: { volume: -1 } },
//       { $limit: 10 },  
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


// exports.updateHourlyStats = async (req, reply) => {
//   try {
//     const symbol = req.params.symbol

//     const end = new Date(2021, 7, 1);
//     end.setHours(1);
//     end.setMinutes(0);
//     end.setSeconds(0);
//     end.setMilliseconds(0);
    
    
//     for (var endDate = end; endDate <= new Date(); endDate.setHours(endDate.getHours() + 1)) {
//       const startDate = new Date(endDate);
//       startDate.setHours(endDate.getHours() - 1);
//       console.log(startDate, endDate);

//       await Transaction.aggregate([
//         { $match: {
//           $and: [
//             {date: { $gte: startDate }},
//             {date: { $lt: endDate }}
//           ],
//           $or: [
//             {type: { $eq: "buy"}},
//             {type: { $eq: "accept_offer"}},
//           ]
//         }},
//         { $lookup: {
//           from: 'collections',
//           localField: 'mint',
//           foreignField: 'mint',
//           as: 'collection',
//         }},
//         { $project : {
//           _id: 0,
//           tx: 1,
//           price: 1,
//           marketplace: 1,
//           symbol: '$collection.symbol'
//         }},
//         { $unwind: '$symbol' },
//         { $group:
//           {
//             _id : {symbol: '$symbol', marketplace: '$marketplace'},
//             volume: { $sum: "$price"},
//             min: { $min: "$price" },
//             max: { $max: "$price" },
//             avg: { $avg: "$price" },
//             tx: { $push: "$tx" },
//             count: { $sum: 1 },
//           }
//         },
//         { $project:
//           {
//             symbol : "$_id.symbol",
//             marketplace: '$_id.marketplace',
//             volume: { $round: ["$volume", 2] },
//             start: startDate,
//             end: endDate,
//             min: { $round: ["$min", 2] },
//             max: { $round: ["$max", 2] },
//             avg: { $round: ["$avg", 2] },
//             tx: '$tx',
//             count: 1,
//             _id: 0,
//           }
//         },
//         { $merge: {
//           into: "hourlystats",
//           on: [ "start", "symbol", "marketplace" ],
//           whenMatched: "replace",
//           whenNotMatched: "insert"
//         }}
//       ]);
//     }
//   } catch (err) {
//     throw boom.boomify(err)
//   }
// }

// exports.test = async (req, reply) => {
//   try {
//     const symbol = req.params.symbol

//     const end = new Date(2021, 7, 1);
//     end.setUTCHours(0);
//     end.setUTCMinutes(0);
//     end.setUTCSeconds(0);
//     end.setUTCMilliseconds(0);
    
    
//     for (var endDate = end; endDate <= new Date(); endDate.setDate(endDate.getDate() + 1)) {
//       endDate.setUTCHours(0);
//       endDate.setUTCMinutes(0);
//       endDate.setUTCSeconds(0);
//       endDate.setUTCMilliseconds(0);

//       const startDate = new Date(endDate);
//       startDate.setDate(endDate.getDate() - 1);
//       startDate.setUTCHours(0);
//       startDate.setUTCMinutes(0);
//       startDate.setUTCSeconds(0);
//       startDate.setUTCMilliseconds(0);

//       console.log(startDate, endDate);

//       await Transaction.aggregate([
//         { $match: {
//           $and: [
//             {date: { $gte: startDate }},
//             {date: { $lt: endDate }}
//           ],
//           $or: [
//             {type: { $eq: "buy"}},
//             {type: { $eq: "accept_offer"}},
//           ]
//         }},
//         { $lookup: {
//           from: 'collections',
//           localField: 'mint',
//           foreignField: 'mint',
//           as: 'collection',
//         }},
//         { $project : {
//           _id: 0,
//           price: 1,
//           marketplace: 1,
//           symbol: '$collection.symbol'
//         }},
//         { $unwind: '$symbol' },
//         { $group:
//           {
//             _id : {symbol: '$symbol', marketplace: '$marketplace'},
//             volume: { $sum: "$price"},
//             min: { $min: "$price" },
//             max: { $max: "$price" },
//             avg: { $avg: "$price" },
//             count: { $sum: 1 },
//           }
//         },
//         { $project:
//           {
//             symbol : "$_id.symbol",
//             marketplace: '$_id.marketplace',
//             volume: { $round: ["$volume", 2] },
//             start: startDate,
//             end: endDate,
//             min: { $round: ["$min", 2] },
//             max: { $round: ["$max", 2] },
//             avg: { $round: ["$avg", 2] },
//             count: 1,
//             _id: 0,
//           }
//         },
//         { $merge: {
//           into: "dailystats",
//           on: [ "start", "symbol", "marketplace" ],
//           whenMatched: "replace",
//           whenNotMatched: "insert"
//         }}
//       ]);
//     }
//     return {}
//   } catch (err) {
//     throw boom.boomify(err)
//   }
// }


// exports.updateAllTimeStats = async (req, reply) => {
//   try {
//     DailyStats.aggregate([
//       { $lookup: {
//         from: 'collections',
//         localField: 'symbol',
//         foreignField: 'symbol',
//         as: 'collection',
//       }},
//       { $group:
//         {
//           _id : {symbol: '$symbol', marketplace: '$marketplace'},
//           volume: { $sum: "$volume"},
//           min: { $min: "$min" },
//           max: { $max: "$max" },
//           count: { $sum: "$count" },
//         }
//       },
//       { $addFields: {
//         avg: { $divide: [ '$volume', '$count' ] }
//       }},
//       { $project:
//         {
//           symbol : "$_id.symbol",
//           marketplace: '$_id.marketplace',
//           volume: { $round: ["$volume", 2] },
//           min: { $round: ["$min", 2] },
//           max: { $round: ["$max", 2] },
//           avg: { $round: ["$avg", 2] },
//           count: 1,
//           _id: 0,
//         }
//       },
//       { $merge: {
//         into: "alltimestats",
//         on: [ "symbol", "marketplace" ],
//         whenMatched: "replace",
//         whenNotMatched: "insert"
//       }}
//     ]);
//   } catch (err) {
//     throw boom.boomify(err)
//   }
// }

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

// exports.test = async (req, reply) => {

//   const symbols = await Collection.find({}, {symbol: 1, _id: 0})
//   let yay = []
//   for (let i = 0; i < symbols.length; i++) {
//     const symbol = symbols[i].symbol
//     let mints = await Collection.findOne({symbol}, {mint: 1, _id: 0})
//     console.log(i, symbol, mints.mint.length)
//     // return Transaction.find({symbol: "solsweeps"}).count()
//     const res = await Transaction.updateMany(
//       {mint: mints.mint},
//       [{$addFields: {symbol: symbol}}]
//     )
//     res.symbol = symbol
//     yay.push(res)
//   }
//   return yay
// }

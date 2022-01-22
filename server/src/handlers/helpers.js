const moment = require('moment');

exports.groupTxStats = (id) => {
  return { $group:
    {
      '_id': {[id]: `$${id}`},
      volume: { $sum: "$price"},
      min: { $min: "$price" },
      max: { $max: "$price" },
      avg: { $avg: "$price" },
      count: { $sum: 1 },
    },
  }
}

exports.projectTxStats = (id, idProjection) => {
  return { $project:
    {
      [idProjection]: `$_id.${id}`,
      volume: { $round: ["$volume", 2] },
      min: { $round: ["$min", 2] },
      max: { $round: ["$max", 2] },
      avg: { $round: ["$avg", 2] },
      count: 1,
      _id: 0,
    }
  }
}

exports.groupTxStatsWithSymbol = (id) => {
  return { $group:
    {
      '_id': {[id]: `$${id}`},
      volume: { $sum: "$price"},
      min: { $min: "$price" },
      max: { $max: "$price" },
      avg: { $avg: "$price" },
      symbol: { $first: "$symbol" },
      count: { $sum: 1 },
    },
  }
}

exports.projectTxStatsWithSymbol = (id, idProjection) => {
  return { $project:
    {
      [idProjection]: `$_id.${id}`,
      volume: { $round: ["$volume", 2] },
      min: { $round: ["$min", 2] },
      max: { $round: ["$max", 2] },
      avg: { $round: ["$avg", 2] },
      symbol: 1,
      count: 1,
      _id: 0,
    }
  }
}

exports.matchBuyTxs = () => {
  return { $or: [
      {type: { $eq: "buy"}},
      {type: { $eq: "accept_offer"}},
    ]
  }
}

exports.matchMainTxs = () => {
  return { $or: [
      {type: { $eq: "list"}},
      {type: { $eq: "buy"}},
      {type: { $eq: "cancel"}}
    ]
  }
}

exports.lookupAggregatedStats = (collection, days = 1, skip = 0, outField = '', symbol = '') => {
  const out = outField || collection
  const match = { $match: {
    $or : [
      { start: { $exists: false } },
      { $and:
        [
          { start: { $gt: moment().subtract(days, 'd')._d } },
          { start: { $lte: moment().subtract(skip, 'd')._d } }
        ]
      }
    ]
  } }
  if (symbol) {
    match.$match.symbol = symbol
  }

  return { $lookup: {
    from: collection,
    localField: 'symbol',
    foreignField: 'symbol',
    pipeline: [
      match,
      { $project: {
        _id: 0
      } }
    ],
    as: out,
  }}
}

exports.projectTypes = () => {
  return {
    $switch:
    {
      branches: [
        {
          case: { $eq : [ "$subtype", 'update' ] },
          then: "update"
        },
        {
          case: { $eq : [ "$subtype", 'accept_offer' ] },
          then: "accept_offer"
        }
      ],
      default: "$type"
    }
  }
}

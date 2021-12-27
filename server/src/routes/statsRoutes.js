const statsHandlers = require('../handlers/stats')
const schema = require('./statsSchema')

const routes = [
  {
    method: 'GET',
    url: '/stats/allCollections',
    handler: statsHandlers.allCollections
  },
  {
    method: 'GET',
    url: '/stats/collection',
    schema: schema.collection,
    handler: statsHandlers.collection
  },
  {
    method: 'GET',
    url: '/stats/topTrades',
    schema: schema.topTrades,
    handler: statsHandlers.topTrades
  },
  {
    method: 'GET',
    url: '/stats/topTraders',
    schema: schema.topTraders,
    handler: statsHandlers.topTraders
  },
  {
    method: 'GET',
    url: '/stats/topNFTs',
    schema: schema.topNFTs,
    handler: statsHandlers.topNFTs
  },
  {
    method: 'GET',
    url: '/stats/dailyStats',
    schema: schema.topTrades,
    handler: statsHandlers.dailyStats
  },
  {
    method: 'GET',
    url: '/stats/hourlyStats',
    schema: schema.topTrades,
    handler: statsHandlers.hourlyStats
  },
  {
    method: 'GET',
    url: '/stats/marketStats',
    schema: schema.days,
    handler: statsHandlers.marketStats
  }
]

module.exports = routes

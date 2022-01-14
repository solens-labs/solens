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
    url: '/stats/mintHistory',
    schema: schema.mintHistory,
    handler: statsHandlers.mintHistory
  },
  {
    method: 'GET',
    url: '/stats/walletHistory',
    schema: schema.walletHistory,
    handler: statsHandlers.walletHistory
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
  },
  {
    method: 'GET',
    url: '/stats/floor',
    schema: schema.floor,
    handler: statsHandlers.floor
  },
  {
    method: 'GET',
    url: '/symbol',
    schema: schema.mintHistory,
    handler: statsHandlers.symbol
  },
  {
    method: 'GET',
    url: '/listings',
    schema: schema.tmpSymbolOrMintRequired,
    handler: statsHandlers.listings
  },
  {
    method: 'GET',
    url: '/currentFloor',
    schema: schema.symbolRequired,
    handler: statsHandlers.currentFloor
  },
  // this is a temporary entdpoint
  {
    method: 'GET',
    url: '/totalMarketVolume',
    handler: statsHandlers.totalMarketVolume
  }
]

module.exports = routes

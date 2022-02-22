const statsHandlers = require('../handlers/stats')
const schema = require('./statsSchema')

const routes = [
  {
    method: 'GET',
    url: '/stats/topNFTs',
    schema: schema.topNFTs,
    handler: statsHandlers.topNFTs
  },
  {
    method: 'GET',
    url: '/mintHistory',
    schema: schema.mintHistory,
    handler: statsHandlers.mintHistory
  },
  {
    method: 'GET',
    url: '/walletHistory',
    schema: schema.walletHistory,
    handler: statsHandlers.walletHistory
  },
  {
    method: 'GET',
    url: '/dailyStats',
    schema: schema.stats,
    handler: statsHandlers.dailyStats
  },
  {
    method: 'GET',
    url: '/hourlyStats',
    schema: schema.stats,
    handler: statsHandlers.hourlyStats
  },
  {
    method: 'GET',
    url: '/historicalFloor',
    schema: schema.stats,
    handler: statsHandlers.floor
  },
  {
    method: 'GET',
    url: '/recentCollectionActivity',
    schema: schema.symbolRequired,
    handler: statsHandlers.recentCollectionActivity
  },
  {
    method: 'GET',
    url: '/currentFloor',
    schema: schema.symbolRequired,
    handler: statsHandlers.currentFloor
  },
  {
    method: 'GET',
    url: '/24HMarketVolume',
    handler: statsHandlers.totalMarketVolume
  }
]

module.exports = routes

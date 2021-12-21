const collectionController = require('../controllers/collectionController') 
const transactionController = require('../controllers/transactionController') 
const hourlyStatsController = require('../controllers/hourlyStatsController')
const dailyStatsController = require('../controllers/dailyStatsController')
const allTimeStatsController = require('../controllers/allTimeStatsController')
const insightsHandle = require('../handlers/handler')

const simpleSchema = {
  body:{
    type: 'object',
    required: ['symbol'],
    properties: {
      symbol: { type: 'string'}
    }
  }
}

const routes = [
  {
    method: 'GET',
    url: '/api/collections',
    schema: simpleSchema,
    handler: collectionController.getCollection
  },
  {
    method: 'GET',
    url: '/api/collections/:mint',
    handler: collectionController.getSymbolFromMint
  },
  {
    method: 'POST',
    url: '/api/collections',
    handler: collectionController.addCollection,
    schema: simpleSchema
  },
  {
    method: 'PUT',
    url: '/api/collections',
    handler: collectionController.updateCollection,
    schema: simpleSchema
  },
  {
    method: 'DELETE',
    url: '/api/collections',
    handler: collectionController.deleteCollection
  },
  {
    method: 'GET',
    url: '/api/transactions',
    schema: simpleSchema,
    handler: transactionController.getTransaction
  },
  {
    method: 'POST',
    url: '/api/transactions',
    handler: transactionController.addTransaction,
    // schema: documentation.addTransactionSchema
  },
  {
    method: 'PUT',
    url: '/api/transactions',
    handler: transactionController.updateTransaction,
    // schema: documentation.addTransactionSchema
  },
  {
    method: 'DELETE',
    url: '/api/transactions',
    handler: transactionController.deleteTransaction
  },
  {
    method: 'POST',
    url: '/api/hourlyStats',
    handler: hourlyStatsController.addHourlyStats
  },
  {
    method: 'POST',
    url: '/api/dailyStats',
    handler: dailyStatsController.addDailyStats
  },
  {
    method: 'POST',
    url: '/api/allTimeStats',
    handler: allTimeStatsController.addAllTimeStats
  },
  {
    method: 'GET',
    url: '/api/stats/getDailyStats/:symbol',
    handler: insightsHandle.getDailyStats
  },
  {
    method: 'GET',
    url: '/api/stats/getHourlyStats/:symbol',
    handler: insightsHandle.getHourlyStats
  },
  {
    method: 'GET',
    url: '/api/stats/getTopBuys/:symbol',
    handler: insightsHandle.getTopBuys
  },
  {
    method: 'GET',
    url: '/api/stats/getTopSellers/:symbol',
    handler: insightsHandle.getTopSellers
  },
  {
    method: 'GET',
    url: '/api/stats/getTopBuyers/:symbol',
    handler: insightsHandle.getTopBuyers
  },
  {
    method: 'GET',
    url: '/api/stats/getAllCollections',
    handler: insightsHandle.getAllCollections
  },
  {
    method: 'GET',
    url: '/api/stats/getCollection/:symbol',
    handler: insightsHandle.getCollection
  },
  {
    method: 'GET',
    url: '/api/stats/dailyMarketTopVolumeNFTs',
    handler: insightsHandle.dailyMarketTopVolumeNFTs
  },
  {
    method: 'GET',
    url: '/api/stats/dailyMarketTopTradedNFTs',
    handler: insightsHandle.dailyMarketTopTradedNFTs
  },
  {
    method: 'GET',
    url: '/api/stats/dailyTopVolumeNFTs/:symbol',
    handler: insightsHandle.dailyTopVolumeNFTs
  },
  {
    method: 'GET',
    url: '/api/stats/dailyTopTradedNFTs/:symbol',
    handler: insightsHandle.dailyTopTradedNFTs
  },
  {
    method: 'GET',
    url: '/api/stats/dailyTopBuyers',
    handler: insightsHandle.dailyTopBuyers
  },
  {
    method: 'GET',
    url: '/api/stats/dailyTopSellers',
    handler: insightsHandle.dailyTopSellers
  },
  {
    method: 'GET',
    url: '/api/stats/dailyActiveBuyers',
    handler: insightsHandle.dailyActiveBuyers
  },
  {
    method: 'GET',
    url: '/api/stats/dailyActiveSellers',
    handler: insightsHandle.dailyActiveSellers
  }
]

module.exports = routes
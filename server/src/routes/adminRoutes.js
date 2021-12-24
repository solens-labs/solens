const collectionController = require('../controllers/collectionController') 
const transactionController = require('../controllers/transactionController') 
const hourlyStatsController = require('../controllers/hourlyStatsController')
const dailyStatsController = require('../controllers/dailyStatsController')
const allTimeStatsController = require('../controllers/allTimeStatsController')
const adminHandlers = require('../handlers/admin')

const schema = require('./adminSchema')

const routes = [
  {
    method: 'GET',
    url: '/collections',
    handler: collectionController.getCollection
  },
  {
    method: 'GET',
    url: '/collections/:mint',
    handler: collectionController.getSymbolFromMint
  },
  {
    method: 'POST',
    url: '/collections',
    handler: collectionController.addCollection
  },
  {
    method: 'PUT',
    url: '/collections',
    handler: collectionController.updateCollection
  },
  {
    method: 'DELETE',
    url: '/collections',
    handler: collectionController.deleteCollection
  },
  {
    method: 'GET',
    url: '/transactions',
    handler: transactionController.getTransaction
  },
  {
    method: 'POST',
    url: '/transactions',
    handler: transactionController.addTransaction
  },
  {
    method: 'PUT',
    url: '/transactions',
    handler: transactionController.updateTransaction
  },
  {
    method: 'DELETE',
    url: '/transactions',
    handler: transactionController.deleteTransaction
  },
  {
    method: 'POST',
    url: '/hourlyStats',
    handler: hourlyStatsController.addHourlyStats
  },
  {
    method: 'POST',
    url: '/dailyStats',
    handler: dailyStatsController.addDailyStats
  },
  {
    method: 'POST',
    url: '/allTimeStats',
    handler: allTimeStatsController.addAllTimeStats
  },
  {
    method: 'PUT',
    url: '/admin/updateEverything',
    schema: schema.updateEverything,
    handler: adminHandlers.updateEverything
  },
  {
    method: 'PUT',
    url: '/admin/updateTransactions',
    handler: adminHandlers.updateTransactions
  },
  {
    method: 'GET',
    url: '/admin/getCollection',
    handler: adminHandlers.getCollection
  }
]

module.exports = routes

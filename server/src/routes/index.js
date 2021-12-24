const statsRoutes = require('./statsRoutes')
const adminRoutes = require('./adminRoutes')

const routes = []

statsRoutes.forEach((route) => {
  routes.push(route)
})

if (process.env.NODE_ENV == 'development') {
  adminRoutes.forEach((route) => {
    routes.push(route)
  })
}

module.exports = routes

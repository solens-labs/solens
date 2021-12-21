exports.options = {
  routePrefix: '/documentation',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Arnori API',
      description: 'Providing valuable insights to solana users.',
      version: '0.1.0'
    },
    host: '3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
}
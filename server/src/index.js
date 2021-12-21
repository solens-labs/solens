'use strict'

const mongoose = require('mongoose')
const routes = require('./routes')
const swagger = require('./config/swagger')
const fs = require('fs')
const path = require('path')
const NodeCache = require('node-cache')

const cache = new NodeCache( { stdTTL: 3600 } );

const fastify = require('fastify')({
  logger: true
})

fastify.get('/', async (request, reply) => {
  return { status: 'up and runing' }
})

fastify.register(require('fastify-swagger'), swagger.options)

fastify.register(require('fastify-cors'), {
  origin: "*",
  methods: ["POST", "GET"]
});

fastify.addHook('preHandler', (req, reply, done) => {
  const key = req.method + req.url
  if (cache.has(key)) {
    return reply.send(cache.get(key))
  }
  done()
})

fastify.addHook('onSend', (req, reply, payload, done) => {
  if (req.url.includes('stats')) {
    const key = req.method + req.url
    if (!cache.has(key)) {
      cache.set(key, JSON.parse(payload))
    }
  }
  done()
})

routes.forEach((route, index) => {
  fastify.route(route)
})

const dbUser = process.env.MONGO_USER
const dbPassword = process.env.MONGO_PASSWORD

const uri = `mongodb+srv://${dbUser}:${dbPassword}@arnori-us-west.ohyuk.mongodb.net/arnoriDB?retryWrites=true&w=majority`

mongoose.connect(uri)
  .then(() => console.log('MongoDB connected…'))
  .catch(err => console.log(err))

// Run the server!
const start = async () => {
  try
  {
    await fastify.listen(3000, '0.0.0.0')
    fastify.swagger()
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  }
  catch (err)
  {
    fastify.log.error(err)
    mongoose.disconnect(() => {
      console.log('MongoDB connection closed')
    })
    fastify.close(() => {
      console.log('Process terminated')
    })
    process.exit(1)
  }
}

start();

process.on('SIGTERM', () => {
  mongoose.disconnect(() => {
    console.log('MongoDB connection closed')
  })
  fastify.close(() => {
    console.log('Process terminated')
  })
})

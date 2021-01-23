'use strict'

const fp = require('fastify-plugin')
const MongoDB = require('fastify-mongodb')

module.exports = fp(async (fastify, opts) => {
  const options = Object.assign({
    useNewUrlParser: true,
    useUnifiedTopology: true,
    url: 'mongodb://localhost:27017/example',
    name: 'example'
  }, opts.mongodb)

  fastify.register(MongoDB, options)
})
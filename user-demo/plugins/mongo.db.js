'use strict'

const fp = require('fastify-plugin')
const MongoDB = require('fastify-mongodb')

module.exports = fp(async (fastify, opts) => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    url: 'mongodb://localhost:27017/example',
    name: 'example'
  }

  fastify.register(MongoDB, options)
})
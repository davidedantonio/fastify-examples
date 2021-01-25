'use strict'

const fp = require('fastify-plugin')
const cors = require('fastify-cors')

module.exports = fp(async (fastify, opts) => {
  const options = {
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
    origin: '*'
  }

  fastify.register(cors, options)
})
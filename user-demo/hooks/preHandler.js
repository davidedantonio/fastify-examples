'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async (fastify, opts) => {
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith(opts.prefix))
      return await request.jwtVerify()
  })
})
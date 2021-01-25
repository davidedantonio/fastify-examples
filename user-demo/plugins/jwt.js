'use strict'

const fp = require('fastify-plugin')
const JWT = require('fastify-jwt')

module.exports = fp(async (fastify, opts) => {
  let jwtOpts = Object.assign({}, {
    secret: process.env.JWT_SECRET || 'Th1s1sY0ur53cr3t'
  }, opts.jwt)

  console.log(jwtOpts)
  fastify.register(JWT, jwtOpts)
})
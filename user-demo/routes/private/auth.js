'use strict'

const S = require('fluent-json-schema')

module.exports = async function (fastify, opts) {
  fastify.get('/me', {
    schema: {
      response: {
        200: S.object()
          .prop('username', S.string())
          .prop('fullName', S.string())
          .prop('profile', S.string())
      }
    }
  }, async function (request, reply) {
    return request.user
  })
}

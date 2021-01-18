'use strict'

const S = require('fluent-json-schema')
const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  fastify.addSchema(
    S.object()
      .id('userSchema')
      .title('User Request')
      .prop('username', S.string().required())
      .prop('name', S.string().required())
      .prop('surname', S.string().required())
      .prop('age', S.integer().required())
  )
  
  fastify.addSchema(
    S.object()
      .id('userSchemaResponse')
      .title('User Response')
      .prop('_id', S.string())
      .prop('username', S.string())
      .prop('name', S.string())
      .prop('surname', S.string())
      .prop('age', S.integer())
      .prop('creationDate', S.string())
  )
})
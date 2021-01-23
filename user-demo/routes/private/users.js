'use strict'

const DUPLICATE_KEY_ERROR = 11000
const S = require('fluent-json-schema')

module.exports = async function (fastify, opts) {
  const users = fastify.mongo.example.db.collection('users')
  const { ObjectId } = fastify.mongo
  
  users.createIndex({
    username: 1
  }, { unique: true })

  fastify.post('/', {
    schema: {
      body: S.ref('userSchema'),
      response: { 
        200: S.ref('userSchemaResponse'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async function (request, reply) {
    const { body } = request
    try {
      Object.assign(body, { creationDate: new Date() })
      await users.insertOne(body)
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR) {
        return reply.code(400).send({ message: `Username ${body.username} already exist`})
      }

      return reply.code(500).send({ message: e.message })
    }
    
    return body
  })

  fastify.get('/:id', {
    schema: {
      params: S.object()
        .prop('id', S.string().required()),
      response: {
        200: S.ref('userSchemaResponse'),
        404: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async function (request, reply) {
    const { id } = request.params
    try {
      const result = await users.findOne({ _id: new ObjectId(id) })
      
      if (!result) {
        return reply.code(404).send({ message: 'User not found' })
      }

      return result
    } catch (e) {
      return reply.code(500).send({ message: e.message })
    }
  })

  fastify.get('/all', {
    schema: {
      response: {
        200: S.array().items(S.ref('userSchemaResponse')),
        500: S.ref('errorSchema')
      }
    }    
  }, async function (request, reply) {
    try {
      const result = await users
        .find({})
        .sort({ creationDate: -1 })
        .toArray()

      return result
    } catch (e) {
      return reply.code(500).send({ message: e.message })
    }
  })

  fastify.delete('/:id', {
    schema: {
      params: S.object()
        .prop('id', S.string().required()),
      response: {
        404: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async function (request, reply) {
    const { id } = request.params
    try {
      const result = await users.deleteOne({ _id: new ObjectId(id) })
      
      if (!result) {
        return reply.code(404).send({ message: 'User not found' })
      }

      return reply.code(204).send()
    } catch (e) {
      return reply.code(500).send({ message: e.message })
    }
  })
}

module.exports.autoPrefix = '/user'
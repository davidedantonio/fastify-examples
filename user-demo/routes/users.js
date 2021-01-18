'use strict'

const DUPLICATE_KEY_ERROR = 11000
const S = require('fluent-json-schema')

module.exports = async (fastify, opts) => {
  const users = fastify.mongo.example.db.collection('users')
  users.createIndex({
    username: 1
  }, { unique: true })
  const { ObjectId } = fastify.mongo

  fastify.post('/', {
    schema: {
      body: S.ref('userSchema'),
      response: {
        200: S.ref('userSchemaResponse'),
        400: S.ref('errorSchema'),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { body } = req
    try {
      Object.assign(body, {
        creationDate: new Date()
      })

      await users.insertOne(body)
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR) {
        return res.code(400).send({ message: `Username ${body.username} already exists` })  
      }

      return res.code(500).send({ message: e.message })
    }

    return body
  })

  fastify.get('/all', {
    schema: {
      response: {
        200: S.array().items(S.ref('userSchemaResponse')),
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    try {
      const usersList = users
        .find({})
        .sort({
          creationDate: 1
        })
        .toArray()
      return usersList
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
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
  }, async (req, res) => {
    const { id } = req.params

    try {
      const user = await users
        .findOne({_id: new ObjectId(id)})

      if (!user) {
        return res.code(404).send({ message: 'No user found' })
      }

      return user
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })

  fastify.delete('/:id', {
    schema: {
      params: S.object()
        .prop('id', S.string().required()),
      response: {
        500: S.ref('errorSchema')
      }
    }
  }, async (req, res) => {
    const { id } = req.params

    try {
      await users
        .deleteOne({_id: new ObjectId(id)})

      return res.code(204).send()
    } catch (e) {
      return res.code(500).send({ message: e.message })
    }
  })
}

module.exports.autoPrefix = '/user'
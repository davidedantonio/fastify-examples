'use strict'

const S = require('fluent-json-schema')
const securePassword = require('secure-password')
const DUPLICATE_KEY_ERROR = 11000

module.exports = async function (fastify, opts) {
  const authUser = fastify.mongo.example.db.collection('authUser')
  const pwd = securePassword()

  authUser.createIndex({
    username: 1
  }, { unique: true })

  fastify.post('/signup', {
    schema: {
      body: S.object()
        .prop('username', S.string()
          .maxLength(10)
          .description("The preferred username")
          .required())
        .prop('password', S.string()
          .description("The password")
          .required())
        .prop('fullName', S.string()
          .maxLength(50)
          .description("The name of the user")
          .required()),
      response: {
        200: S.object()
          .prop('token', S.string()),
        400: S.ref('errorSchema')
      }
    }
  },  
  async function (req, res) {
    const user = req.body
    const hashedPassword = await pwd.hash(Buffer.from(user.password))

    Object.assign(user, {
      password: hashedPassword
    })

    try {
      await authUser.insertOne(user)
    } catch (err) {
      // duplicate key error
      if (err.code === DUPLICATE_KEY_ERROR) {
        return res.code(400).send({ message: 'username already registered' })
      }
    }

    const token = await res.jwtSign({ username: user.username, fullName: user.fullName })
    return { token: token }
  })

  fastify.post('/signin', {
    schema: {
      body: S.object()
        .prop('username', S.string()
          .description("The preferred username")
          .required())
        .prop('password', S.string()
          .description("The user password")
          .required()),
      response: {
        200: S.object()
          .prop('token', S.string()),
        404: S.object()
          .prop('message', S.string()),
        400: S.object()
          .prop('message', S.string())
      }
    }
  }, async function (request, reply) {
    const { username, password } = request.body
    const user = await authUser.findOne({ username: username })

    if (!user) {
      reply
        .code(404)
        .send({ message: 'username not found' })
      return
    }

    const res = await pwd.verify(Buffer.from(password), user.password.buffer)
    switch (res) {
      case securePassword.INVALID_UNRECOGNIZED_HASH:
        reply
          .code(400)
          .send({ message: 'This hash was not made with secure-password. Attempt legacy algorithm' })
        return
      case securePassword.INVALID:
        reply
          .code(400)
          .send({ message: 'Invalid password' })
        return
      case securePassword.VALID_NEEDS_REHASH:
        const hashedPassword = await pwd.hash(Buffer.from(password))
        await authUser.update({ _id: user._id }, { hashedPassword })
        break
    }

    const token = await reply.jwtSign({ username: username, fullName: user.fullName })
    return { token: token }
  })
}
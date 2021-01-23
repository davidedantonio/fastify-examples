'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = async function (fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // loads all schemas
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'schema'),
    options: Object.assign({}, opts)
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'hooks'),
    options: Object.assign({ prefix: '/api' }, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes', 'private'),
    options: Object.assign({ prefix: '/api' }, opts)
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes', 'public'),
    options: Object.assign({}, opts)
  })
}

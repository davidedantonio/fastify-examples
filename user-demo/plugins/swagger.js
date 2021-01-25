'use strict'

const fp = require('fastify-plugin')
const Swagger = require('fastify-swagger')
const path = require('path')
const fs = require('fs')

module.exports = fp(async (fastify, opts) => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json')))
  
  const options = Object.assign({
    routePrefix: '/documentation',
    exposeRoute: true,
    swagger: {
      info: {
        title: `${packageJson.name}: Example App swagger`,
        description: packageJson.description,
        version: packageJson.version
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
      host: `${process.env.FASTIFY_ADDRESS}:${process.env.FASTIFY_PORT}`,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    }
  }, opts.swagger)

  fastify.register(Swagger, options)
})
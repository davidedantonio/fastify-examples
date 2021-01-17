# Lesson 1

## Demo 1

A Basic Demo on fastify usage

```
const fastify = require('fastify')({ logger: true })

// Declare a route for our application
fastify.get('/', async (req, res) => {
  return { hello: 'world' }
})

const startServer = async port => {
  try {
    await fastify.listen(port)
    fastify.log.info(`Server started on http://localhost:${port}`)
  } catch (e) {
    fastify.log.error(e)
    process.exit(1)
  }
}

startServer(3000)
```

## Demo 2

Our first route

```
async function routes (fastify, options) {
  fastify.get('/', async (request, reply) => {
    return { hello: 'World' }
  })
}

module.exports = routes
```

## Demo 3

Register multiple routes with different log level 

```
fastify.register(require('./api-v1.js'), { prefix: '/v1', logLevel: 'error' })
fastify.register(require('./api-v2.js'), { prefix: '/v2' })
```

## Demo 4

Learn about JSON Schema and Hooks

```
fastify.route({
  method: 'POST',
  url: '/',
  schema: {
    body: S.object()
      .prop('name', S.string().required()),
    response: {
      200: S.object()
        .prop('message', S.string())  
    }
  },
  onRequest: async (request, reply) => {
    fastify.log.info("onRequest")
  },
  preValidation: async (request, reply) => {
    fastify.log.info("preValidation")
  },
  preHandler: async (request, reply) => {
    fastify.log.info("preHandler")
  },
  preSerialization: async (request, reply) => {
    fastify.log.info("preSerialization")
  },
  handler: async (request, reply) => {
    const { name } = request.body
    return { message: `Hello, ${name}` }
  }
})
```

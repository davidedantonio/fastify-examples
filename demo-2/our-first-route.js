async function routes (fastify, options) {
  fastify.get('/say-hello', async (request, reply) => {
    return { hello: 'World' }
  })
}

module.exports = routes

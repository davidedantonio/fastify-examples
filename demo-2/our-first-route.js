module.exports = async function (fastify, options) {
  fastify.get('/say-hello', async (request, reply) => {
    return { hello: 'World' }
  })
}
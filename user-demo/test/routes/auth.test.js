'use strict'

const { test } = require('tap')
const { 
  build
} = require('../helper')

test('cannot create auth User', async (t) => {
  const app = build(t)

  const res400 = await app.inject({
    method: 'POST',
    url: '/signup',
    body: {
      username: 'ddantonio',
      fullName: 'Davide D\'Antonio'
    }
  })

  t.equal(res400.statusCode, 400)
})

test('create auth User', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/signup',
    body: {
      username: 'ddantonio',
      fullName: 'Davide D\'Antonio',
      password: 'pippo'
    }
  })

  t.equal(res.statusCode, 200)
  t.equal(typeof JSON.parse(res.body), 'object')
  t.equal(typeof JSON.parse(res.body).token, 'string')
})

test('Create user and Login', async (t) => {
  const app = build(t)

  await app.inject({
    method: 'POST',
    url: '/signup',
    body: {
      username: 'ddantonio',
      fullName: 'Davide D\'Antonio',
      password: 'pippo'
    }
  })

  const res = await app.inject({
    method: 'POST',
    url: '/signin',
    body: {
      username: 'ddantonio',
      password: 'pippo'
    }
  })

  t.equal(res.statusCode, 200)
  t.equal(typeof JSON.parse(res.body), 'object')
  t.equal(typeof JSON.parse(res.body).token, 'string')
})

test('Create user and bad login', async (t) => {
  const app = build(t)

  await app.inject({
    method: 'POST',
    url: '/signup',
    body: {
      username: 'ddantonio',
      fullName: 'Davide D\'Antonio',
      password: 'pippo'
    }
  })

  const res = await app.inject({
    method: 'POST',
    url: '/signin',
    body: {
      username: 'ddantonio2',
      password: 'pippo'
    }
  })

  t.equal(res.statusCode, 404)

  const res2 = await app.inject({
    method: 'POST',
    url: '/signin',
    body: {
      username: 'ddantonio',
      password: 'pippo2'
    }
  })

  t.equal(res2.statusCode, 400)
})

test('Create user and bad request', async (t) => {
  const app = build(t)

  await app.inject({
    method: 'POST',
    url: '/signup',
    body: {
      username: 'ddantonio',
      fullName: 'Davide D\'Antonio',
      password: 'pippo'
    }
  })

  const res = await app.inject({
    method: 'POST',
    url: '/signin',
    body: {
      username: 'ddantonio2'
    }
  })

  t.equal(res.statusCode, 400)
})

'use strict'

const { test } = require('tap')
const { 
  build,
  testWithLogin
} = require('../helper')

test('cannot create a user without a login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/user',
    body: {
      username: 'ddantonio',
      name: 'Davide',
      surname: 'D\'Antonio',
      age: 36
    }
  })

  t.equal(res.statusCode, 401)
})

test('cannot list users without a login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/api/user/all'
  })

  t.equal(res.statusCode, 401)
})

test('cannot delete user without a login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'DELETE',
    url: '/api/user/1111111111116994534a575ff'
  })

  t.equal(res.statusCode, 401)
})

test('cannot get user without a login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/api/user/1111111111116994534a575ff'
  })

  t.equal(res.statusCode, 401)
})


testWithLogin('create a user', async (t, inject) => {
  const res = await inject({
    method: 'POST',
    url: '/api/user',
    body: {
      username: 'ddantonio',
      name: 'Davide',
      surname: 'D\'Antonio',
      age: 36
    }
  })

  t.equal(res.statusCode, 200)
  t.equal(JSON.parse(res.body).username, 'ddantonio')
  t.equal(JSON.parse(res.body).name, 'Davide')
  t.equal(JSON.parse(res.body).surname, 'D\'Antonio')
  t.equal(JSON.parse(res.body).age, 36)
})

testWithLogin('create and list users', async (t, inject) => {
  await inject({
    method: 'POST',
    url: '/api/user',
    body: {
      username: 'ddantonio',
      name: 'Davide',
      surname: 'D\'Antonio',
      age: 36
    }
  })
  
  await inject({
    method: 'POST',
    url: '/api/user',
    body: {
      username: 'dcapriglione',
      name: 'Davide',
      surname: 'Capriglione',
      age: 20
    }
  })

  let response = await inject({
    method: 'GET',
    url: '/api/user/all'
  })

  const all = JSON.parse(response.body)
  t.equal(all.length, 2)
  t.equal(response.statusCode, 200)
})

testWithLogin('create and and get user', async (t, inject) => {
  const response = await inject({
    method: 'POST',
    url: '/api/user',
    body: {
      username: 'ddantonio',
      name: 'Davide',
      surname: 'D\'Antonio',
      age: 36
    }
  })

  const userCreated = JSON.parse(response.body)
  const userResponse = await inject({
    method: 'GET',
    url: `/api/user/${userCreated._id}`
  })

  const user = JSON.parse(userResponse.body)
  t.deepEqual(userCreated, user)
  t.equal(userResponse.statusCode, 200)

  const user500 = await inject({
    method: 'GET',
    url: `/api/user/${userCreated._id}1`
  })

  t.equal(user500.statusCode, 500)
})


testWithLogin('create and and delete user', async (t, inject) => {
  const response = await inject({
    method: 'POST',
    url: '/api/user',
    body: {
      username: 'ddantonio',
      name: 'Davide',
      surname: 'D\'Antonio',
      age: 36
    }
  })

  const userCreated = JSON.parse(response.body)
  
  try {
    const res500 = await inject({
      method: 'DELETE',
      url: `/api/user/${userCreated._id}1`
    })

    t.equal(res500.statusCode, 500)
  } catch (e) {
    t.error(e)
  }

  try {
    const res500 = await inject({
      method: 'DELETE',
      url: `/api/user/1111111111116994534a575ff`
    })

    t.equal(res500.statusCode, 500)
  } catch (e) {
    t.error(e)
  }

  try {
    const user204 = await inject({
      method: 'DELETE',
      url: `/api/user/${userCreated._id}`
    })
    
    t.equal(user204.statusCode, 204)
  } catch (e) {
    t.error(e)
  }
})
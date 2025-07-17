const { test, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const app = require('../app')
const User = require('../models/user')
const config = require('../utils/config')
const helper = require('./test_helper')

const api = supertest(app)

before(async () => {
  await mongoose.connect(config.MONGODB_URI)
})

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash(helper.rootUser.password, 10)
  const user = new User({
    username: helper.rootUser.username,
    name: helper.rootUser.name,
    passwordHash
  })

  await user.save()
})

test('login succeeds with valid credentials and returns token', async () => {
  const response = await api
    .post('/api/login')
    .send({
      username: helper.rootUser.username,
      password: helper.rootUser.password
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.ok(response.body.token)
  assert.strictEqual(response.body.username, helper.rootUser.username)
})

test('login fails with wrong password', async () => {
  const response = await api
    .post('/api/login')
    .send({
      username: helper.rootUser.username,
      password: 'wrongpassword'
    })
    .expect(401)

  assert.match(response.body.error, /invalid username or password/i)
})

test('login fails with non-existing username', async () => {
  const response = await api
    .post('/api/login')
    .send({
      username: 'nonexistinguser',
      password: 'whatever'
    })
    .expect(401)

  assert.match(response.body.error, /invalid username or password/i)
})

after(async () => {
  await mongoose.connection.close()
})
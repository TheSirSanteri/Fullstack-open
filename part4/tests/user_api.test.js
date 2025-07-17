const { test, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const User = require('../models/user')
const config = require('../utils/config')
const helper = require('./test_helper')

const api = supertest(app)

before(async () => {
  console.log('NODE_ENV:', process.env.NODE_ENV)
  await mongoose.connect(config.MONGODB_URI)
})

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ 
    username: helper.rootUser.username, 
    name: helper.rootUser.name, 
    passwordHash 
  })
  await user.save()

})

test('creation fails with proper statuscode and message if username is taken', async () => {

  const result = await api
    .post('/api/users')
    .send(helper.rootUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error.includes('unique'))

  const users = await helper.usersInDb()
  assert.strictEqual(users.length, 1)
})

test('creation fails if username is too short', async () => {

  const result = await api
    .post('/api/users')
    .send(helper.userWithShortUsername)
    .expect('Content-Type', /application\/json/)
    .expect(400)

  assert.match(result.body.error, /username.*at least 3/i)

  const users = await User.find({})
  assert.strictEqual(users.length, 1)
})

test('creation fails if password is too short', async () => {

  const result = await api
    .post('/api/users')
    .send(helper.userWithShortPassword)
    .expect('Content-Type', /application\/json/)
    .expect(400)

  assert.match(result.body.error, /password.*at least 3/i)

  const users = await User.find({})
  assert.strictEqual(users.length, 1)
})

test('creation succeeds with fresh username', async () => {
  const usersAtStart = await helper.usersInDb()

  const result = await api
    .post('/api/users')
    .send(helper.newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(result.body.username, 'newuser')

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})

const { test, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const config = require('../utils/config')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const api = supertest(app)

const initialBlogs = helper.initialBlogs
let token = null

before(async () => {
  console.log('NODE_ENV:', process.env.NODE_ENV)
  await mongoose.connect(config.MONGODB_URI)
})

beforeEach(async () => {
  // Tyhjennetään blogit ja käyttäjät
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Luodaan testikäyttäjä helper.rootUser-datan perusteella
  const testUser = helper.newUser
  const passwordHash = await bcrypt.hash(testUser.password, 10)
  const user = new User({
    username: testUser.username,
    name: testUser.name,
    passwordHash
  })
  const savedUser = await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: testUser.username,
      password: testUser.password
    })

  token = loginResponse.body.token

  // 3) Liitä käyttäjä jokaiseen initialBlog-dokumenttiin
  const blogsWithUser = initialBlogs.map(blog => ({
    ...blog,
    user: savedUser._id
  }))
  await Blog.insertMany(blogsWithUser)
})

test('a valid blog can be added', async () => {
  const blogsAtStart = await helper.blogsInDb()

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(helper.newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
})

test('returns all blogs', async () => {
//  console.log('--- Testi alkaa ---')
  const response = await api.get('/api/blogs')
//  console.log('Vastaus haettu:', response.body)

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blogs are returned in JSON format', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  blogs.forEach(blog => {
    assert.ok(blog.id, 'blog.id should be defined')
    assert.strictEqual(blog._id, undefined, '_id should not be present')
  })
})

test('if likes property is missing, it defaults to 0', async () => {
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(helper.blogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added and returns 400', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(helper.blogWithoutTitle)
    .expect(400)
})

test('blog without url is not added and returns 400', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(helper.blogWithoutUrl)
    .expect(400)
})

test('a blog can be deleted by its creator', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test('a blogs likes can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedData = { likes: blogToUpdate.likes + 1 }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
})

test('blog post includes user info', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  
  assert.ok(blog.user)
  assert.ok(blog.user.username)
  assert.ok(blog.user.name)
})

test('blog cannot be added without token, returns 401', async () => {
  const blogsAtStart = await helper.blogsInDb()

  await api
    .post('/api/blogs')
    .send(helper.newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

after(async () => {
  await mongoose.connection.close()
})
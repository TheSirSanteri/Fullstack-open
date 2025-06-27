const { test, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const config = require('../utils/config')


const api = supertest(app)

const initialBlogs = helper.initialBlogs

before(async () => {
   await mongoose.connect(config.MONGODB_URI)
})

beforeEach(async () => {
//  console.log('NODE_ENV:', process.env.NODE_ENV)
//  console.log('MONGODB_URI käytössä:', require('../utils/config').MONGODB_URI)
//  console.log('beforeEach alkaa')
  await Blog.deleteMany({})
//  console.log('Tietokanta tyhjennetty')

//  console.log('Lisättävät blogit:', helper.initialBlogs)
  await Blog.insertMany(helper.initialBlogs)
//  console.log('Blogit lisätty tietokantaan')
})

test('a valid blog can be added', async () => {
  const blogsAtStart = await helper.blogsInDb()
  await api
    .post('/api/blogs')
    .send(helper.newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert.ok(titles.includes(helper.newBlog.title), 'New blog title should be in the list')
})

test('blogs are returned in JSON format', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('returns all blogs', async () => {
//  console.log('--- Testi alkaa ---')
  const response = await api.get('/api/blogs')
//  console.log('Vastaus haettu:', response.body)

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  blogs.forEach(blog => {
    assert.ok(blog.id, 'blog.id should be defined')
    assert.strictEqual(blog._id, undefined, '_id should not be present')
  })
})


after(async () => {
  await mongoose.connection.close()
})
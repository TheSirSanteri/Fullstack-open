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

test('if likes property is missing from request, it will default to 0', async () => {
  const response = await api
    .post('/api/blogs')
    .send(helper.blogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added and returns 400', async () => {
  await api
    .post('/api/blogs')
    .send(helper.blogWithoutTitle)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url is not added and returns 400', async () => {

  await api
    .post('/api/blogs')
    .send(helper.blogWithoutUrl)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  //console.log('Blogs at start:', blogsAtStart)
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  //console.log('Blogs at end:', blogsAtEnd)
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

  const ids = blogsAtEnd.map(b => b.id)
  assert.ok(!ids.includes(blogToDelete.id))
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


after(async () => {
  await mongoose.connection.close()
})
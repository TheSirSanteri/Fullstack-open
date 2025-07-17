const express = require('express')
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

const blogsRouter = express.Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const { title, url, author, likes } = request.body

  if (!title || !url) {
    return response.status(400).end()
  }

  try {
    const user = await User.findOne()
    if (!user) {
      return response.status(400).json({ error: 'no user available' })
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const populated = await savedBlog.populate('user', { username: 1, name: 1 })
    return response.status(201).json(populated.toJSON())
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    response.status(400).json({ error: 'malformatted id' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true, runValidators: true, context: 'query' }
    )

    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    response.status(400).json({ error: 'invalid id or data' })
  }
})

module.exports = blogsRouter
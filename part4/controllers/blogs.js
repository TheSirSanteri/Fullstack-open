const express = require('express')
const Blog = require('../models/blog')
const userExtractor = require('../middleware/userExtractor')

const blogsRouter = express.Router()

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username:1, name:1 })
  res.json(blogs)
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  const { title, url, author, likes } = req.body
  const user = req.user

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
  return res.status(201).json(populated.toJSON())
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const user = req.user
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user.id.toString()) {
    return res.status(403).json({ error: 'unauthorized to delete this blog' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res, next) => {
  const { likes } = req.body

  try {
    const updated = await Blog
      .findByIdAndUpdate(
        req.params.id,
        { likes },
        { new: true, runValidators: true, context: 'query' }
      )
      .populate('user', { username: 1, name: 1 })

    if (updated) {
      res.json(updated.toJSON())
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
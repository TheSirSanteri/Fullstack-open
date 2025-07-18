const router = require('express').Router()
const Blog = require('../models/blog') // vaihda oikeaan polkuun
const User = require('../models/user') // vaihda oikeaan polkuun

router.get('/ping', (req, res) => {
  res.send('pong')
})

router.post('/reset', async (req, res) => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  res.status(204).end()
})

module.exports = router
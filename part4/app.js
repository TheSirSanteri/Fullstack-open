const express = require('express')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users.js')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use((error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  if (error.name === 'MongoServerError' && error.code === 11000) {
    return res.status(400).json({ error: 'Username must be unique' })
  }
  next(error)
})

module.exports = app
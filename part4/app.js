const express = require('express')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users.js')
const loginRouter = require('./controllers/login')
const tokenExtractor = require('./middleware/tokenExtractor')
//const userExtractor = require('./middleware/userExtractor')

const app = express()

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing.js') 
  app.use('/api/testing', testingRouter)
}

app.use((error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  if (error.name === 'MongoServerError' && error.code === 11000) {
    return res.status(400).json({ error: 'Username must be unique' })
  }
  if (error.name === 'JsonWebTokenError') {
  return res.status(401).json({ error: 'invalid token' })
}
if (error.name === 'TokenExpiredError') {
  return res.status(401).json({ error: 'token expired' })
}
  next(error)
})

module.exports = app
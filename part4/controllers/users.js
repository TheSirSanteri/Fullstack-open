const bcrypt = require('bcryptjs')
const express = require('express')
const User = require('../models/user')

const usersRouter = express.Router()

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  try {
    const { username, name, password } = request.body

    if (!username || username.length < 3) {
      return response.status(400).json({ error: 'Username must be at least 3 characters long' })
    }

    if (!password || password.length < 3) {
      return response.status(400).json({ error: 'Password must be at least 3 characters long' })
    }

    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return response.status(400).json({ error: 'Username must be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  response.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = usersRouter

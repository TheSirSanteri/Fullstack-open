const bcrypt = require('bcryptjs')
const express = require('express')
const User = require('../models/user.js')

const usersRouter = express.Router()

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1 })
  res.json(users)
})

usersRouter.post('/', async (req, res, next) => {
  const { username, name, password } = req.body

  // 1) Username length
  if (!username || username.length < 3) {
    return res
      .status(400)
      .json({ error: 'Username must be at least 3 characters long' })
  }

  // 2) Password length
  if (!password || password.length < 3) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 3 characters long' })
  }

  // 3) Duplication check
  const existing = await User.findOne({ username })
  if (existing) {
    return res
      .status(400)
      .json({ error: 'Username must be unique' })
  }

  // 4) Hash & save
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({ username, name, passwordHash })
  const savedUser = await user.save()

  // 5) Respond 201
  return res.status(201).json(savedUser)
})

module.exports = usersRouter

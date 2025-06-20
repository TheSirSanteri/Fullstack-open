const dotenv = require('dotenv')
const { model } = require('mongoose')
dotenv.config()

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI

module.exports =  {
  MONGODB_URI,
  PORT
}
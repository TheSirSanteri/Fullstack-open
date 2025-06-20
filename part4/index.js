import mongoose from 'mongoose'
import config from './utils/config.js'
import app from './app.js'

mongoose.connect(process.env.MONGODB_URI)

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
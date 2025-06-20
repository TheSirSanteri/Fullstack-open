import express from 'express'
import cors from 'cors'
import blogsRouter from './controllers/blogs.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

export default app
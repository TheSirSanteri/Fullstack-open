const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Blogi 1',
    author: 'Testaaja',
    url: 'http://1.com',
    likes: 5,
  },
  {
    title: 'Blogi 2',
    author: 'Testaaja',
    url: 'http://2.com',
    likes: 10,
  },
]

// Blog for POST request tests
const newBlog = {
  title: 'Blogi POST',
  author: 'Testaaja',
  url: 'http://post.com',
  likes: 3,
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  newBlog,
}

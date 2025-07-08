const Blog = require('../models/blog')
const user = require('../models/user')

// This file contains test data for the blog API tests. 

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

// Blog without likes for testing default value
const blogWithoutLikes = {
  title: 'Blog without likes',
  author: 'Testaaja',
  url: 'http://nolikes.com'
  // likes missing
}

// Blog without title for testing validation
const blogWithoutTitle = {
  author: 'Testaaja',
  url: 'http://notitle.com',
  likes: 2
}

// Blog without url for testing validation
const blogWithoutUrl = {
  title: 'Blog without URL',
  author: 'Testaaja',
  likes: 12
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

// workint user
const newUser = {
  username: 'newuser',
  name: 'Valid',
  password: 'HallintoLohjokas22',
}

//alreadt existing username
const rootUser = {
  username: 'root',
  name: 'Test User',
  password: 'testpassword'
}

// user with too short username
const userWithShortUsername = {
  username: 'ro',
  name: 'Ronaldo',
  password: 'testpassword'
}

// user with too short password
const userWithShortPassword = {
  username: 'ronalder',
  name: 'Short',
  password: 'pw'
}

module.exports = {
  initialBlogs,
  blogsInDb,
  newBlog,
  blogWithoutLikes,
  blogWithoutTitle,
  blogWithoutUrl,
  newUser,
  rootUser,
  userWithShortUsername,
  userWithShortPassword,
}

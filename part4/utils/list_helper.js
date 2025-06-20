const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((fav, blog) => (blog.likes > fav.likes ? blog : fav))
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const countMap = {}

  for (const blog of blogs) {
    countMap[blog.author] = (countMap[blog.author] || 0) + 1
  }

  let maxAuthor = null
  let maxCount = 0

  for (const author in countMap) {
    if (countMap[author] > maxCount) {
      maxAuthor = author
      maxCount = countMap[author]
    }
  }

  return {
    author: maxAuthor,
    blogs: maxCount
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likeMap = {}

  for (const blog of blogs) {
    likeMap[blog.author] = (likeMap[blog.author] || 0) + (blog.likes || 0)
  }

  let topAuthor = null
  let maxLikes = 0

  for (const author in likeMap) {
    if (likeMap[author] > maxLikes) {
      topAuthor = author
      maxLikes = likeMap[author]
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  
}
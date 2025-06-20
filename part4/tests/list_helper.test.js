const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const listWithManyBlogs = [
    {
      title: 'First',
      likes: 3
    },
    {
      title: 'Second',
      likes: 7
    },
    {
      title: 'Third',
      likes: 10
    }
  ]

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(result, 20)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '1',
      title: 'Blog A',
      author: 'Author A',
      url: 'http://a.com',
      likes: 3,
      __v: 0
    },
    {
      _id: '2',
      title: 'Blog B',
      author: 'Author B',
      url: 'http://b.com',
      likes: 7,
      __v: 0
    },
    {
      _id: '3',
      title: 'Blog C',
      author: 'Author C',
      url: 'http://c.com',
      likes: 5,
      __v: 0
    }
  ]

  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[1])
  })

  test('returns null for empty list', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})

describe('most blogs', () => {
  const blogs = [
    { title: 'Blog 1', author: 'Robert C. Martin' },
    { title: 'Blog 2', author: 'Martin Fowler' },
    { title: 'Blog 3', author: 'Robert C. Martin' },
    { title: 'Blog 4', author: 'Martin Fowler' },
    { title: 'Blog 5', author: 'Robert C. Martin' },
  ]

  test('returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

  test('returns null for empty list', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })
})

describe('most likes', () => {
  const blogs = [
    { title: 'Blog A', author: 'Edsger W. Dijkstra', likes: 5 },
    { title: 'Blog B', author: 'Robert C. Martin', likes: 3 },
    { title: 'Blog C', author: 'Edsger W. Dijkstra', likes: 12 },
    { title: 'Blog D', author: 'Martin Fowler', likes: 7 },
  ]

  test('returns the author with most total likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })

  test('returns null for empty list', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })
})
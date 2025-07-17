import { useRef } from 'react'
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })

  const blogFormRef = useRef()

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: null }), 5000)
  } 

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      showNotification(`Welcome ${user.name}`, 'success')
    } catch (exception) {
      showNotification(exception.message, 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      blogFormRef.current.toggleVisibility()
      showNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`, 'success')
    } catch (error) {
      const message = error.response?.data?.error || 'Blog creation failed'
      showNotification(message, 'error')
    }
  }

  const likeBlog = async (blogToUpdate) => {
    if (!blogToUpdate.user) {
      showNotification('Cannot like blog: missing user data', 'error')
      return
    }

    const updatedBlog = {
      likes: blogToUpdate.likes + 1,
      user: typeof blogToUpdate.user === 'object' ? blogToUpdate.user.id : blogToUpdate.user
    }

    try {
      const returnedBlog = await blogService.update(blogToUpdate.id, updatedBlog)
      setBlogs(blogs.map(b =>
        b.id === blogToUpdate.id
          ? { ...b, likes: returnedBlog.likes }
          : b
      ))
    } catch (error) {
      showNotification('Failed to like blog', 'error')
    }
  }

  const deleteBlog = async (blogToDelete) => {
    const ok = window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)
    if (!ok) return

    try {
      await blogService.remove(blogToDelete.id)
      setBlogs(blogs.filter(b => b.id !== blogToDelete.id))
      showNotification(`Deleted blog "${blogToDelete.title}"`, 'success')
    } catch (error) {
      showNotification('Failed to delete blog', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h1>blogs</h1>
      <Notification message={notification.message} type={notification.type} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel="Add new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {sortedBlogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog} 
          onLike={likeBlog}
          onDelete={deleteBlog}
          currentUser={user}
        />
    )}
    </div>
  )
}

export default App
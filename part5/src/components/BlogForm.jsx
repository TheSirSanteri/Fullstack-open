import PropTypes from 'prop-types'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title, author, url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
  <div>
    <h1>create new</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label>title: <input value={title} onChange={({ target }) => setTitle(target.value)} /></label>
      </div>
      <div>
        <label>author: <input value={author} onChange={({ target }) => setAuthor(target.value)} /></label>
      </div>
      <div>
        <label>url: <input value={url} onChange={({ target }) => setUrl(target.value)} /></label>
      </div>
      <button type="submit">create</button>
    </form>
  </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
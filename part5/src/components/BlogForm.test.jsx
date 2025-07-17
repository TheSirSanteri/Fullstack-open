import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls createBlog with correct details when form is submitted', () => {
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText(/title/i)
  const authorInput = screen.getByLabelText(/author/i)
  const urlInput = screen.getByLabelText(/url/i)
  const createButton = screen.getByText('create')

  fireEvent.change(titleInput, { target: { value: 'Test Title' } })
  fireEvent.change(authorInput, { target: { value: 'Test Author' } })
  fireEvent.change(urlInput, { target: { value: 'http://test.url' } })
  fireEvent.click(createButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.url'
  })
})
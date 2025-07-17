import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Blog from './Blog'

test('renders title and author, More info is showed only after cliking "view"', () => {
  const blog = {
    title: 'Testing Blog Component',
    author: 'Santsu Developer',
    url: 'http://example.com',
    likes: 5,
    user: {
      username: 'SantsuDev',
      name: 'Sane Deve',
    },
  }

  const currentUser = { username: 'SantsuDev' }

  render(<Blog blog={blog} currentUser={currentUser} onLike={vi.fn()} onDelete={vi.fn()} />)

  // Title and author are displayed
  expect(screen.getByText((content, element) =>
    content.startsWith('Testing Blog Component') &&
    element.textContent.includes('Santsu Developer')
  )).toBeDefined()

  // Does not display URL or likes by default
  expect(screen.queryByText('http://example.com')).toBeNull()
  expect(screen.queryByText(/likes 5/)).toBeNull()

  // View button is present and clicked
  const viewButton = screen.getByText('view')
  fireEvent.click(viewButton)

  // More info is displayed after clicking view
  expect(screen.getByText('http://example.com')).toBeInTheDocument()
  expect(screen.getByText(/likes 5/)).toBeInTheDocument()
  expect(screen.getByText('Sane Deve')).toBeInTheDocument()
})

test('like button calls event handler twice when clicked twice', () => {
  const blog = {
    title: 'Testing Blog Component',
    author: 'Santsu Developer',
    url: 'http://example.com',
    likes: 5,
    user: {
      username: 'SantsuDev',
      name: 'Sane Deve',
    },
  }

  const currentUser = { username: 'SantsuDev' }
  const mockHandler = vi.fn()

  render(<Blog blog={blog} currentUser={currentUser} onLike={mockHandler} onDelete={vi.fn()} />)

  // Avaa blogin tiedot näkyviin
  fireEvent.click(screen.getByText('view'))

  const likeButton = screen.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})
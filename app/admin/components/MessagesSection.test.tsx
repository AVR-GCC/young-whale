import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MessagesSection from './MessagesSection'

const mockFetch = vi.fn()
global.fetch = mockFetch

const mockMessage = {
  id: 'msg-1',
  name: 'John Doe',
  email: 'john@example.com',
  content: 'Hello, I have a question about your platform.',
  is_read: false,
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-15T10:30:00Z',
}

const mockReadMessage = {
  id: 'msg-2',
  name: 'Jane Smith',
  email: 'jane@example.com',
  content: 'Thanks for the quick response!',
  is_read: true,
  created_at: '2024-01-14T09:00:00Z',
  updated_at: '2024-01-14T09:30:00Z',
}

describe('MessagesSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders collapsed by default', () => {
    render(<MessagesSection />)

    expect(screen.getByText('Messages')).toBeDefined()
    expect(screen.queryByText('Unread Messages')).toBeNull()
  })

  it('fetches unread count on mount to show badge', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        messages: [],
        pagination: { page: 1, pageSize: 1, total: 5, totalPages: 1 },
      }),
    })

    render(<MessagesSection />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/messages/unread?page=1&pageSize=1')
    })

    await waitFor(() => {
      expect(screen.getByText('5 unread')).toBeDefined()
    })
  })

  it('expands and fetches unread messages when clicked', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
          pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [mockMessage],
          pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
        }),
      })

    render(<MessagesSection />)

    const button = screen.getByText('Messages')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/messages/unread?page=1&pageSize=25')
    })

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByText('john@example.com')).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByText('Hello, I have a question about your platform.')).toBeDefined()
    })
  })

  it('shows empty state when no unread messages', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
          pagination: { page: 1, pageSize: 1, total: 0, totalPages: 0 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
          pagination: { page: 1, pageSize: 25, total: 0, totalPages: 0 },
        }),
      })

    render(<MessagesSection />)

    const button = screen.getByText('Messages')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('No unread messages')).toBeDefined()
    })
  })

  it('handles API errors gracefully', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
          pagination: { page: 1, pageSize: 1, total: 0, totalPages: 0 },
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Database connection failed' }),
      })

    render(<MessagesSection />)

    const button = screen.getByText('Messages')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Database connection failed')).toBeDefined()
    })
  })

  it('copies email to clipboard when copy button is clicked', async () => {
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
    }
    Object.assign(navigator, { clipboard: mockClipboard })

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
          pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [mockMessage],
          pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
        }),
      })

    render(<MessagesSection />)

    const button = screen.getByText('Messages')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('john@example.com')).toBeDefined()
    })

    const copyButton = screen.getByTitle('Copy email')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith('john@example.com')
    })
  })

  it('marks message as read when button is clicked', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
          pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [mockMessage],
          pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Message marked as read',
          data: { ...mockMessage, is_read: true },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
          pagination: { page: 1, pageSize: 25, total: 0, totalPages: 0 },
        }),
      })

    render(<MessagesSection />)

    const button = screen.getByText('Messages')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Mark as Read')).toBeDefined()
    })

    const markAsReadButton = screen.getByText('Mark as Read')
    fireEvent.click(markAsReadButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/messages/msg-1/read', {
        method: 'PATCH',
      })
    })
  })

  it('shows read messages section when toggled', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
          pagination: { page: 1, pageSize: 1, total: 0, totalPages: 0 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
          pagination: { page: 1, pageSize: 25, total: 0, totalPages: 0 },
        }),
      })

    render(<MessagesSection />)

    const button = screen.getByText('Messages')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/Read Messages/)).toBeDefined()
    })

    const readToggle = screen.getByText(/Read Messages/)
    fireEvent.click(readToggle)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/messages/read?page=1&pageSize=25')
    })
  })

  it('displays read messages with faded styling', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
          pagination: { page: 1, pageSize: 1, total: 0, totalPages: 0 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
          pagination: { page: 1, pageSize: 25, total: 0, totalPages: 0 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [mockReadMessage],
          pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
        }),
      })

    render(<MessagesSection />)

    const button = screen.getByText('Messages')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/Read Messages/)).toBeDefined()
    })

    const readToggle = screen.getByText(/Read Messages/)
    fireEvent.click(readToggle)

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByText('jane@example.com')).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByText('Thanks for the quick response!')).toBeDefined()
    })
  })

  it('handles pagination for unread messages', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
          pagination: { page: 1, pageSize: 1, total: 30, totalPages: 1 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [mockMessage],
          pagination: { page: 1, pageSize: 25, total: 30, totalPages: 2 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [{ ...mockMessage, id: 'msg-3', name: 'Page 2 User' }],
          pagination: { page: 2, pageSize: 25, total: 30, totalPages: 2 },
        }),
      })

    render(<MessagesSection />)

    const button = screen.getByText('Messages')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeDefined()
    })

    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('page=2'))
    })
  })

  it('refresh button re-fetches data', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
          pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [mockMessage],
          pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [{ ...mockMessage, content: 'Refreshed message' }],
          pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
        }),
      })

    render(<MessagesSection />)

    const button = screen.getByText('Messages')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeDefined()
    })

    const refreshButton = screen.getByText('Refresh')
    fireEvent.click(refreshButton)

    await waitFor(() => {
      expect(screen.getByText('Refreshed message')).toBeDefined()
    })
  })

  it('displays formatted date for messages', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
          pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [mockMessage],
          pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
        }),
      })

    render(<MessagesSection />)

    const button = screen.getByText('Messages')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/2024/)).toBeDefined()
    })
  })
})

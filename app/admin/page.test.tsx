import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Admin from './page'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Admin page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title and buttons', () => {
    render(<Admin />)

    expect(screen.getByText('Young Whale admin')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Run Reset' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Run Process' })).toBeDefined()
  })

  it('calls reset API and shows success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Reset completed successfully' }),
    })

    render(<Admin />)
    const button = screen.getByRole('button', { name: 'Run Reset' })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/reset')
    })

    await waitFor(() => {
      expect(screen.getByText('Success: Reset completed successfully')).toBeDefined()
    })
  })

  it('shows error when reset API fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Unauthorized' }),
    })

    render(<Admin />)
    const button = screen.getByRole('button', { name: 'Run Reset' })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Error: Unauthorized')).toBeDefined()
    })
  })

  it('calls process API and shows success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ processed: 5, failed: 1 }),
    })

    render(<Admin />)
    const button = screen.getByRole('button', { name: 'Run Process' })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/cron/process')
    })

    await waitFor(() => {
      expect(screen.getByText('Processed: 5, Failed: 1')).toBeDefined()
    })
  })

  it('shows error when process API fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Database error' }),
    })

    render(<Admin />)
    const button = screen.getByRole('button', { name: 'Run Process' })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Error: Database error')).toBeDefined()
    })
  })

  it('shows loading state while reset is running', async () => {
    let resolveResponse: (value: Response) => void
    const promise = new Promise<Response>((resolve) => {
      resolveResponse = resolve
    })
    mockFetch.mockReturnValueOnce(promise)

    render(<Admin />)
    const button = screen.getByRole('button', { name: 'Run Reset' })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Running Reset...' }).hasAttribute('disabled')).toBe(true)
    })

    resolveResponse!({
      ok: true,
      json: async () => ({ success: true, message: 'Done' }),
    } as Response)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Run Reset' }).hasAttribute('disabled')).toBe(false)
    })
  })

  it('shows loading state while process is running', async () => {
    let resolveResponse: (value: Response) => void
    const promise = new Promise<Response>((resolve) => {
      resolveResponse = resolve
    })
    mockFetch.mockReturnValueOnce(promise)

    render(<Admin />)
    const button = screen.getByRole('button', { name: 'Run Process' })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Running Process...' }).hasAttribute('disabled')).toBe(true)
    })

    resolveResponse!({
      ok: true,
      json: async () => ({ processed: 0, failed: 0 }),
    } as Response)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Run Process' }).hasAttribute('disabled')).toBe(false)
    })
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FailedTokensSection from './FailedTokensSection'

const mockFetch = vi.fn()
global.fetch = mockFetch

const mockFailedToken = {
  id: 'raw-token-1',
  name: 'Failed Token',
  symbol: 'FAIL',
  chain: 'ethereum',
  contract_address: '0xabc123',
  source_type: 'coinbase',
  status: 'failed',
  error_message: 'AI processing failed: invalid JSON response',
  retry_count: 2,
  raw_payload: { id: 123, name: 'Failed Token', symbol: 'FAIL' },
  created_at: '2024-01-15T10:30:00Z',
}

describe('FailedTokensSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders collapsed by default', () => {
    render(<FailedTokensSection />)

    expect(screen.getByText('Failed Tokens')).toBeDefined()
    expect(screen.queryByText('No failed tokens found')).toBeNull()
  })

  it('expands and fetches failed tokens when clicked', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rawTokens: [mockFailedToken],
        pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
      }),
    })

    render(<FailedTokensSection />)

    const button = screen.getByText('Failed Tokens')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/raw-tokens/failed?page=1&pageSize=25')
    })

    await waitFor(() => {
      expect(screen.getByText('FAIL')).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByText('Failed Token')).toBeDefined()
    })
  })

  it('displays error message prominently', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rawTokens: [mockFailedToken],
        pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
      }),
    })

    render(<FailedTokensSection />)

    const button = screen.getByText('Failed Tokens')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('AI processing failed: invalid JSON response')).toBeDefined()
    })
  })

  it('shows raw data when toggled', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rawTokens: [mockFailedToken],
        pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
      }),
    })

    render(<FailedTokensSection />)

    const button = screen.getByText('Failed Tokens')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Show Raw Data')).toBeDefined()
    })

    const toggleButton = screen.getByText('Show Raw Data')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(screen.getByText(/"id": 123/)).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByText(/"name": "Failed Token"/)).toBeDefined()
    })
  })

  it('shows empty state when no failed tokens', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rawTokens: [],
        pagination: { page: 1, pageSize: 25, total: 0, totalPages: 0 },
      }),
    })

    render(<FailedTokensSection />)

    const button = screen.getByText('Failed Tokens')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('No failed tokens found')).toBeDefined()
    })
  })

  it('handles API errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Database connection failed' }),
    })

    render(<FailedTokensSection />)

    const button = screen.getByText('Failed Tokens')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Database connection failed')).toBeDefined()
    })
  })

  it('shows loading state while fetching', async () => {
    let resolveResponse: (value: Response) => void
    const promise = new Promise<Response>((resolve) => {
      resolveResponse = resolve
    })
    mockFetch.mockReturnValueOnce(promise)

    render(<FailedTokensSection />)

    const button = screen.getByText('Failed Tokens')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.queryByText('No failed tokens found')).toBeNull()
    })

    resolveResponse!({
      ok: true,
      json: async () => ({
        rawTokens: [mockFailedToken],
        pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
      }),
    } as Response)

    await waitFor(() => {
      expect(screen.getByText('FAIL')).toBeDefined()
    })
  })

  it('displays token details like chain and source', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rawTokens: [mockFailedToken],
        pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
      }),
    })

    render(<FailedTokensSection />)

    const button = screen.getByText('Failed Tokens')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('ethereum')).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByText('coinbase')).toBeDefined()
    })
  })

  it('displays contract address when available', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rawTokens: [mockFailedToken],
        pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
      }),
    })

    render(<FailedTokensSection />)

    const button = screen.getByText('Failed Tokens')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/0xabc123/)).toBeDefined()
    })
  })

  it('handles pagination', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          rawTokens: [mockFailedToken],
          pagination: { page: 1, pageSize: 25, total: 30, totalPages: 2 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          rawTokens: [{ ...mockFailedToken, id: 'raw-token-2', symbol: 'FAIL2' }],
          pagination: { page: 2, pageSize: 25, total: 30, totalPages: 2 },
        }),
      })

    render(<FailedTokensSection />)

    const button = screen.getByText('Failed Tokens')
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
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rawTokens: [mockFailedToken],
        pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
      }),
    })

    render(<FailedTokensSection />)

    const button = screen.getByText('Failed Tokens')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeDefined()
    })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rawTokens: [{ ...mockFailedToken, symbol: 'REFRESHED' }],
        pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
      }),
    })

    const refreshButton = screen.getByText('Refresh')
    fireEvent.click(refreshButton)

    await waitFor(() => {
      expect(screen.getByText('REFRESHED')).toBeDefined()
    })
  })
})

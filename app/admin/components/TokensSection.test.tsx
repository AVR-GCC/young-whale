import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TokensSection from './TokensSection'

const mockFetch = vi.fn()
global.fetch = mockFetch

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/admin',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('./TokenEditDrawer', () => ({
  default: ({ tokenId, onClose }: { tokenId: string; onClose: () => void }) => (
    <div data-testid="token-drawer">
      <span>Token: {tokenId}</span>
      <button onClick={onClose}>Close Drawer</button>
    </div>
  ),
}))

const mockToken = {
  id: 'token-1',
  name: 'Test Token',
  symbol: 'TEST',
  chain: 'ethereum',
  contract_address: '0x123',
  category: 'Tech',
  confidence: 'high',
  status: 'approved',
  is_promoted: false,
  is_verified: true,
  created_at: '2024-01-01T00:00:00Z',
  hashtags: [],
}

const mockStats = {
  total: 10,
  approved: 5,
  pending_review: 3,
  rejected: 2,
  promoted: 1,
  low_confidence: 1,
}

describe('TokensSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders tokens table with data', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tokens: [mockToken],
          pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      })

    render(<TokensSection />)

    await waitFor(() => {
      expect(screen.getByText('TEST')).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByText('Test Token')).toBeDefined()
    })
  })

  it('shows loading state while fetching', async () => {
    let resolveTokens: (value: Response) => void
    const tokensPromise = new Promise<Response>((resolve) => {
      resolveTokens = resolve
    })

    mockFetch
      .mockReturnValueOnce(tokensPromise)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      })

    render(<TokensSection />)

    expect(screen.queryByText('TEST')).toBeNull()

    resolveTokens!({
      ok: true,
      json: async () => ({
        tokens: [mockToken],
        pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
      }),
    } as Response)

    await waitFor(() => {
      expect(screen.getByText('TEST')).toBeDefined()
    })
  })

  it('displays stats summary', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tokens: [mockToken],
          pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      })

    render(<TokensSection />)

    await waitFor(() => {
      expect(screen.getByText('10')).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByText('5')).toBeDefined()
    })
  })

  it('filters by search term', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tokens: [mockToken],
          pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tokens: [],
          pagination: { page: 1, pageSize: 25, total: 0, totalPages: 0 },
        }),
      })

    render(<TokensSection />)

    await waitFor(() => {
      expect(screen.getByText('TEST')).toBeDefined()
    })

    const searchInput = screen.getByPlaceholderText('Name, symbol, or contract...')
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('search=nonexistent'))
    })
  })

  it('toggles category filters', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tokens: [mockToken],
          pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tokens: [],
          pagination: { page: 1, pageSize: 25, total: 0, totalPages: 0 },
        }),
      })

    render(<TokensSection />)

    await waitFor(() => {
      expect(screen.getByText('TEST')).toBeDefined()
    })

    const memeButton = screen.getByText('Meme')
    fireEvent.click(memeButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('category=Meme'))
    })
  })

  it('shows empty state when no tokens', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tokens: [],
          pagination: { page: 1, pageSize: 25, total: 0, totalPages: 0 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          total: 0,
          approved: 0,
          pending_review: 0,
          rejected: 0,
          promoted: 0,
          low_confidence: 0,
        }),
      })

    render(<TokensSection />)

    await waitFor(() => {
      expect(screen.getByText('No tokens have been processed yet')).toBeDefined()
    })
  })

  it('shows empty state with filters', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tokens: [],
          pagination: { page: 1, pageSize: 25, total: 0, totalPages: 0 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          total: 0,
          approved: 0,
          pending_review: 0,
          rejected: 0,
          promoted: 0,
          low_confidence: 0,
        }),
      })

    render(<TokensSection />)

    await waitFor(() => {
      expect(screen.getByText('No tokens have been processed yet')).toBeDefined()
    })
  })

  it('handles API errors gracefully', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to fetch tokens' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      })

    render(<TokensSection />)

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch tokens')).toBeDefined()
    })
  })

  it('opens edit drawer when clicking edit', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tokens: [mockToken],
          pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      })

    render(<TokensSection />)

    await waitFor(() => {
      expect(screen.getByText('TEST')).toBeDefined()
    })

    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)

    await waitFor(() => {
      expect(screen.getByTestId('token-drawer')).toBeDefined()
    })
  })
})

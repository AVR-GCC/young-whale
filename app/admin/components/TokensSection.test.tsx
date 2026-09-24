import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TokensSection, { extractTwitterUsername } from './TokensSection'

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

  it('exports twitter usernames of recently expired tokens as csv', async () => {
    let capturedBlob: Blob | undefined
    const createObjectURLMock = vi.fn((blob: Blob) => {
      capturedBlob = blob
      return 'blob:mock-url'
    })
    const revokeObjectURLMock = vi.fn()
    window.URL.createObjectURL = createObjectURLMock
    window.URL.revokeObjectURL = revokeObjectURLMock
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {})

    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/api/admin/tokens/stats')) {
        return Promise.resolve({ ok: true, json: async () => mockStats })
      }
      if (url.includes('published_after')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            tokens: [
              { ...mockToken, id: 't1', social_links: { twitter: 'https://x.com/alpha' } },
              { ...mockToken, id: 't2', social_links: { twitter: 'https://twitter.com/beta' } },
              { ...mockToken, id: 't3', social_links: { twitter: 'https://x.com/alpha' } },
              { ...mockToken, id: 't4', social_links: {} },
            ],
            pagination: { page: 1, pageSize: 100, total: 4, totalPages: 1 },
          }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          tokens: [mockToken],
          pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
        }),
      })
    })

    render(<TokensSection />)

    await waitFor(() => {
      expect(screen.getByText('TEST')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Export Expired X Usernames'))

    await waitFor(() => {
      expect(createObjectURLMock).toHaveBeenCalled()
    })

    const exportCall = mockFetch.mock.calls.find((call) =>
      String(call[0]).includes('published_after')
    )
    expect(exportCall).toBeDefined()
    const exportUrl = String(exportCall![0])
    expect(exportUrl).toContain('published_after=')
    expect(exportUrl).toContain('published_before=')
    expect(exportUrl).toContain('pageSize=100')

    const csv = await capturedBlob!.text()
    expect(csv).toBe('username\nalpha\nbeta')

    expect(clickSpy).toHaveBeenCalled()
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url')

    await waitFor(() => {
      expect(screen.getByText('Exported 2 username(s)')).toBeDefined()
    })

    clickSpy.mockRestore()
  })

  it('shows error toast when export fetch fails', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/api/admin/tokens/stats')) {
        return Promise.resolve({ ok: true, json: async () => mockStats })
      }
      if (url.includes('published_after')) {
        return Promise.resolve({
          ok: false,
          json: async () => ({ error: 'Failed to fetch expired tokens' }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          tokens: [mockToken],
          pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
        }),
      })
    })

    render(<TokensSection />)

    await waitFor(() => {
      expect(screen.getByText('TEST')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Export Expired X Usernames'))

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch expired tokens')).toBeDefined()
    })
  })
})

describe('extractTwitterUsername', () => {
  it('extracts username from twitter and x links', () => {
    expect(extractTwitterUsername('https://twitter.com/someuser')).toBe('someuser')
    expect(extractTwitterUsername('https://x.com/someuser')).toBe('someuser')
    expect(extractTwitterUsername('https://x.com/@someuser')).toBe('someuser')
    expect(extractTwitterUsername('https://x.com/someuser/')).toBe('someuser')
    expect(extractTwitterUsername('https://x.com/someuser?lang=en')).toBe('someuser')
  })

  it('handles plain usernames', () => {
    expect(extractTwitterUsername('someuser')).toBe('someuser')
    expect(extractTwitterUsername('@someuser')).toBe('someuser')
  })

  it('returns null for invalid input', () => {
    expect(extractTwitterUsername('')).toBeNull()
    expect(extractTwitterUsername('   ')).toBeNull()
    expect(extractTwitterUsername('https://t.me/someuser')).toBeNull()
  })
})

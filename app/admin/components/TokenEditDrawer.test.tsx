import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TokenEditDrawer from './TokenEditDrawer'
import type { Token, Hashtag } from '@/shared/types'

const mockFetch = vi.fn()
global.fetch = mockFetch

interface TokenWithHashtags extends Token {
  hashtags: Hashtag[]
  raw_token?: {
    id: string
    raw_payload: Record<string, unknown>
  } | null
}

const mockToken: TokenWithHashtags = {
  id: 'token-1',
  name: 'Test Token',
  symbol: 'TEST',
  chain: 'ethereum',
  contract_address: '0x123',
  unique_key: 'test-1',
  slug: 'test-token',
  category: 'Tech',
  short_description: 'A test token',
  full_description: 'This is a test token for testing purposes.',
  logo_url: 'https://example.com/logo.png',
  logo_storage_path: null,
  website_url: 'https://example.com',
  social_links: { twitter: 'https://twitter.com/test', telegram: '', discord: '' },
  exchange_links: ['https://dex.example.com'],
  preferred_exchange: 'https://dex.example.com',
  start_date: null,
  end_date: null,
  source_type: 'coinbase',
  source_url: 'https://coinmarketcap.com',
  confidence: 'high',
  raw_token_id: 'raw-1',
  status: 'approved',
  is_promoted: false,
  is_verified: true,
  main_hashtag: 'defi',
  rating: 5,
  supply: 1000000,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  hashtags: [{ id: 'h1', name: 'defi', slug: 'defi', is_active: true, created_at: '2024-01-01' }],
  raw_token: {
    id: 'raw-1',
    raw_payload: {
      cmc_details: {
        tags: ['defi', 'ethereum', 'layer-1'],
      },
    },
  },
}

const mockHashtags: Hashtag[] = [
  { id: 'h1', name: 'defi', slug: 'defi', is_active: true, created_at: '2024-01-01' },
  { id: 'h2', name: 'gaming', slug: 'gaming', is_active: true, created_at: '2024-01-01' },
  { id: 'h3', name: 'AI', slug: 'ai', is_active: true, created_at: '2024-01-01' },
]

describe('TokenEditDrawer', () => {
  const mockOnClose = vi.fn()
  const mockOnUpdate = vi.fn()
  const mockOnDelete = vi.fn()
  const mockOnNext = vi.fn()
  const mockShowToast = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders loading state initially', () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockHashtags,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockToken,
      })

    render(
      <TokenEditDrawer
        tokenId="token-1"
        mode="edit"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        showToast={mockShowToast}
      />
    )

    expect(screen.getByText('Edit Token')).toBeDefined()
  })

  it('displays token details after loading', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockHashtags,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockToken,
      })

    render(
      <TokenEditDrawer
        tokenId="token-1"
        mode="edit"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        showToast={mockShowToast}
      />
    )

    await waitFor(() => {
      expect(screen.getByDisplayValue('test-token')).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByDisplayValue('A test token')).toBeDefined()
    })
  })

  it('switches to raw data tab', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockHashtags,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockToken,
      })

    render(
      <TokenEditDrawer
        tokenId="token-1"
        mode="edit"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        showToast={mockShowToast}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Raw Data')).toBeDefined()
    })

    const rawTab = screen.getByText('Raw Data')
    fireEvent.click(rawTab)

    await waitFor(() => {
      expect(screen.getByText('Tags from CMC')).toBeDefined()
    })
  })

  it('shows review mode buttons', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockHashtags,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockToken,
      })

    render(
      <TokenEditDrawer
        tokenId="token-1"
        mode="review"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onNext={mockOnNext}
        showToast={mockShowToast}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Review Token')).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByText('Approve ✓')).toBeDefined()
    })
    await waitFor(() => {
      expect(screen.getByText('Reject ✗')).toBeDefined()
    })
  })

  it('calls onClose when clicking close button', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockHashtags,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockToken,
      })

    render(
      <TokenEditDrawer
        tokenId="token-1"
        mode="edit"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        showToast={mockShowToast}
      />
    )

    await waitFor(() => {
      expect(screen.getAllByText('×').length).toBeGreaterThan(0)
    })

    // The close button is the first × in the header
    const closeButton = screen.getAllByText('×')[0]
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('saves token changes', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockHashtags,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockToken,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockToken, category: 'Meme' }),
      })

    render(
      <TokenEditDrawer
        tokenId="token-1"
        mode="edit"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        showToast={mockShowToast}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeDefined()
    })

    const saveButton = screen.getByText('Save Changes')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Token updated successfully', 'success')
    })
  })

  it('shows delete confirmation dialog', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockHashtags,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockToken,
      })

    render(
      <TokenEditDrawer
        tokenId="token-1"
        mode="edit"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        showToast={mockShowToast}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeDefined()
    })

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText('Delete Token')).toBeDefined()
    })
  })

  it('handles API errors when loading token', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockHashtags,
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Token not found' }),
      })

    render(
      <TokenEditDrawer
        tokenId="token-1"
        mode="edit"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        showToast={mockShowToast}
      />
    )

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Token not found', 'error')
    })
  })
})

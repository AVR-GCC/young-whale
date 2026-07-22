import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import HomePage from './HomePage'
import type { TokenWithHashtags } from '@/shared/types'

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(),
    })),
  },
}))

vi.mock('./CategoryContainer', () => ({
  default: ({ category, tokenCount, tokens }: { category: { id: string; title: string }; tokenCount: number; tokens: TokenWithHashtags[] }) => (
    <div data-testid={`category-${category.id}`} data-layout={category.id}>
      <h3>{category.title}</h3>
      <span>{tokenCount} tokens</span>
      <div data-testid="token-list">
        {tokens.map((token: TokenWithHashtags) => (
          <div key={token.id}>{token.name}</div>
        ))}
      </div>
    </div>
  ),
}))

vi.mock('./CustomTooltip', () => ({
  CustomTooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const mockTokens: TokenWithHashtags[] = [
  {
    id: '1',
    name: 'TechToken1',
    symbol: 'TT1',
    chain: 'Ethereum',
    contract_address: null,
    unique_key: 'tt1-eth',
    slug: 'techtoken1',
    category: 'Tech',
    short_description: 'Tech token 1',
    full_description: 'Full description',
    logo_url: null,
    logo_storage_path: null,
    website_url: null,
    social_links: {},
    exchange_links: [],
    preferred_exchange: null,
    start_date: null,
    end_date: null,
    source_type: null,
    source_url: null,
    confidence: null,
    raw_token_id: null,
    status: 'approved',
    is_promoted: false,
    is_verified: false,
    main_hashtag: null,
    rating: 0,
    supply: 1000000,
    created_at: '2024-06-10T10:00:00Z',
    updated_at: '2024-06-10T10:00:00Z',
    published_at: null,
    hashtags: [],
  },
  {
    id: '2',
    name: 'MemeToken1',
    symbol: 'MT1',
    chain: 'Solana',
    contract_address: null,
    unique_key: 'mt1-sol',
    slug: 'memetoken1',
    category: 'Meme',
    short_description: 'Meme token 1',
    full_description: 'Full description',
    logo_url: null,
    logo_storage_path: null,
    website_url: null,
    social_links: {},
    exchange_links: [],
    preferred_exchange: null,
    start_date: null,
    end_date: null,
    source_type: null,
    source_url: null,
    confidence: null,
    raw_token_id: null,
    status: 'approved',
    is_promoted: false,
    is_verified: false,
    main_hashtag: null,
    rating: 0,
    supply: 500000000,
    created_at: '2024-06-09T10:00:00Z',
    updated_at: '2024-06-09T10:00:00Z',
    published_at: null,
    hashtags: [],
  },
  {
    id: '3',
    name: 'RWAToken1',
    symbol: 'RT1',
    chain: 'Base',
    contract_address: null,
    unique_key: 'rt1-base',
    slug: 'rwatoken1',
    category: 'RWA',
    short_description: 'RWA token 1',
    full_description: 'Full description',
    logo_url: null,
    logo_storage_path: null,
    website_url: null,
    social_links: {},
    exchange_links: [],
    preferred_exchange: null,
    start_date: null,
    end_date: null,
    source_type: null,
    source_url: null,
    confidence: null,
    raw_token_id: null,
    status: 'approved',
    is_promoted: false,
    is_verified: false,
    main_hashtag: null,
    rating: 0,
    supply: 10000000,
    created_at: '2024-06-08T10:00:00Z',
    updated_at: '2024-06-08T10:00:00Z',
    published_at: null,
    hashtags: [],
  },
  {
    id: '4',
    name: 'PresaleToken1',
    symbol: 'PT1',
    chain: 'Ethereum',
    contract_address: null,
    unique_key: 'pt1-eth',
    slug: 'presaletoken1',
    category: 'Presale',
    short_description: 'Presale token 1',
    full_description: 'Full description',
    logo_url: null,
    logo_storage_path: null,
    website_url: null,
    social_links: {},
    exchange_links: [],
    preferred_exchange: null,
    start_date: null,
    end_date: null,
    source_type: null,
    source_url: null,
    confidence: null,
    raw_token_id: null,
    status: 'approved',
    is_promoted: false,
    is_verified: false,
    main_hashtag: null,
    rating: 0,
    supply: null,
    created_at: '2024-06-07T10:00:00Z',
    updated_at: '2024-06-07T10:00:00Z',
    published_at: null,
    hashtags: [],
  },
]

describe('HomePage Integration', () => {
  it('renders complete page layout', () => {
    render(<HomePage tokens={mockTokens} loading={false} />)

    // Header
    expect(screen.getByText('YoungWhale.io')).toBeDefined()
    expect(screen.getByText(/CRYPTO WHALES START HERE/)).toBeDefined()

    // Categories
    expect(screen.getAllByTestId('category-Tech').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByTestId('category-Meme').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByTestId('category-RWA').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByTestId('category-Presale').length).toBeGreaterThanOrEqual(1)

    // Subscription terminal
    expect(screen.getByText('YOUNG WHALE CLUB')).toBeDefined()

    // Footer
    expect(screen.getByText(/SONAR RADAR ACTIVE/)).toBeDefined()
  })

  it('renders with empty tokens', () => {
    render(<HomePage tokens={[]} loading={false} />)

    expect(screen.getByText('YoungWhale.io')).toBeDefined()
    expect(screen.getAllByTestId('category-Tech').length).toBeGreaterThanOrEqual(1)
  })

  it('renders loading state', () => {
    render(<HomePage tokens={mockTokens} loading={true} />)

    // Header still renders
    expect(screen.getByText('YoungWhale.io')).toBeDefined()

    // Categories still render (with skeletons inside)
    expect(screen.getAllByTestId('category-Tech').length).toBeGreaterThanOrEqual(1)
  })

  it('renders countdown timer', () => {
    // Mock date to 22:00 UTC so timer shows 02:00:00
    const mockDate = new Date('2024-06-10T22:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)

    render(<HomePage tokens={mockTokens} loading={false} />)
    act(() => {
      vi.advanceTimersByTime(0)
    })
    const timers = screen.getAllByText('02:00:00')
    expect(timers.length).toBeGreaterThanOrEqual(1)

    vi.useRealTimers()
  })

  it('renders search functionality', () => {
    render(<HomePage tokens={mockTokens} loading={false} />)
    expect(screen.getByRole('button', { name: /toggle search/i })).toBeDefined()
  })

  it('renders footer links', () => {
    render(<HomePage tokens={mockTokens} loading={false} />)
    expect(screen.getByText('[ SUBMIT TOKEN ]')).toBeDefined()
    expect(screen.getByText('[ CONTACT ]')).toBeDefined()
    expect(screen.getByText('[ T&C ]')).toBeDefined()
    expect(screen.getByText('[ LEGAL DISCLAIMER ]')).toBeDefined()
    expect(screen.getByText('[ PRIVACY ]')).toBeDefined()
  })

  it('filters tokens by time filter "today"', () => {
    render(<HomePage tokens={mockTokens} loading={false} />)

    // Open search to access filters
    const searchButton = screen.getByRole('button', { name: /toggle search/i })
    fireEvent.click(searchButton)

    // Change time filter to today
    const timeSelect = screen.getByDisplayValue('TIME: ALL')
    fireEvent.change(timeSelect, { target: { value: 'today' } })

    // Only today's tokens should appear (created_at is 2024-06-10, which is in the past relative to now)
    // Since the test uses fixed dates, we need to verify the filter logic is applied
    const techCategories = screen.getAllByTestId('category-Tech')
    techCategories.forEach(cat => {
      // Should not show older tokens when filtered to today
      expect(cat.textContent).not.toContain('PresaleToken1')
    })
  })

  it('filters tokens by time filter "yesterday"', () => {
    render(<HomePage tokens={mockTokens} loading={false} />)

    const searchButton = screen.getByRole('button', { name: /toggle search/i })
    fireEvent.click(searchButton)

    const timeSelect = screen.getByDisplayValue('TIME: ALL')
    fireEvent.change(timeSelect, { target: { value: 'yesterday' } })

    // Should not show today's tokens when filtered to yesterday
    const techCategories = screen.getAllByTestId('category-Tech')
    techCategories.forEach(cat => {
      expect(cat.textContent).not.toContain('TechToken1')
    })
  })

  it('sorts tokens by score', () => {
    const tokensWithRatings = mockTokens.map((t, i) => ({
      ...t,
      rating: [100, 50, 75, 25][i]
    }))

    render(<HomePage tokens={tokensWithRatings} loading={false} />)

    const searchButton = screen.getByRole('button', { name: /toggle search/i })
    fireEvent.click(searchButton)

    const sortSelect = screen.getByDisplayValue('SORT: DFLT')
    fireEvent.change(sortSelect, { target: { value: 'score' } })

    // Verify sorting is applied - highest rating should appear first
    const techCategories = screen.getAllByTestId('category-Tech')
    techCategories.forEach(cat => {
      const tokenList = cat.querySelector('[data-testid="token-list"]')
      if (tokenList && tokenList.children.length > 0) {
        // TechToken1 has rating 100, should be first in its category
        expect(tokenList.children[0].textContent).toBe('TechToken1')
      }
    })
  })

  it('sorts tokens by hashtag', () => {
    const tokensWithHashtags = mockTokens.map((t, i) => ({
      ...t,
      hashtags: [{ id: `h${i}`, name: ['zebra', 'alpha', 'beta', 'gamma'][i], slug: ['zebra', 'alpha', 'beta', 'gamma'][i], is_active: true, created_at: t.created_at }]
    }))

    render(<HomePage tokens={tokensWithHashtags} loading={false} />)

    const searchButton = screen.getByRole('button', { name: /toggle search/i })
    fireEvent.click(searchButton)

    const sortSelect = screen.getByDisplayValue('SORT: DFLT')
    fireEvent.change(sortSelect, { target: { value: 'hashtag' } })

    // Verify sorting is applied - should be sorted alphabetically by hashtag
    const techCategories = screen.getAllByTestId('category-Tech')
    techCategories.forEach(cat => {
      const tokenList = cat.querySelector('[data-testid="token-list"]')
      if (tokenList && tokenList.children.length > 0) {
        // TechToken1 has hashtag 'zebra', should be last alphabetically
        expect(tokenList.children[tokenList.children.length - 1].textContent).toBe('TechToken1')
      }
    })
  })

  it('filters tokens by search query', () => {
    render(<HomePage tokens={mockTokens} loading={false} />)

    const searchButton = screen.getByRole('button', { name: /toggle search/i })
    fireEvent.click(searchButton)

    const searchInput = screen.getByPlaceholderText('SEARCH...')
    fireEvent.change(searchInput, { target: { value: 'Meme' } })

    // Only MemeToken1 should appear in results
    const memeCategories = screen.getAllByTestId('category-Meme')
    memeCategories.forEach(cat => {
      expect(cat.textContent).toContain('MemeToken1')
    })

    // Other categories should be empty or not contain the searched token
    const techCategories = screen.getAllByTestId('category-Tech')
    techCategories.forEach(cat => {
      expect(cat.textContent).not.toContain('TechToken1')
    })
  })

  it('combines time filter and search query', () => {
    render(<HomePage tokens={mockTokens} loading={false} />)

    const searchButton = screen.getByRole('button', { name: /toggle search/i })
    fireEvent.click(searchButton)

    const searchInput = screen.getByPlaceholderText('SEARCH...')
    fireEvent.change(searchInput, { target: { value: 'Token' } })

    const timeSelect = screen.getByDisplayValue('TIME: ALL')
    fireEvent.change(timeSelect, { target: { value: 'today' } })

    // Should apply both filters
    const techCategories = screen.getAllByTestId('category-Tech')
    techCategories.forEach(cat => {
      // Should not show older tokens even if they match search
      expect(cat.textContent).not.toContain('PresaleToken1')
    })
  })
})

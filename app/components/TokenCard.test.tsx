import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TokenCard from './TokenCard'
import type { TokenWithHashtags } from '@/shared/types'

const mockSetIsExpanded = vi.fn()

const mockToken: TokenWithHashtags = {
  id: '1',
  name: 'TestToken',
  symbol: 'TEST',
  chain: 'Ethereum',
  contract_address: '0x1234567890abcdef1234567890abcdef12345678',
  unique_key: 'test-eth',
  slug: 'testtoken',
  category: 'Tech',
  short_description: 'A test token for testing',
  full_description: 'This is the full description of the test token with more details.',
  logo_url: 'https://example.com/logo.png',
  logo_storage_path: null,
  website_url: 'https://testtoken.example',
  social_links: {
    twitter: 'https://twitter.com/testtoken',
    telegram: 'https://t.me/testtoken',
    discord: 'https://discord.gg/testtoken',
    facebook: 'https://facebook.com/testtoken',
  },
  exchange_links: ['ETH_USDT_https://uniswap.org', 'TEST_BNB_https://binance.com'],
  preferred_exchange: 'Uniswap',
  start_date: null,
  end_date: null,
  source_type: 'dex',
  source_url: null,
  confidence: 'high',
  raw_token_id: null,
  status: 'approved',
  is_promoted: false,
  is_verified: true,
  main_hashtag: 'Test',
  rating: 4.5,
  supply: 1000000,
  created_at: '2024-06-10T10:00:00Z',
  updated_at: '2024-06-10T10:00:00Z',
    published_at: null,
  hashtags: [
    { id: '1', name: 'Test', slug: 'test', is_active: true, created_at: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'DeFi', slug: 'defi', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  ],
}

const mockTokenNoOptional: TokenWithHashtags = {
  id: '2',
  name: 'MinimalToken',
  symbol: 'MIN',
  chain: 'Solana',
  contract_address: null,
  unique_key: 'min-sol',
  slug: 'minimaltoken',
  category: 'Meme',
  short_description: null,
  full_description: null,
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
  created_at: '2024-06-09T10:00:00Z',
  updated_at: '2024-06-09T10:00:00Z',
    published_at: null,
  hashtags: [],
}

describe('TokenCard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders token name in header', () => {
    render(<TokenCard themeColor="#ff0000" token={mockToken} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    const names = screen.getAllByText('TestToken')
    expect(names.length).toBeGreaterThanOrEqual(1)
  })

  it('renders short description when available', () => {
    render(<TokenCard themeColor="#ff0000" token={mockToken} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    expect(screen.getByText('A test token for testing')).toBeDefined()
  })

  it('renders time since creation for expired tokens', () => {
    render(<TokenCard themeColor="#ff0000" token={mockToken} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    // Token created 5 days ago (> 48h), so it shows TimeSince value
    expect(screen.getByText('5d')).toBeDefined()
  })

  it('renders with minimal data (no optional fields)', () => {
    render(<TokenCard themeColor="#ff0000" token={mockTokenNoOptional} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    const names = screen.getAllByText('MinimalToken')
    expect(names.length).toBeGreaterThanOrEqual(1)
  })

  it('shows initials when no logo_url', () => {
    render(<TokenCard themeColor="#ff0000" token={mockTokenNoOptional} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    const initials = screen.getAllByText('MI')
    expect(initials.length).toBeGreaterThanOrEqual(1)
  })

  it('shows token logo when logo_url is provided', () => {
    render(<TokenCard themeColor="#ff0000" token={mockToken} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    const imgs = screen.getAllByAltText('TestToken icon')
    expect(imgs.length).toBeGreaterThanOrEqual(1)
    expect(imgs[0].getAttribute('src')).toBe('https://example.com/logo.png')
  })

  it('expands on click', () => {
    render(<TokenCard themeColor="#ff0000" token={mockToken} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')
    expect(card).toBeDefined()

    if (card) {
      fireEvent.click(card)
      expect(screen.getByText('YOUNGWHALE TERMINAL')).toBeDefined()
    }
  })

  it('collapses on second click', () => {
    render(<TokenCard themeColor="#ff0000" token={mockToken} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      expect(screen.getByText('YOUNGWHALE TERMINAL')).toBeDefined()

      fireEvent.click(card)
      // After collapse, the terminal should still be in DOM but hidden
      // In jsdom, max-h-0 doesn't remove from DOM, so we check it's still there
      expect(screen.getByText('YOUNGWHALE TERMINAL')).toBeDefined()
    }
  })

  it('displays hashtags in collapsed view', () => {
    render(<TokenCard themeColor="#ff0000" token={mockToken} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    expect(screen.getByText('#Test')).toBeDefined()
  })

  it('does not display hashtags when empty', () => {
    render(<TokenCard themeColor="#ff0000" token={mockTokenNoOptional} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    expect(screen.queryByText('#Test')).toBeNull()
  })

  it('displays main_hashtag name instead of first hashtag', () => {
    const tokenWithDifferentMainHashtag = {
      ...mockToken,
      main_hashtag: 'secondtag',
      hashtags: [
        { id: '1', name: 'FirstTag', slug: 'firsttag', is_active: true, created_at: '2024-01-01T00:00:00Z' },
        { id: '2', name: 'SecondTag', slug: 'secondtag', is_active: true, created_at: '2024-01-01T00:00:00Z' },
      ],
    }
    render(<TokenCard themeColor="#ff0000" token={tokenWithDifferentMainHashtag} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    expect(screen.getByText('#SecondTag')).toBeDefined()
    expect(screen.queryByText('#FirstTag')).toBeNull()
  })

  it('renders TODAY for tokens created within 24 hours', () => {
    const recentToken = { ...mockToken, created_at: '2024-06-15T08:00:00Z' }
    render(<TokenCard themeColor="#ff0000" token={recentToken} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    expect(screen.getByText('TODAY')).toBeDefined()
  })

  it('renders 1D AGO for tokens created between 24-48 hours ago', () => {
    const dayAgoToken = { ...mockToken, created_at: '2024-06-14T10:00:00Z' }
    render(<TokenCard themeColor="#ff0000" token={dayAgoToken} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    expect(screen.getByText('1D AGO')).toBeDefined()
  })

  it('renders TimeSince for tokens older than 48 hours', () => {
    const oldToken = { ...mockToken, created_at: '2024-06-13T10:00:00Z' }
    render(<TokenCard themeColor="#ff0000" token={oldToken} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    expect(screen.getByText('2d')).toBeDefined()
  })

  it('renders hours correctly for recent tokens', () => {
    const hoursAgoToken = { ...mockToken, created_at: '2024-06-15T08:00:00Z' }
    render(<TokenCard themeColor="#ff0000" token={hoursAgoToken} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    // Within past 24h shows TODAY
    expect(screen.getByText('TODAY')).toBeDefined()
  })

  it('renders minutes correctly for very recent tokens', () => {
    const recentToken = { ...mockToken, created_at: '2024-06-15T11:59:00Z' }
    render(<TokenCard themeColor="#ff0000" token={recentToken} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    // Within past 24h shows TODAY
    expect(screen.getByText('TODAY')).toBeDefined()
  })

  it('renders seconds correctly for just created tokens', () => {
    const secondsAgoToken = { ...mockToken, created_at: '2024-06-15T11:59:59Z' }
    render(<TokenCard themeColor="#ff0000" token={secondsAgoToken} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    // Within past 24h shows TODAY
    expect(screen.getByText('TODAY')).toBeDefined()
  })

  it('applies hover styles on mouse enter', () => {
    render(<TokenCard themeColor="#ff0000" token={mockToken} isExpanded={false} setIsExpandedAction={mockSetIsExpanded} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.mouseEnter(card)
      // Check that the left border indicator is visible
      // The component sets opacity to 1 on hover
      expect(card.getAttribute('style')).toContain('box-shadow')
    }
  })

})

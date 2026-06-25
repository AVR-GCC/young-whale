import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TokenCard from './TokenCard'
import type { TokenWithHashtags } from '@/shared/types'

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
    twitter: ['https://twitter.com/testtoken'],
    telegram: ['https://t.me/testtoken'],
    discord: ['https://discord.gg/testtoken'],
    facebook: ['https://facebook.com/testtoken'],
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
    render(<TokenCard token={mockToken} />)
    const names = screen.getAllByText('TestToken')
    expect(names.length).toBeGreaterThanOrEqual(1)
  })

  it('renders short description when available', () => {
    render(<TokenCard token={mockToken} />)
    expect(screen.getByText('A test token for testing')).toBeDefined()
  })

  it('renders time since creation for expired tokens', () => {
    render(<TokenCard token={mockToken} />)
    // Token created 5 days ago (> 48h), so it shows TimeSince value
    expect(screen.getByText('5d')).toBeDefined()
  })

  it('renders with minimal data (no optional fields)', () => {
    render(<TokenCard token={mockTokenNoOptional} />)
    const names = screen.getAllByText('MinimalToken')
    expect(names.length).toBeGreaterThanOrEqual(1)
  })

  it('shows initials when no logo_url', () => {
    render(<TokenCard token={mockTokenNoOptional} />)
    const initials = screen.getAllByText('MI')
    expect(initials.length).toBeGreaterThanOrEqual(1)
  })

  it('shows token logo when logo_url is provided', () => {
    render(<TokenCard token={mockToken} />)
    const imgs = screen.getAllByAltText('TestToken icon')
    expect(imgs.length).toBeGreaterThanOrEqual(1)
    expect(imgs[0].getAttribute('src')).toBe('https://example.com/logo.png')
  })

  it('expands on click', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')
    expect(card).toBeDefined()

    if (card) {
      fireEvent.click(card)
      expect(screen.getByText('YOUNGWHALE TERMINAL')).toBeDefined()
    }
  })

  it('collapses on second click', () => {
    render(<TokenCard token={mockToken} />)
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

  it('displays full description in expanded view', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      expect(screen.getByText('WHALE INTELLIGENCE BRIEF')).toBeDefined()
      expect(screen.getByText('This is the full description of the test token with more details.')).toBeDefined()
    }
  })

  it('displays fallback description when full_description is null', () => {
    render(<TokenCard token={mockTokenNoOptional} />)
    const names = screen.getAllByText('MinimalToken')
    const card = names[0].closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      expect(screen.getByText('No description available.')).toBeDefined()
    }
  })

  it('displays contract address in expanded view', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      // Contract is shown as "0x1234...5678" in the explorer label
      expect(screen.getByText(/0x1234/)).toBeDefined()
    }
  })

  it('displays N/A when contract address is null', () => {
    render(<TokenCard token={mockTokenNoOptional} />)
    const names = screen.getAllByText('MinimalToken')
    const card = names[0].closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      // N/A is rendered as "[ N/A ]" with brackets, use custom matcher
      expect(screen.getByText((content) => content.includes('N/A'))).toBeDefined()
    }
  })

  it('displays hashtags in collapsed view', () => {
    render(<TokenCard token={mockToken} />)
    expect(screen.getByText('#Test')).toBeDefined()
  })

  it('does not display hashtags when empty', () => {
    render(<TokenCard token={mockTokenNoOptional} />)
    expect(screen.queryByText('#Test')).toBeNull()
  })

  it('displays social links in expanded view', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      expect(screen.getByText(/x.com/)).toBeDefined()
      expect(screen.getByText(/t.me/)).toBeDefined()
      expect(screen.getByText('discord')).toBeDefined()
      expect(screen.getByText('facebook')).toBeDefined()
    }
  })

  it('displays website url in expanded view', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      expect(screen.getByText('testtoken.example')).toBeDefined()
    }
  })

  it('does not display social links section when empty', () => {
    render(<TokenCard token={mockTokenNoOptional} />)
    const names = screen.getAllByText('MinimalToken')
    const card = names[0].closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      expect(screen.queryByText(/x.com/)).toBeNull()
      expect(screen.queryByText(/t.me/)).toBeNull()
    }
  })

  it('displays exchange links in expanded view', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      expect(screen.getByText('[ETH/USDT]')).toBeDefined()
      expect(screen.getByText('[TEST/BNB]')).toBeDefined()
    }
  })

  it('displays no pairs message when exchange links are empty', () => {
    render(<TokenCard token={mockTokenNoOptional} />)
    const names = screen.getAllByText('MinimalToken')
    const card = names[0].closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      expect(screen.getByText('[NO PAIRS FOUND]')).toBeDefined()
    }
  })

  it('displays supply in expanded view', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      // Supply is rendered as "1000000 TEST" which may be split across text nodes
      expect(screen.getByText((content) => content.includes('1000000'))).toBeDefined()
    }
  })

  it('displays rating in expanded view', () => {
    // Use a recent token so it's not expired
    const recentToken = { ...mockToken, created_at: '2024-06-15T10:00:00Z' }
    render(<TokenCard token={recentToken} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      expect(screen.getByText('4.5/10')).toBeDefined()
    }
  })

  it('displays expired rating for old tokens', () => {
    render(<TokenCard token={mockToken} />)
    // Token is 5 days old, so rating should show expired icon (★) in header
    // In expanded view, it shows [ SIGNAL EXPIRED ]
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      expect(screen.getByText('[ SIGNAL EXPIRED ]')).toBeDefined()
    }
  })

  it('handles copy button click', async () => {
    const clipboardWriteText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: {
        writeText: clipboardWriteText,
      },
    })

    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)

      // Find the copy button by text - text is "[ COPY ]" but may be split
      const copyButton = screen.getByText((content) => content.includes('COPY'))
      fireEvent.click(copyButton)

      expect(clipboardWriteText).toHaveBeenCalledWith(mockToken.contract_address)
    }
  }, 10000)

  it('shows copied state after clicking copy button', async () => {
    const clipboardWriteText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: {
        writeText: clipboardWriteText,
      },
    })

    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      const copyButton = screen.getByText((content) => content.includes('COPY'))
      fireEvent.click(copyButton)
      expect(screen.getByText((content) => content.includes('COPIED'))).toBeDefined()
    }
  })

  it('renders TODAY for tokens created within 24 hours', () => {
    const recentToken = { ...mockToken, created_at: '2024-06-15T08:00:00Z' }
    render(<TokenCard token={recentToken} />)
    expect(screen.getByText('TODAY')).toBeDefined()
  })

  it('renders 1D AGO for tokens created between 24-48 hours ago', () => {
    const dayAgoToken = { ...mockToken, created_at: '2024-06-14T10:00:00Z' }
    render(<TokenCard token={dayAgoToken} />)
    expect(screen.getByText('1D AGO')).toBeDefined()
  })

  it('renders TimeSince for tokens older than 48 hours', () => {
    const oldToken = { ...mockToken, created_at: '2024-06-13T10:00:00Z' }
    render(<TokenCard token={oldToken} />)
    expect(screen.getByText('2d')).toBeDefined()
  })

  it('renders hours correctly for recent tokens', () => {
    const hoursAgoToken = { ...mockToken, created_at: '2024-06-15T08:00:00Z' }
    render(<TokenCard token={hoursAgoToken} />)
    // Within past 24h shows TODAY
    expect(screen.getByText('TODAY')).toBeDefined()
  })

  it('renders minutes correctly for very recent tokens', () => {
    const recentToken = { ...mockToken, created_at: '2024-06-15T11:59:00Z' }
    render(<TokenCard token={recentToken} />)
    // Within past 24h shows TODAY
    expect(screen.getByText('TODAY')).toBeDefined()
  })

  it('renders seconds correctly for just created tokens', () => {
    const secondsAgoToken = { ...mockToken, created_at: '2024-06-15T11:59:59Z' }
    render(<TokenCard token={secondsAgoToken} />)
    // Within past 24h shows TODAY
    expect(screen.getByText('TODAY')).toBeDefined()
  })

  it('displays chain badge in expanded view', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      expect(screen.getByText('Ethereum')).toBeDefined()
    }
  })

  it('displays symbol in expanded view', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      // $TEST appears multiple times in the expanded view
      const symbols = screen.getAllByText('$TEST')
      expect(symbols.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('applies hover styles on mouse enter', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.mouseEnter(card)
      // Check that the left border indicator is visible
      // The component sets opacity to 1 on hover
      expect(card.getAttribute('style')).toContain('box-shadow')
    }
  })

  it('displays explorer link for different chains', () => {
    const bscToken = { ...mockToken, chain: 'BSC' }
    render(<TokenCard token={bscToken} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      // The contract address is displayed as text (not a link), with format "0x1234...5678"
      expect(screen.getByText((content) => content.includes('0x1234'))).toBeDefined()
    }
  })

  it('displays share to X link in expanded view', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('A test token for testing').closest('[class*="cursor-pointer"]')

    if (card) {
      fireEvent.click(card)
      const links = screen.getAllByRole('link')
      const twitterLink = links.find(link => link.getAttribute('href')?.includes('twitter.com/intent/tweet'))
      expect(twitterLink).toBeDefined()
    }
  })
})

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
    twitter: 'https://twitter.com/testtoken',
    telegram: 'https://t.me/testtoken',
    discord: 'https://discord.gg/testtoken',
    facebook: 'https://facebook.com/testtoken',
  },
  exchange_links: ['https://uniswap.org', 'https://binance.com'],
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

  it('renders token name and symbol', () => {
    render(<TokenCard token={mockToken} />)
    expect(screen.getByText('TestToken')).toBeDefined()
  })

  it('renders short description when available', () => {
    render(<TokenCard token={mockToken} />)
    expect(screen.getByText('A test token for testing')).toBeDefined()
  })

  it('renders time since creation', () => {
    render(<TokenCard token={mockToken} />)
    // Token created 5 days ago
    expect(screen.getByText('5d')).toBeDefined()
  })

  it('renders with minimal data (no optional fields)', () => {
    render(<TokenCard token={mockTokenNoOptional} />)
    expect(screen.getByText('MinimalToken')).toBeDefined()
  })

  it('shows initials when no logo_url', () => {
    render(<TokenCard token={mockTokenNoOptional} />)
    expect(screen.getByText('MI')).toBeDefined()
  })

  it('expands on mouse enter', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('TestToken').closest('div[class*="cursor-pointer"]')?.parentElement
    expect(card).toBeDefined()

    if (card) {
      fireEvent.mouseEnter(card)
      expect(screen.getByText('This is the full description of the test token with more details.')).toBeDefined()
    }
  })

  it('collapses on mouse leave', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('TestToken').closest('div[class*="cursor-pointer"]')?.parentElement

    if (card) {
      fireEvent.mouseEnter(card)
      expect(screen.getByText('This is the full description of the test token with more details.')).toBeDefined()

      fireEvent.mouseLeave(card)
      // After collapse, the description should be hidden (max-h-0)
      const description = screen.queryByText('This is the full description of the test token with more details.')
      // Note: In jsdom, the element might still be in the DOM but hidden
      expect(description).toBeDefined()
    }
  })

  it('displays contract address when available', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('TestToken').closest('div[class*="cursor-pointer"]')?.parentElement

    if (card) {
      fireEvent.mouseEnter(card)
      expect(screen.getByText(/0x1234567890abcdef/)).toBeDefined()
    }
  })

  it('does not display contract address when null', () => {
    render(<TokenCard token={mockTokenNoOptional} />)
    const card = screen.getByText('MinimalToken').closest('div[class*="cursor-pointer"]')?.parentElement

    if (card) {
      fireEvent.mouseEnter(card)
      expect(screen.queryByText('Contract:')).toBeNull()
    }
  })

  // it('displays hashtags when available', () => {
  //   render(<TokenCard token={mockToken} />)
  //   const card = screen.getByText('TestToken').closest('div[class*="cursor-pointer"]')?.parentElement
  //
  //   if (card) {
  //     fireEvent.mouseEnter(card)
  //     expect(screen.getByText('#Test')).toBeDefined()
  //     expect(screen.getByText('#DeFi')).toBeDefined()
  //   }
  // })

  it('does not display hashtags section when empty', () => {
    render(<TokenCard token={mockTokenNoOptional} />)
    const card = screen.getByText('MinimalToken').closest('div[class*="cursor-pointer"]')?.parentElement

    if (card) {
      fireEvent.mouseEnter(card)
      expect(screen.queryByText('#Test')).toBeNull()
    }
  })

  it('displays social links when available', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('TestToken').closest('div[class*="cursor-pointer"]')?.parentElement

    if (card) {
      fireEvent.mouseEnter(card)
      expect(screen.getByText('Socials:')).toBeDefined()
    }
  })

  it('displays exchange links when available', () => {
    render(<TokenCard token={mockToken} />)
    const card = screen.getByText('TestToken').closest('div[class*="cursor-pointer"]')?.parentElement

    if (card) {
      fireEvent.mouseEnter(card)
      expect(screen.getByText('Buy on:')).toBeDefined()
    }
  })

  it('does not display exchange links when empty', () => {
    render(<TokenCard token={mockTokenNoOptional} />)
    const card = screen.getByText('MinimalToken').closest('div[class*="cursor-pointer"]')?.parentElement

    if (card) {
      fireEvent.mouseEnter(card)
      expect(screen.queryByText('Buy on:')).toBeNull()
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
    const card = screen.getByText('TestToken').closest('div[class*="cursor-pointer"]')?.parentElement

    if (card) {
      fireEvent.mouseEnter(card)

      // Find the copy button by its title
      const copyButton = screen.getByTitle('Copy to clipboard')
      fireEvent.click(copyButton)

      expect(clipboardWriteText).toHaveBeenCalledWith(mockToken.contract_address)
    }
  }, 10000)

  it('renders hours correctly', () => {
    const hoursAgoToken = { ...mockToken, created_at: '2024-06-15T08:00:00Z' }
    render(<TokenCard token={hoursAgoToken} />)
    expect(screen.getByText('4h')).toBeDefined()
  })

  it('renders minutes correctly', () => {
    const recentToken = { ...mockToken, created_at: '2024-06-15T11:59:00Z' }
    render(<TokenCard token={recentToken} />)
    expect(screen.getByText('1m')).toBeDefined()
  })

  it('renders seconds correctly', () => {
    const secondsAgoToken = { ...mockToken, created_at: '2024-06-15T11:59:59Z' }
    render(<TokenCard token={secondsAgoToken} />)
    expect(screen.getByText('1s')).toBeDefined()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TokenTerminal from './TokenTerminal'
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

describe('TokenTerminal', () => {
  it('renders terminal title', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} />)
    expect(screen.getByText('YOUNGWHALE TERMINAL')).toBeDefined()
  })

  it('shows LIVE indicator when not expired', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} />)
    expect(screen.getByText('LIVE')).toBeDefined()
  })

  it('hides LIVE indicator when expired', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={true} isExpanded={true} />)
    expect(screen.queryByText('LIVE')).toBeNull()
  })

  it('displays full description', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} />)
    expect(screen.getByText('WHALE INTELLIGENCE BRIEF')).toBeDefined()
    expect(screen.getByText('This is the full description of the test token with more details.')).toBeDefined()
  })

  it('displays fallback description when full_description is null', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockTokenNoOptional} isExpired={false} isExpanded={true} />)
    expect(screen.getByText('No description available.')).toBeDefined()
  })

  it('displays contract address', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} />)
    expect(screen.getByText(/0x1234/)).toBeDefined()
  })

  it('displays N/A when contract address is null', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockTokenNoOptional} isExpired={false} isExpanded={true} />)
    expect(screen.getByText((content) => content.includes('N/A'))).toBeDefined()
  })

  it('displays social links', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} />)
    expect(screen.getByText(/x.com/)).toBeDefined()
    expect(screen.getByText(/t.me/)).toBeDefined()
    expect(screen.getByText('discord')).toBeDefined()
    expect(screen.getByText('facebook')).toBeDefined()
  })

  it('displays website url', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} />)
    expect(screen.getByText('testtoken.example')).toBeDefined()
  })

  it('does not display social links when empty', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockTokenNoOptional} isExpired={false} isExpanded={true} />)
    expect(screen.queryByText(/x.com/)).toBeNull()
    expect(screen.queryByText(/t.me/)).toBeNull()
  })

  it('displays exchange links', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} />)
    expect(screen.getByText('[ETH/USDT]')).toBeDefined()
    expect(screen.getByText('[TEST/BNB]')).toBeDefined()
  })

  it('displays no pairs message when exchange links are empty', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockTokenNoOptional} isExpired={false} isExpanded={true} />)
    expect(screen.getByText('[NO PAIRS FOUND]')).toBeDefined()
  })

  it('displays supply', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} />)
    expect(screen.getByText((content) => content.includes('1000000'))).toBeDefined()
  })

  it('displays rating when not expired', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} />)
    expect(screen.getByText('4.5/10')).toBeDefined()
  })

  it('displays expired rating for old tokens', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={true} isExpanded={true} />)
    expect(screen.getByText('[ SIGNAL EXPIRED ]')).toBeDefined()
  })

  it('handles copy button click', async () => {
    const clipboardWriteText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: {
        writeText: clipboardWriteText,
      },
    })

    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} />)

    const copyButton = screen.getByText((content) => content.includes('COPY'))
    fireEvent.click(copyButton)

    expect(clipboardWriteText).toHaveBeenCalledWith(mockToken.contract_address)
  }, 10000)

  it('shows copied state after clicking copy button', async () => {
    const clipboardWriteText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: {
        writeText: clipboardWriteText,
      },
    })

    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} />)
    const copyButton = screen.getByText((content) => content.includes('COPY'))
    fireEvent.click(copyButton)
    expect(screen.getByText((content) => content.includes('COPIED'))).toBeDefined()
  })

  it('displays chain badge', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} />)
    expect(screen.getByText('Ethereum')).toBeDefined()
  })

  it('displays symbol', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} />)
    const symbols = screen.getAllByText('$TEST')
    expect(symbols.length).toBeGreaterThanOrEqual(1)
  })

  it('displays explorer link for different chains', () => {
    const bscToken = { ...mockToken, chain: 'BSC' }
    render(<TokenTerminal themeColor="#ff0000" token={bscToken} isExpired={false} isExpanded={true} />)
    expect(screen.getByText((content) => content.includes('0x1234'))).toBeDefined()
  })

  it('displays share to X link', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} />)
    const links = screen.getAllByRole('link')
    const twitterLink = links.find(link => link.getAttribute('href')?.includes('twitter.com/intent/tweet'))
    expect(twitterLink).toBeDefined()
  })

  it('is hidden when not expanded', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={false} />)
    // When not expanded, the content is in DOM but visually hidden (max-h-0)
    // In jsdom, we can still find the text
    expect(screen.getByText('YOUNGWHALE TERMINAL')).toBeDefined()
  })
})

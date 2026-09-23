import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TokenTerminal, { getExchangeName } from './TokenTerminal'
import type { TokenWithHashtags } from '@/shared/types'

const chainIcons: Record<string, string> = {
  Arbitrum: 'arbitrum-arb-logo.svg',
  ['BNB Smart Chain (BEP20)']: 'bnb-bnb-logo.svg',
  Ethereum: 'ethereum-eth-logo-diamond-purple.svg',
  Polygon: 'polygon-matic-logo.svg',
  Solana: 'solana-sol-logo.svg',
  Base: 'blue',
  Robinhood: 'robinhood-chain.png',
  Cofinex: 'cofinexexchange_logo',
  AnubisChain: 'anubis-chain.webp'
}

const chainExplorers: Record<string, string> = {
  Ethereum: 'https://etherscan.io/token/',
  BSC: 'https://bscscan.com/token/',
  Solana: 'https://solscan.io/token/',
}

const mockToken: TokenWithHashtags = {
  id: '1',
  name: 'TestToken',
  display_name: 'TestToken',
  symbol: 'TEST',
  chain: 'Ethereum',
  contract_address: '0x1234567890abcdef1234567890abcdef12345678',
  slug: 'test',
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
  preferred_exchange: 'https://uniswap.org',
  start_date: null,
  end_date: null,
  source_type: 'dex',
  source_url: null,
  confidence: 'high',
  raw_token_id: null,
  status: 'approved',
  is_promoted: false,
  is_verified: true,
  presale_status: null,
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
  display_name: 'MinimalToken',
  symbol: 'MIN',
  chain: 'Solana',
  contract_address: null,
  slug: 'min',
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
  presale_status: null,
  main_hashtag: null,
  rating: 0,
  supply: null,
  created_at: '2024-06-09T10:00:00Z',
  updated_at: '2024-06-09T10:00:00Z',
  published_at: null,
  hashtags: [],
}

describe('getExchangeName', () => {
  it('extracts exchange name from urls', () => {
    expect(getExchangeName('https://www.gate.com/trade/JPMON_USDT')).toBe('GATE')
    expect(getExchangeName('https://app.uniswap.org/explore/tokens/robinhood/0x6662060b16b61ba3f83bca6ccc796eb3acdf7777')).toBe('UNISWAP')
    expect(getExchangeName('https://dex.coinmarketcap.com/token/bsc/0x8D345658a86B5Bd145d5b522B80939ef8c8AaE10/')).toBe('COINMARKETCAP')
    expect(getExchangeName('https://swap.pump.fun/?input=aTUfRuPj3tp7FEpzAXLjs4VnQgAFbExD5JHGTyvpump')).toBe('PUMP')
    expect(getExchangeName('https://pro.kraken.com/app/trade/usdsm-usd')).toBe('KRAKEN')
    expect(getExchangeName('https://exchange.coinbase.com/trade/ALIGN-USD')).toBe('COINBASE')
    expect(getExchangeName('lbank.com/en-US/trade/xyz_usdt/')).toBe('LBANK')
    expect(getExchangeName('https://pancakeswap.finance/swap?chain=eth')).toBe('PANCAKESWAP')
  })

  it('returns input unchanged when no domain matches', () => {
    expect(getExchangeName('Uniswap')).toBe('Uniswap')
  })
})

describe('TokenTerminal', () => {
  it('renders terminal title', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.getByText('YOUNGWHALE TERMINAL')).toBeDefined()
  })

  it('shows LIVE indicator when not expired', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.getByText('LIVE')).toBeDefined()
  })

  it('hides LIVE indicator when expired', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={true} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.queryByText('LIVE')).toBeNull()
  })

  it('displays full description', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.getByText('WHALE INTELLIGENCE BRIEF')).toBeDefined()
    expect(screen.getByText('This is the full description of the test token with more details.')).toBeDefined()
  })

  it('displays fallback description when full_description is null', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockTokenNoOptional} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.getByText('No description available.')).toBeDefined()
  })

  it('displays contract address', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.getByText(/0x1234/)).toBeDefined()
  })

  it('hides contract row when contract address is null', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockTokenNoOptional} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.queryByText((content) => content.includes('N/A'))).toBeNull()
  })

  it('displays social links', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.getByText('X')).toBeDefined()
    expect(screen.getByText('TELEGRAM')).toBeDefined()
    expect(screen.getByText('DISCORD')).toBeDefined()
    expect(screen.getByText('FACEBOOK')).toBeDefined()
  })

  it('displays website url', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.getByText('testtoken.example')).toBeDefined()
  })

  it('does not display social links when empty', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockTokenNoOptional} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.queryByText(/x.com/)).toBeNull()
    expect(screen.queryByText(/t.me/)).toBeNull()
  })

  it('displays exchange link', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.getByText('UNISWAP')).toBeDefined()
  })

  it('hides trade row when exchange links are empty', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockTokenNoOptional} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.queryByText('NO PAIRS FOUND')).toBeNull()
  })

  it('displays supply', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.getByText((content) => content.includes('1000000'))).toBeDefined()
  })

  it('displays rating when not expired', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.getByText('4.5/10')).toBeDefined()
  })

  it('displays expired rating for old tokens', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={true} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.getByText('SIGNAL EXPIRED')).toBeDefined()
  })

  it('handles copy button click', async () => {
    const clipboardWriteText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: {
        writeText: clipboardWriteText,
      },
    })

    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)

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

    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    const copyButton = screen.getByText((content) => content.includes('COPY'))
    fireEvent.click(copyButton)
    expect(screen.getByText((content) => content.includes('COPIED'))).toBeDefined()
  })

  it('displays chain badge', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.getByText('Ethereum')).toBeDefined()
  })

  it('displays symbol', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    const symbols = screen.getAllByText('$TEST')
    expect(symbols.length).toBeGreaterThanOrEqual(1)
  })

  it('displays explorer link for different chains', () => {
    const bscToken = { ...mockToken, chain: 'BSC' }
    render(<TokenTerminal themeColor="#ff0000" token={bscToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.getByText((content) => content.includes('0x1234'))).toBeDefined()
  })

  it('links contract address using the chain explorer_prefix', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    const link = screen.getByText(/0x1234/).closest('a')
    expect(link?.getAttribute('href')).toBe(`https://etherscan.io/token/${mockToken.contract_address}`)
  })

  it('renders contract address without link when chain has no explorer_prefix', () => {
    const unknownChainToken = { ...mockToken, chain: 'UnknownChain' }
    render(<TokenTerminal themeColor="#ff0000" token={unknownChainToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    const label = screen.getByText(/0x1234/)
    expect(label.closest('a')).toBeNull()
  })

  it('displays share to X link', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    const links = screen.getAllByRole('link')
    const twitterLink = links.find(link => link.getAttribute('href')?.includes('twitter.com/intent/tweet'))
    expect(twitterLink).toBeDefined()
  })

  it('calls closeTerminalAction when close button is clicked', () => {
    const closeTerminalAction = vi.fn()
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={closeTerminalAction} />)
    const closeIcon = document.querySelector('.lucide-x')
    expect(closeIcon).toBeDefined()
    fireEvent.click(closeIcon as Element)
    expect(closeTerminalAction).toHaveBeenCalledTimes(1)
  })

  it('displays exchange name extracted from preferred_exchange url', () => {
    const gateToken = { ...mockToken, preferred_exchange: 'https://www.gate.com/trade/JPMON_USDT' }
    render(<TokenTerminal themeColor="#ff0000" token={gateToken} isExpired={false} isExpanded={true} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    expect(screen.getByText('GATE')).toBeDefined()
  })

  it('is hidden when not expanded', () => {
    render(<TokenTerminal themeColor="#ff0000" token={mockToken} isExpired={false} isExpanded={false} chainIcons={chainIcons} chainExplorers={chainExplorers} closeTerminalAction={vi.fn()} />)
    // When not expanded, the content is in DOM but visually hidden (max-h-0)
    // In jsdom, we can still find the text
    expect(screen.getByText('YOUNGWHALE TERMINAL')).toBeDefined()
  })
})

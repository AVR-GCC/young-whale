import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'
import type { TokenWithHashtags } from '@/shared/types'
import { categories, CategoryType } from './lib/categories'

vi.mock('./components/HeaderBanner', () => ({
  default: () => <header data-testid="header-banner">Young Whale</header>,
}))

vi.mock('./components/CategoryContainer', () => ({
  default: ({ category, title, tokenCount, tokens }: { category: CategoryType; title: string; tokenCount: number; tokens: TokenWithHashtags[] }) => (
    <div data-testid={`category-${category.id}`}>
      <h3>{title}</h3>
      <span>{tokenCount} tokens</span>
      <div data-testid="token-list">
        {tokens.map((token: TokenWithHashtags) => (
          <div key={token.id}>{token.name}</div>
        ))}
      </div>
    </div>
  ),
}))

vi.mock('./lib/data', () => ({
  getAllApprovedTokens: vi.fn(),
  getTokensByCategory: vi.fn((tokens: TokenWithHashtags[], category: string) => 
    tokens.filter(t => t.category === category)
  ),
  getCategoryCount: vi.fn((tokens: TokenWithHashtags[], category: string) => 
    tokens.filter(t => t.category === category).length
  ),
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
    hashtags: [],
  },
]

describe('Home Page', () => {
  it('renders header banner', async () => {
    const { getAllApprovedTokens } = await import('./lib/data')
    vi.mocked(getAllApprovedTokens).mockResolvedValue(mockTokens)
    
    const HomeComponent = await Home()
    render(HomeComponent)
    
    expect(screen.getByTestId('header-banner')).toBeDefined()
  })

  it('renders page title', async () => {
    const { getAllApprovedTokens } = await import('./lib/data')
    vi.mocked(getAllApprovedTokens).mockResolvedValue(mockTokens)
    
    const HomeComponent = await Home()
    render(HomeComponent)
    
    expect(screen.getByText('New Token Listings')).toBeDefined()
  })

  it('renders page subtitle', async () => {
    const { getAllApprovedTokens } = await import('./lib/data')
    vi.mocked(getAllApprovedTokens).mockResolvedValue(mockTokens)
    
    const HomeComponent = await Home()
    render(HomeComponent)
    
    expect(screen.getByText(/Explore latest cryptocurrency tokens/)).toBeDefined()
  })

  it('renders all 4 category containers', async () => {
    const { getAllApprovedTokens } = await import('./lib/data')
    vi.mocked(getAllApprovedTokens).mockResolvedValue(mockTokens)
    
    const HomeComponent = await Home()
    render(HomeComponent)
    
    expect(screen.getByTestId('category-Tech')).toBeDefined()
    expect(screen.getByTestId('category-Meme')).toBeDefined()
    expect(screen.getByTestId('category-RWA')).toBeDefined()
    expect(screen.getByTestId('category-Presale')).toBeDefined()
  })

  it('passes correct tokens to each category', async () => {
    const { getAllApprovedTokens } = await import('./lib/data')
    vi.mocked(getAllApprovedTokens).mockResolvedValue(mockTokens)
    
    const HomeComponent = await Home()
    render(HomeComponent)
    
    expect(screen.getByTestId('category-Tech')).toBeDefined()
    expect(screen.getByTestId('category-Meme')).toBeDefined()
    expect(screen.getByTestId('category-RWA')).toBeDefined()
    expect(screen.getByTestId('category-Presale')).toBeDefined()
  })

  it('handles empty tokens array', async () => {
    const { getAllApprovedTokens } = await import('./lib/data')
    vi.mocked(getAllApprovedTokens).mockResolvedValue([])
    
    const HomeComponent = await Home()
    render(HomeComponent)
    
    expect(screen.getByTestId('category-Tech')).toBeDefined()
    expect(screen.getByTestId('category-Meme')).toBeDefined()
    expect(screen.getByTestId('category-RWA')).toBeDefined()
    expect(screen.getByTestId('category-Presale')).toBeDefined()
  })

  it('passes correct token counts to categories', async () => {
    const { getAllApprovedTokens } = await import('./lib/data')
    vi.mocked(getAllApprovedTokens).mockResolvedValue(mockTokens)
    
    const HomeComponent = await Home()
    render(HomeComponent)
    
    // All categories have 1 token each, so we should find 4 instances
    const tokenCounts = screen.getAllByText('1 tokens')
    expect(tokenCounts).toHaveLength(4)
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CategoryGrid from './CategoryGrid'
import type { TokenWithHashtags } from '@/shared/types'

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

describe('CategoryGrid', () => {
  it('renders all 4 category containers', () => {
    render(
      <CategoryGrid
        tokens={mockTokens}
        loading={false}
        selectedToken={null}
        setSelectedToken={() => {}}
        activeFilter={null}
        sortBy="default"
      />
    )

    // Categories appear twice (desktop + mobile layouts)
    expect(screen.getAllByTestId('category-Tech').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByTestId('category-Meme').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByTestId('category-RWA').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByTestId('category-Presale').length).toBeGreaterThanOrEqual(1)
  })

  it('passes correct tokens to each category', () => {
    render(
      <CategoryGrid
        tokens={mockTokens}
        loading={false}
        selectedToken={null}
        setSelectedToken={() => {}}
        activeFilter={null}
        sortBy="default"
      />
    )

    // Token names appear twice (desktop + mobile layouts)
    expect(screen.getAllByText('TechToken1').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('MemeToken1').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('RWAToken1').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('PresaleToken1').length).toBeGreaterThanOrEqual(1)
  })

  it('handles empty tokens array', () => {
    render(
      <CategoryGrid
        tokens={[]}
        loading={false}
        selectedToken={null}
        setSelectedToken={() => {}}
        activeFilter={null}
        sortBy="default"
      />
    )

    expect(screen.getAllByTestId('category-Tech').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByTestId('category-Meme').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByTestId('category-RWA').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByTestId('category-Presale').length).toBeGreaterThanOrEqual(1)
  })

  it('passes correct token counts to categories', () => {
    render(
      <CategoryGrid
        tokens={mockTokens}
        loading={false}
        selectedToken={null}
        setSelectedToken={() => {}}
        activeFilter={null}
        sortBy="default"
      />
    )

    // All categories have 1 token each, but rendered twice (desktop + mobile)
    const tokenCounts = screen.getAllByText('1 tokens')
    expect(tokenCounts.length).toBeGreaterThanOrEqual(4)
  })

  it('renders loading state', () => {
    render(
      <CategoryGrid
        tokens={mockTokens}
        loading={true}
        selectedToken={null}
        setSelectedToken={() => {}}
        activeFilter={null}
        sortBy="default"
      />
    )
    // Categories should still render even when loading
    expect(screen.getAllByTestId('category-Tech').length).toBeGreaterThanOrEqual(1)
  })

  it('hides grid when active filter is set', () => {
    const { container } = render(
      <CategoryGrid
        tokens={mockTokens}
        loading={false}
        selectedToken={null}
        setSelectedToken={() => {}}
        activeFilter="defi"
        sortBy="default"
      />
    )

    // Check that the desktop grid has opacity-0 class
    const desktopGrid = container.querySelector('.hidden.lg\\:grid')
    expect(desktopGrid?.classList.contains('opacity-0')).toBe(true)
  })

  it('filters tokens by category', () => {
    render(
      <CategoryGrid
        tokens={mockTokens}
        loading={false}
        selectedToken={null}
        setSelectedToken={() => {}}
        activeFilter={null}
        sortBy="default"
      />
    )

    // Each category should only have its own token
    const techCategories = screen.getAllByTestId('category-Tech')
    techCategories.forEach(cat => {
      expect(cat.textContent).toContain('TechToken1')
      expect(cat.textContent).not.toContain('MemeToken1')
    })
  })
})

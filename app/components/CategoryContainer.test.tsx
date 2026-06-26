import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CategoryContainer from './CategoryContainer'
import type { TokenWithHashtags } from '@/shared/types'

const mockTokens: TokenWithHashtags[] = [
  {
    id: '1',
    name: 'Token1',
    symbol: 'TK1',
    chain: 'Ethereum',
    contract_address: '0x123',
    unique_key: 'tk1-eth',
    slug: 'token1',
    category: 'Tech',
    short_description: 'First token',
    full_description: 'Full description of first token',
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
    name: 'Token2',
    symbol: 'TK2',
    chain: 'Solana',
    contract_address: null,
    unique_key: 'tk2-sol',
    slug: 'token2',
    category: 'Tech',
    short_description: 'Second token',
    full_description: 'Full description of second token',
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
    name: 'Token3',
    symbol: 'TK3',
    chain: 'Base',
    contract_address: null,
    unique_key: 'tk3-base',
    slug: 'token3',
    category: 'Tech',
    short_description: 'Third token',
    full_description: 'Full description of third token',
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
    name: 'Token4',
    symbol: 'TK4',
    chain: 'Ethereum',
    contract_address: null,
    unique_key: 'tk4-eth',
    slug: 'token4',
    category: 'Tech',
    short_description: 'Fourth token',
    full_description: 'Full description of fourth token',
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
    supply: 21000000,
    created_at: '2024-06-07T10:00:00Z',
    updated_at: '2024-06-07T10:00:00Z',
    hashtags: [],
  },
  {
    id: '5',
    name: 'Token5',
    symbol: 'TK5',
    chain: 'Solana',
    contract_address: null,
    unique_key: 'tk5-sol',
    slug: 'token5',
    category: 'Tech',
    short_description: 'Fifth token',
    full_description: 'Full description of fifth token',
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
    supply: 1000000000,
    created_at: '2024-06-06T10:00:00Z',
    updated_at: '2024-06-06T10:00:00Z',
    hashtags: [],
  },
  {
    id: '6',
    name: 'Token6',
    symbol: 'TK6',
    chain: 'Base',
    contract_address: null,
    unique_key: 'tk6-base',
    slug: 'token6',
    category: 'Tech',
    short_description: 'Sixth token',
    full_description: 'Full description of sixth token',
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
    created_at: '2024-06-05T10:00:00Z',
    updated_at: '2024-06-05T10:00:00Z',
    hashtags: [],
  },
]

describe('CategoryContainer', () => {
  it('renders category title', () => {
    render(
      <CategoryContainer
        category="Tech"
        title="Technology"
        tokenCount={5}
        tokens={mockTokens.slice(0, 5)}
      />
    )
    expect(screen.getByText('Technology')).toBeDefined()
  })

  it('renders token count in subtitle', () => {
    render(
      <CategoryContainer
        category="Tech"
        title="Technology"
        tokenCount={5}
        tokens={mockTokens.slice(0, 5)}
      />
    )
    expect(screen.getByText('5 tokens available')).toBeDefined()
  })

  it('renders single token count correctly', () => {
    render(
      <CategoryContainer
        category="Tech"
        title="Technology"
        tokenCount={1}
        tokens={mockTokens.slice(0, 1)}
      />
    )
    expect(screen.getByText('1 token available')).toBeDefined()
  })

  // TODO - restore
  // it('renders all tokens in the list after clicking load more', () => {
  //   render(
  //     <CategoryContainer
  //       category="Tech"
  //       title="Technology"
  //       tokenCount={6}
  //       tokens={mockTokens}
  //     />
  //   )
  //
  //   // Initially shows 5 tokens
  //   expect(screen.getByText('Token1')).toBeDefined()
  //   expect(screen.getByText('Token2')).toBeDefined()
  //   expect(screen.getByText('Token3')).toBeDefined()
  //   expect(screen.getByText('Token4')).toBeDefined()
  //   expect(screen.getByText('Token5')).toBeDefined()
  //
  //   // Token6 is not visible initially
  //   expect(screen.queryByText('Token6')).toBeNull()
  //
  //   // Click load more to show Token6
  //   const loadMoreButton = screen.getByText(/Load more/)
  //   fireEvent.click(loadMoreButton)
  //
  //   expect(screen.getByText('Token6')).toBeDefined()
  // })

  it('shows empty state when no tokens', () => {
    render(
      <CategoryContainer
        category="Tech"
        title="Technology"
        tokenCount={0}
        tokens={[]}
      />
    )
    expect(screen.getByText('No tokens in this category yet')).toBeDefined()
  })

  it('shows load more button when there are more than 5 tokens', () => {
    render(
      <CategoryContainer
        category="Tech"
        title="Technology"
        tokenCount={6}
        tokens={mockTokens}
      />
    )
    expect(screen.getByText(/Load more/)).toBeDefined()
    expect(screen.getByText(/1 remaining/)).toBeDefined()
  })

  it('does not show load more button when there are 5 or fewer tokens', () => {
    render(
      <CategoryContainer
        category="Tech"
        title="Technology"
        tokenCount={5}
        tokens={mockTokens.slice(0, 5)}
      />
    )
    expect(screen.queryByText(/Load more/)).toBeNull()
  })

  // TODO - restore
  // it('loads more tokens when clicking load more button', () => {
  //   render(
  //     <CategoryContainer
  //       category="Tech"
  //       title="Technology"
  //       tokenCount={6}
  //       tokens={mockTokens}
  //     />
  //   )
  //
  //   // Initially shows 5 tokens
  //   expect(screen.getByText('Token1')).toBeDefined()
  //   expect(screen.getByText('Token2')).toBeDefined()
  //   expect(screen.getByText('Token3')).toBeDefined()
  //   expect(screen.getByText('Token4')).toBeDefined()
  //   expect(screen.getByText('Token5')).toBeDefined()
  //
  //   // Click load more
  //   const loadMoreButton = screen.getByText(/Load more/)
  //   fireEvent.click(loadMoreButton)
  //
  //   // Now shows all 6 tokens
  //   expect(screen.getByText('Token6')).toBeDefined()
  // })

  it('hides load more button after loading all tokens', () => {
    render(
      <CategoryContainer
        category="Tech"
        title="Technology"
        tokenCount={6}
        tokens={mockTokens}
      />
    )

    const loadMoreButton = screen.getByText(/Load more/)
    fireEvent.click(loadMoreButton)

    // Button should be gone after loading all
    expect(screen.queryByText(/Load more/)).toBeNull()
  })

  it('renders different category icons', () => {
    const categories = ['Tech', 'Meme', 'RWA', 'Presale'] as const

    categories.forEach((category) => {
      const { unmount } = render(
        <CategoryContainer
          category={category}
          title={category}
          tokenCount={0}
          tokens={[]}
        />
      )
      expect(screen.getByText(category)).toBeDefined()
      unmount()
    })
  })

  it('displays correct remaining count on load more button', () => {
    const manyTokens = Array.from({ length: 12 }, (_, i) => ({
      ...mockTokens[0],
      id: `${i + 1}`,
      name: `Token${i + 1}`,
      symbol: `TK${i + 1}`,
      created_at: `2024-06-${String(15 - i).padStart(2, '0')}T10:00:00Z`,
    }))

    render(
      <CategoryContainer
        category="Tech"
        title="Technology"
        tokenCount={12}
        tokens={manyTokens}
      />
    )

    // Initially shows 5, so 7 remaining
    expect(screen.getByText(/7 remaining/)).toBeDefined()

    // Click load more, now shows 10, so 2 remaining
    const loadMoreButton = screen.getByText(/Load more/)
    fireEvent.click(loadMoreButton)

    expect(screen.getByText(/2 remaining/)).toBeDefined()

    // Click again, now shows all 12, button should be gone
    fireEvent.click(loadMoreButton)
    expect(screen.queryByText(/Load more/)).toBeNull()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CategoryContainer from './CategoryContainer'
import type { TokenWithHashtags } from '@/shared/types'
import { categories } from '../lib/categories'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const mockSetSelectedToken = vi.fn()

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
    published_at: null,
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
    published_at: null,
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
    published_at: null,
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
    published_at: null,
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
    published_at: null,
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
    published_at: null,
    hashtags: [],
  },
]

describe('CategoryContainer', () => {
  it('renders category title', () => {
    render(
      <CategoryContainer
        category={categories[0]}
        tokenCount={5}
        tokens={mockTokens.slice(0, 5)}
        selectedToken={null}
        setSelectedTokenAction={mockSetSelectedToken}
        loading={false}
        renderTitle={true}
      />
    )
    expect(screen.getByText(categories[0].title)).toBeDefined()
  })

  it('does not render category title when renderTitle is false', () => {
    render(
      <CategoryContainer
        category={categories[0]}
        tokenCount={5}
        tokens={mockTokens.slice(0, 5)}
        selectedToken={null}
        setSelectedTokenAction={mockSetSelectedToken}
        loading={false}
        renderTitle={false}
      />
    )
    expect(screen.queryByText(categories[0].title)).toBeNull()
  })

  it('shows empty state when no tokens', () => {
    render(
      <CategoryContainer
        category={categories[0]}
        tokenCount={0}
        tokens={[]}
        selectedToken={null}
        setSelectedTokenAction={mockSetSelectedToken}
        loading={false}
        renderTitle={true}
      />
    )
    expect(
      screen.getByText('NO CHANNELS DISCOVERED UNDER ACTIVE SCAN SECTORS')
    ).toBeDefined()
  })

  it('shows scan-deeper (+) control when there are more than 5 tokens', () => {
    render(
      <CategoryContainer
        category={categories[0]}
        tokenCount={6}
        tokens={mockTokens}
        selectedToken={null}
        setSelectedTokenAction={mockSetSelectedToken}
        loading={false}
        renderTitle={true}
      />
    )
    expect(screen.getByText('+')).toBeDefined()
    // Surface (−) control is hidden until expanded past the initial limit
    expect(screen.queryByText('−')).toBeNull()
  })

  it('does not show expand controls when there are 5 or fewer tokens', () => {
    render(
      <CategoryContainer
        category={categories[0]}
        tokenCount={5}
        tokens={mockTokens.slice(0, 5)}
        selectedToken={null}
        setSelectedTokenAction={mockSetSelectedToken}
        loading={false}
        renderTitle={true}
      />
    )
    expect(screen.queryByText('+')).toBeNull()
    expect(screen.queryByText('−')).toBeNull()
  })

  it('reveals more tokens and surface control after clicking scan-deeper', () => {
    const manyTokens = Array.from({ length: 12 }, (_, i) => ({
      ...mockTokens[0],
      id: `${i + 1}`,
      name: `Token${i + 1}`,
      symbol: `TK${i + 1}`,
      rating: 12 - i,
      created_at: `2024-06-${String(15 - i).padStart(2, '0')}T10:00:00Z`,
    }))

    render(
      <CategoryContainer
        category={categories[0]}
        tokenCount={12}
        tokens={manyTokens}
        selectedToken={null}
        setSelectedTokenAction={mockSetSelectedToken}
        loading={false}
        renderTitle={true}
      />
    )

    // Initially limited to 5, so the scan-deeper control is present
    const scanDeeper = screen.getByText('+')
    fireEvent.click(scanDeeper)

    // Now expanded past the initial limit, the surface (−) control appears
    expect(screen.getByText('−')).toBeDefined()
  })

  it('renders for every category', () => {
    categories.forEach((category) => {
      const { unmount } = render(
        <CategoryContainer
          category={category}
          tokenCount={0}
          tokens={[]}
          selectedToken={null}
          setSelectedTokenAction={mockSetSelectedToken}
          loading={false}
          renderTitle={true}
        />
      )
      expect(screen.getByText(category.title)).toBeDefined()
      unmount()
    })
  })

  it('shows skeleton rows when loading is true', () => {
    render(
      <CategoryContainer
        category={categories[0]}
        tokenCount={6}
        tokens={mockTokens}
        selectedToken={null}
        setSelectedTokenAction={mockSetSelectedToken}
        loading={true}
        renderTitle={true}
      />
    )
    // Token names should not be visible while loading
    expect(screen.queryByText('Token1')).toBeNull()
    // Skeleton rows should be present (animate-pulse class indicates skeleton)
    expect(document.querySelectorAll('.animate-pulse').length).toBe(5)
  })
})

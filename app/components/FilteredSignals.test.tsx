import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FilteredSignals from './FilteredSignals'
import type { TokenWithHashtags } from '@/shared/types'

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
    hashtags: [{ id: '1', name: 'defi', slug: 'defi', is_active: true, created_at: '2024-01-01' }],
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
    hashtags: [{ id: '2', name: 'meme', slug: 'meme', is_active: true, created_at: '2024-01-01' }],
  },
]

describe('FilteredSignals', () => {
  it('renders filtered signals header when active', () => {
    render(
      <FilteredSignals
        activeFilter="defi"
        setActiveFilter={() => {}}
        loading={false}
        filteredTokens={mockTokens}
      />
    )

    expect(screen.getByText('FILTERED SIGNALS:')).toBeDefined()
    expect(screen.getByText('#defi')).toBeDefined()
  })

  it('renders clear filter button', () => {
    render(
      <FilteredSignals
        activeFilter="defi"
        setActiveFilter={() => {}}
        loading={false}
        filteredTokens={mockTokens}
      />
    )

    expect(screen.getByText(/CLEAR FILTER/)).toBeDefined()
  })

  it('calls setActiveFilter when clear button clicked', () => {
    const setActiveFilter = vi.fn()
    render(
      <FilteredSignals
        activeFilter="defi"
        setActiveFilter={setActiveFilter}
        loading={false}
        filteredTokens={mockTokens}
      />
    )

    const clearButton = screen.getByText(/CLEAR FILTER/)
    fireEvent.click(clearButton)
    expect(setActiveFilter).toHaveBeenCalledWith(null)
  })

  it('calls setActiveFilter when tag button clicked', () => {
    const setActiveFilter = vi.fn()
    render(
      <FilteredSignals
        activeFilter="defi"
        setActiveFilter={setActiveFilter}
        loading={false}
        filteredTokens={mockTokens}
      />
    )

    const tagButton = screen.getByText('#defi')
    fireEvent.click(tagButton)
    expect(setActiveFilter).toHaveBeenCalledWith(null)
  })

  it('renders loading skeletons', () => {
    render(
      <FilteredSignals
        activeFilter="defi"
        setActiveFilter={() => {}}
        loading={true}
        filteredTokens={[]}
      />
    )

    // Should render 5 skeleton rows
    const { container } = render(
      <FilteredSignals
        activeFilter="defi"
        setActiveFilter={() => {}}
        loading={true}
        filteredTokens={[]}
      />
    )
    const skeletons = container.querySelectorAll('[class*="h-16"]')
    expect(skeletons.length).toBe(5)
  })

  it('renders empty state when no matching tokens', () => {
    render(
      <FilteredSignals
        activeFilter="nonexistent"
        setActiveFilter={() => {}}
        loading={false}
        filteredTokens={mockTokens}
      />
    )

    expect(screen.getByText('NO SIGNALS FOUND FOR THIS TAG')).toBeDefined()
  })

  it('does not render empty state when tokens match', () => {
    render(
      <FilteredSignals
        activeFilter="defi"
        setActiveFilter={() => {}}
        loading={false}
        filteredTokens={mockTokens}
      />
    )

    expect(screen.queryByText('NO SIGNALS FOUND FOR THIS TAG')).toBeNull()
  })

  it('is hidden when no active filter', () => {
    const { container } = render(
      <FilteredSignals
        activeFilter={null}
        setActiveFilter={() => {}}
        loading={false}
        filteredTokens={mockTokens}
      />
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.classList.contains('opacity-0')).toBe(true)
    expect(wrapper.classList.contains('pointer-events-none')).toBe(true)
  })
})

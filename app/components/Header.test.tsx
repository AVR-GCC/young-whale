import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from './Header'

vi.mock('./CustomTooltip', () => ({
  CustomTooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('lucide-react', () => ({
  Search: () => <svg data-testid="search-icon" />,
}))

describe('Header', () => {
  it('renders logo', () => {
    render(
      <Header
        secondsLeft={7200}
        isSearchOpen={false}
        setIsSearchOpen={() => {}}
        searchQuery=""
        setSearchQuery={() => {}}
        timeFilter="all"
        sortBy="default"
      />
    )
    expect(screen.getByText('YoungWhale.io')).toBeDefined()
  })

  it('renders countdown timer', () => {
    render(
      <Header
        secondsLeft={7200}
        isSearchOpen={false}
        setIsSearchOpen={() => {}}
        searchQuery=""
        setSearchQuery={() => {}}
        timeFilter="all"
        sortBy="default"
      />
    )
    // Timer appears twice (desktop + mobile) so use getAllByText
    const timers = screen.getAllByText('02:00:00')
    expect(timers.length).toBeGreaterThanOrEqual(1)
  })

  it('renders header tagline', () => {
    render(
      <Header
        secondsLeft={7200}
        isSearchOpen={false}
        setIsSearchOpen={() => {}}
        searchQuery=""
        setSearchQuery={() => {}}
        timeFilter="all"
        sortBy="default"
      />
    )
    expect(screen.getByText(/CRYPTO WHALES START HERE/)).toBeDefined()
  })

  it('renders search button', () => {
    render(
      <Header
        secondsLeft={7200}
        isSearchOpen={false}
        setIsSearchOpen={() => {}}
        searchQuery=""
        setSearchQuery={() => {}}
        timeFilter="all"
        sortBy="default"
      />
    )
    expect(screen.getByRole('button', { name: /toggle search/i })).toBeDefined()
  })

  it('toggles search input on click', () => {
    const setIsSearchOpen = vi.fn()
    const { rerender } = render(
      <Header
        secondsLeft={7200}
        isSearchOpen={false}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery=""
        setSearchQuery={() => {}}
        timeFilter="all"
        sortBy="default"
      />
    )

    // Search input should not be visible initially
    expect(screen.queryByPlaceholderText('SEARCH...')).toBeNull()
    
    // Click to open
    const searchButton = screen.getByRole('button', { name: /toggle search/i })
    fireEvent.click(searchButton)
    expect(setIsSearchOpen).toHaveBeenCalledWith(true)

    // Re-render with search open
    rerender(
      <Header
        secondsLeft={7200}
        isSearchOpen={true}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery=""
        setSearchQuery={() => {}}
        timeFilter="all"
        sortBy="default"
      />
    )

    expect(screen.getByPlaceholderText('SEARCH...')).toBeDefined()

    // Click to close
    fireEvent.click(searchButton)
    expect(setIsSearchOpen).toHaveBeenCalledWith(false)
  })

  it('renders search input with query', () => {
    const setSearchQuery = vi.fn()
    render(
      <Header
        secondsLeft={7200}
        isSearchOpen={true}
        setIsSearchOpen={() => {}}
        searchQuery="test"
        setSearchQuery={setSearchQuery}
        timeFilter="all"
        sortBy="default"
      />
    )

    const input = screen.getByPlaceholderText('SEARCH...') as HTMLInputElement
    expect(input.value).toBe('test')

    fireEvent.change(input, { target: { value: 'new query' } })
    expect(setSearchQuery).toHaveBeenCalledWith('new query')
  })

  it('renders time filter and sort dropdowns when search is open', () => {
    render(
      <Header
        secondsLeft={7200}
        isSearchOpen={true}
        setIsSearchOpen={() => {}}
        searchQuery=""
        setSearchQuery={() => {}}
        timeFilter="today"
        sortBy="hashtag"
      />
    )

    expect(screen.getByText('TIME: ALL')).toBeDefined()
    expect(screen.getByText('TODAY')).toBeDefined()
    expect(screen.getByText('1D AGO')).toBeDefined()
    expect(screen.getByText('SORT: DFLT')).toBeDefined()
    expect(screen.getByText('HASHTAG')).toBeDefined()
  })

  it('renders mobile timer', () => {
    render(
      <Header
        secondsLeft={3661}
        isSearchOpen={false}
        setIsSearchOpen={() => {}}
        searchQuery=""
        setSearchQuery={() => {}}
        timeFilter="all"
        sortBy="default"
      />
    )
    expect(screen.getByText('NEXT WAVE:')).toBeDefined()
    expect(screen.getAllByText('01:01:01').length).toBeGreaterThanOrEqual(1)
  })
})

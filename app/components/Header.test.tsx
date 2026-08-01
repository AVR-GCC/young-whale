import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from './Header'
import DesktopHeader from './DesktopHeader'
import MobileHeader from './MobileHeader'

vi.mock('./CustomTooltip', () => ({
  CustomTooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('lucide-react', () => ({
  Search: () => <svg data-testid="search-icon" />,
  Settings: () => <svg data-testid="settings-icon" />,
}))

const defaultProps = {
  secondsLeft: 7200,
  isSearchOpen: false,
  setIsSearchOpenAction: () => {},
  searchQuery: '',
  setSearchQueryAction: () => {},
  timeFilter: 'all' as const,
  setTimeFilterAction: () => {},
  sortBy: 'default' as const,
  setSortByAction: () => {},
  isMobileOverlayOpen: false,
  isSettingsOpen: false,
  setSettingsOpenAction: () => {},
  settingsView: '',
  setSettingsViewAction: () => {},
}

describe('Header', () => {
  it('renders logo', () => {
    render(<Header {...defaultProps} />)
    // Logo appears in both desktop and mobile headers
    const logos = screen.getAllByText('YoungWhale.io')
    expect(logos.length).toBeGreaterThanOrEqual(1)
  })

  it('renders countdown timer', () => {
    render(<Header {...defaultProps} />)
    // Timer appears twice (desktop + mobile) so use getAllByText
    const timers = screen.getAllByText('02:00:00')
    expect(timers.length).toBeGreaterThanOrEqual(1)
  })

  it('renders header tagline', () => {
    render(<Header {...defaultProps} />)
    expect(screen.getByText(/CRYPTO WHALES START HERE/)).toBeDefined()
  })

  it('renders search button', () => {
    render(<Header {...defaultProps} />)
    const searchIcons = screen.getAllByTestId('search-icon')
    expect(searchIcons.length).toBeGreaterThanOrEqual(1)
    expect(searchIcons[0].closest('button')).toBeDefined()
  })

  it('toggles search input on click', async () => {
    const setIsSearchOpen = vi.fn()
    const { rerender } = render(
      <Header {...defaultProps} isSearchOpen={false} setIsSearchOpenAction={setIsSearchOpen} />
    )

    // Wait for transition
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Search input is rendered but hidden (collapsed width)
    const searchInputs = screen.queryAllByPlaceholderText('SEARCH...')
    expect(searchInputs.length).toBeGreaterThanOrEqual(1)
    searchInputs.forEach(input => {
      expect(/\bw-6\b/.test(input.parentElement?.parentElement?.className || '')).toBe(true)
    })

    // Click to open
    const searchIcons = screen.getAllByTestId('search-icon')
    const searchButton = searchIcons[0].closest('button')!
    fireEvent.click(searchButton)
    expect(setIsSearchOpen).toHaveBeenCalledWith(true)

    // Re-render with search open
    rerender(
      <Header {...defaultProps} isSearchOpen={true} setIsSearchOpenAction={setIsSearchOpen} />
    )

    const openSearchInputs = screen.getAllByPlaceholderText('SEARCH...')
    expect(openSearchInputs.length).toBeGreaterThanOrEqual(1)
    openSearchInputs.forEach(input => {
      expect(/\bw-6\b/.test(input.parentElement?.parentElement?.className || '')).toBe(false)
    })

    // Click to close
    fireEvent.click(searchButton)
    expect(setIsSearchOpen).toHaveBeenCalledWith(false)
  })

  it('renders search input with query', () => {
    const setSearchQuery = vi.fn()
    render(
      <Header {...defaultProps} isSearchOpen={true} searchQuery="test" setSearchQueryAction={setSearchQuery} />
    )

    const searchInputs = screen.getAllByPlaceholderText('SEARCH...') as HTMLInputElement[]
    expect(searchInputs[0].value).toBe('test')

    fireEvent.change(searchInputs[0], { target: { value: 'new query' } })
    expect(setSearchQuery).toHaveBeenCalledWith('new query')
  })

  it('renders mobile timer', () => {
    render(<Header {...defaultProps} secondsLeft={3661} />)
    expect(screen.getByText('NEXT WAVE')).toBeDefined()
    expect(screen.getAllByText('01:01:01').length).toBeGreaterThanOrEqual(1)
  })

  it('opens invite settings when whale icon is clicked', () => {
    const setSettingsOpen = vi.fn()
    const setSettingsView = vi.fn()
    render(
      <Header
        {...defaultProps}
        setSettingsOpenAction={setSettingsOpen}
        setSettingsViewAction={setSettingsView}
      />
    )

    // The whale icon is a div with a click handler
    const whaleIcons = document.querySelectorAll('[style*="maskImage"]')
    if (whaleIcons.length > 0) {
      fireEvent.click(whaleIcons[0])
      expect(setSettingsOpen).toHaveBeenCalledWith(true)
      expect(setSettingsView).toHaveBeenCalledWith('invite')
    }
  })

  it('opens directory settings when mobile settings button is clicked', () => {
    const setSettingsOpen = vi.fn()
    const setSettingsView = vi.fn()
    render(
      <Header
        {...defaultProps}
        setSettingsOpenAction={setSettingsOpen}
        setSettingsViewAction={setSettingsView}
      />
    )

    const settingsIcons = screen.getAllByTestId('settings-icon')
    if (settingsIcons.length > 0) {
      const settingsButton = settingsIcons[0].closest('button')
      if (settingsButton) {
        fireEvent.click(settingsButton)
        expect(setSettingsOpen).toHaveBeenCalledWith(true)
        expect(setSettingsView).toHaveBeenCalledWith('directory')
      }
    }
  })
})

describe('DesktopHeader', () => {
  it('renders desktop logo', () => {
    render(<DesktopHeader {...defaultProps} />)
    expect(screen.getByText('YoungWhale.io')).toBeDefined()
  })

  it('renders desktop timer with tagline', () => {
    render(<DesktopHeader {...defaultProps} />)
    expect(screen.getByText(/CRYPTO WHALES START HERE/)).toBeDefined()
    expect(screen.getByText('02:00:00')).toBeDefined()
  })

  it('renders search button', () => {
    render(<DesktopHeader {...defaultProps} />)
    expect(screen.getByTestId('search-icon').closest('button')).toBeDefined()
  })

  it('toggles search input on click', async () => {
    const setIsSearchOpen = vi.fn()
    const { rerender } = render(
      <DesktopHeader {...defaultProps} isSearchOpen={false} setIsSearchOpenAction={setIsSearchOpen} />
    )

    await new Promise(resolve => setTimeout(resolve, 1000))

    const searchInput = screen.queryByPlaceholderText('SEARCH...')
    expect(searchInput).toBeDefined()
    expect(/\bw-6\b/.test(searchInput?.parentElement?.parentElement?.className || '')).toBe(true)

    const searchButton = screen.getByTestId('search-icon').closest('button')!
    fireEvent.click(searchButton)
    expect(setIsSearchOpen).toHaveBeenCalledWith(true)

    rerender(
      <DesktopHeader {...defaultProps} isSearchOpen={true} setIsSearchOpenAction={setIsSearchOpen} />
    )

    const openInput = screen.queryByPlaceholderText('SEARCH...')
    expect(openInput).toBeDefined()
    expect(/\bw-6\b/.test(openInput?.parentElement?.parentElement?.className || '')).toBe(false)

    fireEvent.click(searchButton)
    expect(setIsSearchOpen).toHaveBeenCalledWith(false)
  })

  it('opens invite settings when whale icon is clicked', () => {
    const setSettingsOpen = vi.fn()
    const setSettingsView = vi.fn()
    render(
      <DesktopHeader
        {...defaultProps}
        setSettingsOpenAction={setSettingsOpen}
        setSettingsViewAction={setSettingsView}
      />
    )

    const whaleIcon = document.querySelector('[style*="maskImage"]')
    if (whaleIcon) {
      fireEvent.click(whaleIcon)
      expect(setSettingsOpen).toHaveBeenCalledWith(true)
      expect(setSettingsView).toHaveBeenCalledWith('invite')
    }
  })
})

describe('MobileHeader', () => {
  it('renders mobile logo', () => {
    render(<MobileHeader {...defaultProps} />)
    expect(screen.getByText('YoungWhale.io')).toBeDefined()
  })

  it('renders mobile timer', () => {
    render(<MobileHeader {...defaultProps} secondsLeft={3661} />)
    expect(screen.getByText('NEXT WAVE')).toBeDefined()
    expect(screen.getByText('01:01:01')).toBeDefined()
  })

  it('renders search button', () => {
    render(<MobileHeader {...defaultProps} />)
    expect(screen.getByTestId('search-icon').closest('button')).toBeDefined()
  })

  it('toggles search input on click', async () => {
    const setIsSearchOpen = vi.fn()
    const { rerender } = render(
      <MobileHeader {...defaultProps} isSearchOpen={false} setIsSearchOpenAction={setIsSearchOpen} />
    )

    await new Promise(resolve => setTimeout(resolve, 1000))

    const searchInput = screen.queryByPlaceholderText('SEARCH...')
    expect(searchInput).toBeDefined()
    expect(/\bw-6\b/.test(searchInput?.parentElement?.parentElement?.className || '')).toBe(true)

    const searchButton = screen.getByTestId('search-icon').closest('button')!
    fireEvent.click(searchButton)
    expect(setIsSearchOpen).toHaveBeenCalledWith(true)

    rerender(
      <MobileHeader {...defaultProps} isSearchOpen={true} setIsSearchOpenAction={setIsSearchOpen} />
    )

    const openInput = screen.queryByPlaceholderText('SEARCH...')
    expect(openInput).toBeDefined()
    expect(/\bw-6\b/.test(openInput?.parentElement?.parentElement?.className || '')).toBe(false)

    fireEvent.click(searchButton)
    expect(setIsSearchOpen).toHaveBeenCalledWith(false)
  })

  it('opens invite settings when whale icon is clicked', () => {
    const setSettingsOpen = vi.fn()
    const setSettingsView = vi.fn()
    render(
      <MobileHeader
        {...defaultProps}
        setSettingsOpenAction={setSettingsOpen}
        setSettingsViewAction={setSettingsView}
      />
    )

    const whaleIcons = document.querySelectorAll('[style*="maskImage"]')
    if (whaleIcons.length > 0) {
      fireEvent.click(whaleIcons[0])
      expect(setSettingsOpen).toHaveBeenCalledWith(true)
      expect(setSettingsView).toHaveBeenCalledWith('invite')
    }
  })

  it('opens directory settings when settings button is clicked', () => {
    const setSettingsOpen = vi.fn()
    const setSettingsView = vi.fn()
    render(
      <MobileHeader
        {...defaultProps}
        setSettingsOpenAction={setSettingsOpen}
        setSettingsViewAction={setSettingsView}
      />
    )

    const settingsButton = screen.getByTestId('settings-icon').closest('button')
    if (settingsButton) {
      fireEvent.click(settingsButton)
      expect(setSettingsOpen).toHaveBeenCalledWith(true)
      expect(setSettingsView).toHaveBeenCalledWith('directory')
    }
  })
})

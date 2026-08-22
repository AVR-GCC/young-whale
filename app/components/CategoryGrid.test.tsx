import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import type { TokenWithHashtags, TokenCategory } from '@/shared/types'

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        data: [
          { id: 'Ethereum', icon: 'ethereum-eth-logo-diamond-purple.svg' },
          { id: 'Solana', icon: 'solana-sol-logo.svg' },
        ],
        error: null,
      })),
    })),
  },
}))

import CategoryGrid from './CategoryGrid'

vi.mock('./CategoryContainer', () => ({
  default: ({ category, tokenCount, tokens, onMobileTokenClick }: {
    category: { id: string; title: string };
    tokenCount: number;
    tokens: TokenWithHashtags[];
    onMobileTokenClick?: (tokenId: string, categoryId: string) => void;
  }) => (
    <div data-testid={`category-${category.id}`} data-layout={category.id}>
      <h3>{category.title}</h3>
      <span>{tokenCount} tokens</span>
      <div data-testid="token-list">
        {tokens.map((token: TokenWithHashtags) => (
          <button
            key={token.id}
            data-testid={`token-${token.id}`}
            onClick={() => onMobileTokenClick?.(token.id, category.id)}
          >
            {token.name}
          </button>
        ))}
      </div>
    </div>
  ),
}))

vi.mock('./TokenTerminal', () => ({
  default: ({ token }: { token: TokenWithHashtags }) => (
    <div data-testid="token-terminal">{token.name}</div>
  ),
}))

vi.mock('./MobileSettingsMenu', () => ({
  default: ({ view }: { view: string }) => (
    <div data-testid="mobile-settings-menu">Settings: {view}</div>
  ),
}))

vi.mock('./MobileCategoryFooter', () => ({
  default: ({ selectedCategory, selectCategory }: { selectedCategory: string; selectCategory: (category: string) => void }) => (
    <div data-testid="mobile-category-footer">
      {['Tech', 'Meme', 'RWA', 'Presale'].map((cat) => (
        <button
          key={cat}
          data-testid={`footer-category-${cat}`}
          data-active={selectedCategory === cat}
          onClick={() => selectCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  ),
}))

const createMockToken = (id: string, name: string, category: TokenCategory, createdAt: string): TokenWithHashtags => ({
  id,
  name,
  display_name: name,
  symbol: 'TT',
  chain: 'Ethereum',
  contract_address: null,
  slug: 'tt',
  category,
  short_description: `${name} description`,
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
  presale_status: null,
  main_hashtag: null,
  rating: 0,
  supply: 1000000,
  created_at: createdAt,
  updated_at: createdAt,
  published_at: null,
  hashtags: [],
})

const mockTokens: TokenWithHashtags[] = [
  createMockToken('1', 'TechToken1', 'Tech', '2024-06-10T10:00:00Z'),
  createMockToken('2', 'TechToken2', 'Tech', '2024-06-09T10:00:00Z'),
  createMockToken('3', 'TechToken3', 'Tech', '2024-06-08T10:00:00Z'),
  createMockToken('4', 'MemeToken1', 'Meme', '2024-06-10T10:00:00Z'),
  createMockToken('5', 'MemeToken2', 'Meme', '2024-06-09T10:00:00Z'),
  createMockToken('6', 'RWAToken1', 'RWA', '2024-06-10T10:00:00Z'),
  createMockToken('7', 'PresaleToken1', 'Presale', '2024-06-10T10:00:00Z'),
]

const getOverlay = () => screen.queryByTestId('mobile-overlay')

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
        setIsMobileOverlayOpen={() => {}}
        setSettingsOpenAction={() => {}}
        isSettingsOpen={false}
        setSettingsViewAction={() => {}}
        settingsView=""
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
        setIsMobileOverlayOpen={() => {}}
        setSettingsOpenAction={() => {}}
        isSettingsOpen={false}
        setSettingsViewAction={() => {}}
        settingsView=""
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
        setIsMobileOverlayOpen={() => {}}
        setSettingsOpenAction={() => {}}
        isSettingsOpen={false}
        setSettingsViewAction={() => {}}
        settingsView=""
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
        setIsMobileOverlayOpen={() => {}}
        setSettingsOpenAction={() => {}}
        isSettingsOpen={false}
        setSettingsViewAction={() => {}}
        settingsView=""
      />
    )

    // Tech has 3 tokens, Meme has 2, RWA has 1, Presale has 1
    // But rendered twice (desktop + mobile)
    expect(screen.getAllByText('3 tokens').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('2 tokens').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('1 tokens').length).toBeGreaterThanOrEqual(2)
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
        setIsMobileOverlayOpen={() => {}}
        setSettingsOpenAction={() => {}}
        isSettingsOpen={false}
        setSettingsViewAction={() => {}}
        settingsView=""
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
        setIsMobileOverlayOpen={() => {}}
        setSettingsOpenAction={() => {}}
        isSettingsOpen={false}
        setSettingsViewAction={() => {}}
        settingsView=""
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
        setIsMobileOverlayOpen={() => {}}
        setSettingsOpenAction={() => {}}
        isSettingsOpen={false}
        setSettingsViewAction={() => {}}
        settingsView=""
      />
    )

    // Each category should only have its own token
    const techCategories = screen.getAllByTestId('category-Tech')
    techCategories.forEach(cat => {
      expect(cat.textContent).toContain('TechToken1')
      expect(cat.textContent).not.toContain('MemeToken1')
    })
  })

  describe('mobile overlay', () => {
    it('opens TokenTerminal overlay when clicking a token on mobile', () => {
      render(
        <CategoryGrid
          tokens={mockTokens}
          loading={false}
          selectedToken={null}
          setSelectedToken={() => {}}
          activeFilter={null}
          sortBy="default"
          setIsMobileOverlayOpen={() => {}}
          setSettingsOpenAction={() => {}}
          isSettingsOpen={false}
          setSettingsViewAction={() => {}}
          settingsView=""
        />
      )

      // Click on a token in the mobile layout (Tech category is default)
      const tokenButton = screen.getAllByTestId('token-1')[0]
      fireEvent.click(tokenButton)

      // Overlay should show TokenTerminal with the clicked token
      const overlay = getOverlay()
      expect(overlay).toBeTruthy()
      expect(overlay?.textContent).toContain('TechToken1')
    })

    it('navigates to next token on swipe left', async () => {
      render(
        <CategoryGrid
          tokens={mockTokens}
          loading={false}
          selectedToken={null}
          setSelectedToken={() => {}}
          activeFilter={null}
          sortBy="default"
          setIsMobileOverlayOpen={() => {}}
          setSettingsOpenAction={() => {}}
          isSettingsOpen={false}
          setSettingsViewAction={() => {}}
          settingsView=""
        />
      )

      // Open overlay with first token
      const tokenButton = screen.getAllByTestId('token-1')[0]
      fireEvent.click(tokenButton)
      expect(getOverlay()?.textContent).toContain('TechToken1')

      // Swipe left (touch start at x=200, end at x=100 = distance 100 > 50)
      const overlay = getOverlay()
      if (!overlay) throw new Error('Overlay not found')

      fireEvent.touchStart(overlay, { targetTouches: [{ clientX: 200 }] })
      fireEvent.touchMove(overlay, { targetTouches: [{ clientX: 100 }] })
      fireEvent.touchEnd(overlay)

      // Should navigate to next token after transition
      await waitFor(() => {
        expect(getOverlay()?.textContent).toContain('TechToken2')
      }, { timeout: 300 })
    })

    it('navigates to previous token on swipe right', async () => {
      render(
        <CategoryGrid
          tokens={mockTokens}
          loading={false}
          selectedToken={null}
          setSelectedToken={() => {}}
          activeFilter={null}
          sortBy="default"
          setIsMobileOverlayOpen={() => {}}
          setSettingsOpenAction={() => {}}
          isSettingsOpen={false}
          setSettingsViewAction={() => {}}
          settingsView=""
        />
      )

      // Open overlay with second token (index 1)
      const tokenButton = screen.getAllByTestId('token-2')[0]
      fireEvent.click(tokenButton)
      expect(getOverlay()?.textContent).toContain('TechToken2')

      // Swipe right (touch start at x=100, end at x=200 = distance -100 < -50)
      const overlay = getOverlay()
      if (!overlay) throw new Error('Overlay not found')

      fireEvent.touchStart(overlay, { targetTouches: [{ clientX: 100 }] })
      fireEvent.touchMove(overlay, { targetTouches: [{ clientX: 200 }] })
      fireEvent.touchEnd(overlay)

      // Should navigate to previous token after transition
      await waitFor(() => {
        expect(getOverlay()?.textContent).toContain('TechToken1')
      }, { timeout: 300 })
    })

    it('does not navigate past last token on swipe left', async () => {
      render(
        <CategoryGrid
          tokens={mockTokens}
          loading={false}
          selectedToken={null}
          setSelectedToken={() => {}}
          activeFilter={null}
          sortBy="default"
          setIsMobileOverlayOpen={() => {}}
          setSettingsOpenAction={() => {}}
          isSettingsOpen={false}
          setSettingsViewAction={() => {}}
          settingsView=""
        />
      )

      // Open overlay with last Tech token (index 2, TechToken3)
      const tokenButton = screen.getAllByTestId('token-3')[0]
      fireEvent.click(tokenButton)
      expect(getOverlay()?.textContent).toContain('TechToken3')

      // Swipe left
      const overlay = getOverlay()
      if (!overlay) throw new Error('Overlay not found')

      fireEvent.touchStart(overlay, { targetTouches: [{ clientX: 200 }] })
      fireEvent.touchMove(overlay, { targetTouches: [{ clientX: 100 }] })
      fireEvent.touchEnd(overlay)

      // Should stay on TechToken3
      await waitFor(() => {
        expect(getOverlay()?.textContent).toContain('TechToken3')
      }, { timeout: 300 })
    })

    it('does not navigate past first token on swipe right', async () => {
      render(
        <CategoryGrid
          tokens={mockTokens}
          loading={false}
          selectedToken={null}
          setSelectedToken={() => {}}
          activeFilter={null}
          sortBy="default"
          setIsMobileOverlayOpen={() => {}}
          setSettingsOpenAction={() => {}}
          isSettingsOpen={false}
          setSettingsViewAction={() => {}}
          settingsView=""
        />
      )

      // Open overlay with first token
      const tokenButton = screen.getAllByTestId('token-1')[0]
      fireEvent.click(tokenButton)
      expect(getOverlay()?.textContent).toContain('TechToken1')

      // Swipe right
      const overlay = getOverlay()
      if (!overlay) throw new Error('Overlay not found')

      fireEvent.touchStart(overlay, { targetTouches: [{ clientX: 100 }] })
      fireEvent.touchMove(overlay, { targetTouches: [{ clientX: 200 }] })
      fireEvent.touchEnd(overlay)

      // Should stay on TechToken1
      await waitFor(() => {
        expect(getOverlay()?.textContent).toContain('TechToken1')
      }, { timeout: 300 })
    })

    it('closes overlay when switching categories', async () => {
      const setSettingsOpenAction = vi.fn()
      render(
        <CategoryGrid
          tokens={mockTokens}
          loading={false}
          selectedToken={null}
          setSelectedToken={() => {}}
          activeFilter={null}
          sortBy="default"
          setIsMobileOverlayOpen={() => {}}
          setSettingsOpenAction={setSettingsOpenAction}
          isSettingsOpen={false}
          setSettingsViewAction={() => {}}
          settingsView=""
        />
      )

      // Open overlay
      const tokenButton = screen.getAllByTestId('token-1')[0]
      fireEvent.click(tokenButton)
      expect(getOverlay()).toBeTruthy()

      // Switch category via mobile footer
      const memeButton = screen.getByTestId('footer-category-Meme')
      fireEvent.click(memeButton)

      // Overlay should close
      await waitFor(() => {
        expect(getOverlay()).toBeNull()
      })

      // Settings should also be closed
      await waitFor(() => {
        expect(setSettingsOpenAction).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('settings overlay', () => {
    it('renders MobileSettingsMenu when isSettingsOpen and settingsView are set', () => {
      render(
        <CategoryGrid
          tokens={mockTokens}
          loading={false}
          selectedToken={null}
          setSelectedToken={() => {}}
          activeFilter={null}
          sortBy="default"
          setIsMobileOverlayOpen={() => {}}
          setSettingsOpenAction={() => {}}
          isSettingsOpen={true}
          setSettingsViewAction={() => {}}
          settingsView="directory"
        />
      )

      const overlay = getOverlay()
      expect(overlay).toBeTruthy()
      expect(screen.getByTestId('mobile-settings-menu')).toBeDefined()
    })

    it('does not render settings overlay when isSettingsOpen is false', () => {
      render(
        <CategoryGrid
          tokens={mockTokens}
          loading={false}
          selectedToken={null}
          setSelectedToken={() => {}}
          activeFilter={null}
          sortBy="default"
          setIsMobileOverlayOpen={() => {}}
          setSettingsOpenAction={() => {}}
          isSettingsOpen={false}
          setSettingsViewAction={() => {}}
          settingsView="directory"
        />
      )

      const overlays = screen.queryAllByTestId('mobile-overlay')
      // Should only have token overlays, not settings overlay
      expect(overlays.length).toBe(0)
    })

    it('does not render settings overlay when settingsView is empty', () => {
      render(
        <CategoryGrid
          tokens={mockTokens}
          loading={false}
          selectedToken={null}
          setSelectedToken={() => {}}
          activeFilter={null}
          sortBy="default"
          setIsMobileOverlayOpen={() => {}}
          setSettingsOpenAction={() => {}}
          isSettingsOpen={true}
          setSettingsViewAction={() => {}}
          settingsView=""
        />
      )

      const overlays = screen.queryAllByTestId('mobile-overlay')
      expect(overlays.length).toBe(0)
    })
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react'
import type { ReactNode } from 'react'
import type { TokenCategory } from '@/shared/types'

type PostgresChangesCallback = (payload: unknown) => void
type MockToken = { id: string; name: string; is_promoted?: boolean }

const { subscribeMock, removeChannelMock } = vi.hoisted(() => ({
  subscribeMock: vi.fn(),
  removeChannelMock: vi.fn(),
}))

let postgresChangesCallback: PostgresChangesCallback | null = null

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    channel: () => ({
      on: (_event: string, _filter: unknown, callback: PostgresChangesCallback) => {
        postgresChangesCallback = callback
        return {
          subscribe: subscribeMock,
        }
      },
    }),
    removeChannel: removeChannelMock,
  },
}))

vi.mock('./HomePage', () => ({
  default: ({
    tokens,
    loading,
    newTokenIds,
    onLoadMore,
  }: {
    tokens: MockToken[]
    loading: boolean
    newTokenIds?: ReadonlySet<string>
    onLoadMore?: (category: TokenCategory) => Promise<boolean>
  }) => (
    <div>
      <div>{loading ? 'Loading' : `Tokens: ${tokens.length}`}</div>
      <div data-testid="new-token-ids">
        {newTokenIds && newTokenIds.size > 0 ? [...newTokenIds].join(',') : 'none'}
      </div>
      <button onClick={() => void onLoadMore?.('Tech')}>Load more Tech</button>
      {tokens.map((token) => (
        <div
          key={token.id}
          data-testid={`token-${token.id}`}
          data-promoted={String(Boolean(token.is_promoted))}
        >
          {token.name}
        </div>
      ))}
    </div>
  ) as ReactNode,
}))

import HomePageClient from './HomePageClient'

describe('HomePageClient', () => {
  const fetchMock = vi.fn()

  function createFetchResponse(tokens: (string | MockToken)[], extra: Record<string, unknown> = {}) {
    return {
      ok: true,
      json: () => Promise.resolve({
        tokens: tokens.map((token) => typeof token === 'string' ? { id: token, name: token } : token),
        ...extra,
      }),
    }
  }

  function mockFetchResponse(names: string[]) {
    fetchMock.mockResolvedValue(createFetchResponse(names))
  }

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    postgresChangesCallback = null
    fetchMock.mockReset()
    subscribeMock.mockReset()
    removeChannelMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('fetches and renders tokens on mount', async () => {
    mockFetchResponse(['Foo Coin', 'Bar Coin'])

    render(<HomePageClient />)

    await waitFor(() => {
      expect(screen.getByText('Tokens: 2')).toBeDefined()
    })
    expect(screen.getByText('Foo Coin')).toBeDefined()
    expect(screen.getByText('Bar Coin')).toBeDefined()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('does not celebrate on the initial load', async () => {
    mockFetchResponse(['Foo Coin'])

    render(<HomePageClient />)

    await waitFor(() => {
      expect(screen.getByText('Tokens: 1')).toBeDefined()
    })
    expect(screen.queryByText(/SURFACED/)).toBeNull()
    expect(screen.getByTestId('new-token-ids').textContent).toBe('none')
  })

  it('refetches tokens when a tokens realtime change arrives', async () => {
    mockFetchResponse(['Old Coin'])

    render(<HomePageClient />)

    await waitFor(() => {
      expect(screen.getByText('Tokens: 1')).toBeDefined()
    })
    expect(postgresChangesCallback).not.toBeNull()

    mockFetchResponse(['Old Coin', 'New Coin'])
    postgresChangesCallback!({})

    await vi.advanceTimersByTimeAsync(1000)

    await waitFor(() => {
      expect(screen.getByText('Tokens: 2')).toBeDefined()
    })
    expect(screen.getAllByText('New Coin').length).toBeGreaterThan(0)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('reconciles promotion and unpromotion during realtime refreshes', async () => {
    const promotedToken = { id: 'promoted', name: 'Promoted Coin', is_promoted: true }
    fetchMock.mockResolvedValueOnce(createFetchResponse([promotedToken]))

    render(<HomePageClient />)

    await waitFor(() => {
      expect(screen.getByTestId('token-promoted').getAttribute('data-promoted')).toBe('true')
    })

    fetchMock.mockResolvedValueOnce(createFetchResponse([]))
    postgresChangesCallback!({})
    await vi.advanceTimersByTimeAsync(1000)

    await waitFor(() => {
      expect(screen.getByTestId('token-promoted').getAttribute('data-promoted')).toBe('false')
    })

    fetchMock.mockResolvedValueOnce(createFetchResponse([promotedToken]))
    postgresChangesCallback!({})
    await vi.advanceTimersByTimeAsync(1000)

    await waitFor(() => {
      expect(screen.getByTestId('token-promoted').getAttribute('data-promoted')).toBe('true')
    })
  })

  it('loads older category pages and preserves them during realtime refreshes', async () => {
    fetchMock.mockResolvedValueOnce(createFetchResponse(['Old Coin'], {
      nextCursors: { Tech: 'cursor-1' },
    }))

    render(<HomePageClient />)

    await waitFor(() => {
      expect(screen.getByText('Tokens: 1')).toBeDefined()
    })

    fetchMock.mockResolvedValueOnce(createFetchResponse(['Older Coin'], { nextCursor: 'cursor-2' }))
    fireEvent.click(screen.getByText('Load more Tech'))

    await waitFor(() => {
      expect(screen.getByText('Tokens: 2')).toBeDefined()
    })
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/tokens/public?category=Tech&cursor=cursor-1&limit=50'
    )
    expect(screen.queryByText(/SURFACED/)).toBeNull()

    fetchMock.mockResolvedValueOnce(createFetchResponse(['Old Coin', 'New Coin'], {
      nextCursors: { Tech: 'refreshed-cursor' },
    }))
    postgresChangesCallback!({})
    await vi.advanceTimersByTimeAsync(1000)

    await waitFor(() => {
      expect(screen.getByText('Tokens: 3')).toBeDefined()
    })
    expect(screen.getByText('Older Coin')).toBeDefined()
    expect(screen.getAllByText('New Coin').length).toBeGreaterThan(0)
  })

  it('celebrates with a whale splash and highlights only newly appeared tokens', async () => {
    mockFetchResponse(['Old Coin'])

    render(<HomePageClient />)

    await waitFor(() => {
      expect(screen.getByText('Tokens: 1')).toBeDefined()
    })

    mockFetchResponse(['Old Coin', 'New Coin', 'Newer Coin'])
    postgresChangesCallback!({})

    await vi.advanceTimersByTimeAsync(1000)

    await waitFor(() => {
      expect(screen.getByText('2 NEW TOKENS SURFACED')).toBeDefined()
    })
    expect(screen.getByTestId('new-token-ids').textContent).toBe('New Coin,Newer Coin')
  })

  it('hides the splash after ~4s and clears the highlight after 30s', async () => {
    mockFetchResponse(['Old Coin'])

    render(<HomePageClient />)

    await waitFor(() => {
      expect(screen.getByText('Tokens: 1')).toBeDefined()
    })

    mockFetchResponse(['Old Coin', 'New Coin'])
    postgresChangesCallback!({})

    await vi.advanceTimersByTimeAsync(1000)

    await waitFor(() => {
      expect(screen.getByText('1 NEW TOKEN SURFACED')).toBeDefined()
    })

    await vi.advanceTimersByTimeAsync(4200)
    await waitFor(() => {
      expect(screen.queryByText(/SURFACED/)).toBeNull()
    })
    expect(screen.getByTestId('new-token-ids').textContent).toBe('New Coin')

    await vi.advanceTimersByTimeAsync(30_000)
    await waitFor(() => {
      expect(screen.getByTestId('new-token-ids').textContent).toBe('none')
    })
  })

  it('does not celebrate when a realtime change adds no new tokens', async () => {
    mockFetchResponse(['Old Coin'])

    render(<HomePageClient />)

    await waitFor(() => {
      expect(screen.getByText('Tokens: 1')).toBeDefined()
    })

    mockFetchResponse(['Old Coin'])
    postgresChangesCallback!({})

    await vi.advanceTimersByTimeAsync(1000)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })
    expect(screen.queryByText(/SURFACED/)).toBeNull()
    expect(screen.getByTestId('new-token-ids').textContent).toBe('none')
  })

  it('debounces multiple realtime changes into a single refetch', async () => {
    mockFetchResponse(['Old Coin'])

    render(<HomePageClient />)

    await waitFor(() => {
      expect(screen.getByText('Tokens: 1')).toBeDefined()
    })

    postgresChangesCallback!({})
    postgresChangesCallback!({})
    postgresChangesCallback!({})

    await vi.advanceTimersByTimeAsync(1000)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })
  })

  it('unsubscribes from the realtime channel on unmount', async () => {
    mockFetchResponse(['Foo Coin'])

    const { unmount } = render(<HomePageClient />)

    await waitFor(() => {
      expect(screen.getByText('Tokens: 1')).toBeDefined()
    })

    unmount()

    expect(removeChannelMock).toHaveBeenCalledTimes(1)
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import type { ReactNode } from 'react'

type PostgresChangesCallback = (payload: unknown) => void

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
  }: {
    tokens: { id: string; name: string }[]
    loading: boolean
    newTokenIds?: ReadonlySet<string>
  }) => (
    <div>
      <div>{loading ? 'Loading' : `Tokens: ${tokens.length}`}</div>
      <div data-testid="new-token-ids">
        {newTokenIds && newTokenIds.size > 0 ? [...newTokenIds].join(',') : 'none'}
      </div>
      {tokens.map((token) => (
        <div key={token.id}>{token.name}</div>
      ))}
    </div>
  ) as ReactNode,
}))

import HomePageClient from './HomePageClient'

describe('HomePageClient', () => {
  const fetchMock = vi.fn()

  function mockFetchResponse(names: string[]) {
    fetchMock.mockResolvedValue({
      json: () =>
        Promise.resolve({
          tokens: names.map((name) => ({ id: name, name })),
        }),
    })
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

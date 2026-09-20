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
  default: ({ tokens, loading }: { tokens: unknown[]; loading: boolean }) => (
    <div>
      <div>{loading ? 'Loading' : `Tokens: ${tokens.length}`}</div>
      {tokens.map((token, i) => (
        <div key={i}>{String((token as { name: string }).name)}</div>
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
          tokens: names.map((name) => ({ name })),
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
    expect(screen.getByText('New Coin')).toBeDefined()
    expect(fetchMock).toHaveBeenCalledTimes(2)
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

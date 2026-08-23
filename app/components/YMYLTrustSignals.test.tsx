import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { YMYLTrustSignals } from './YMYLTrustSignals'

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        not: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              single: vi.fn(() =>
                Promise.resolve({
                  data: { published_at: '2024-01-15T14:30:00Z' },
                  error: null,
                })
              ),
            })),
          })),
        })),
      })),
    })),
  },
}))

describe('YMYLTrustSignals', () => {
  it('renders last updated timestamp', async () => {
    render(await YMYLTrustSignals())
    expect(screen.getByText(/LAST UPDATED:/)).toBeDefined()
    expect(screen.getByText(/Jan 15, 2024/)).toBeDefined()
  })

  it('renders data source attribution', async () => {
    render(await YMYLTrustSignals())
    expect(screen.getByText(/DATA: CoinMarketCap \/ CoinRanking \/ On-Chain/)).toBeDefined()
  })

  it('renders financial disclaimer', async () => {
    render(await YMYLTrustSignals())
    expect(
      screen.getByText(/Not financial advice\. Cryptocurrency assets involve high risk\./)
    ).toBeDefined()
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { YMYLTrustSignals } from './YMYLTrustSignals'

describe('YMYLTrustSignals', () => {
  const mockDate = new Date('2024-01-15T14:30:00Z')

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders last updated timestamp', () => {
    render(<YMYLTrustSignals />)
    expect(screen.getByText(/LAST UPDATED:/)).toBeDefined()
    expect(screen.getByText(/Jan 15, 2024/)).toBeDefined()
  })

  it('renders data source attribution', () => {
    render(<YMYLTrustSignals />)
    expect(screen.getByText(/DATA: CoinMarketCap \/ On-Chain/)).toBeDefined()
  })

  it('renders financial disclaimer', () => {
    render(<YMYLTrustSignals />)
    expect(
      screen.getByText(/Not financial advice\. Cryptocurrency assets involve high risk\./)
    ).toBeDefined()
  })
})

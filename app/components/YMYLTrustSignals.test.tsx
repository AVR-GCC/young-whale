import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { YMYLTrustSignals } from './YMYLTrustSignals'
import { YMYLTrustSignalsServer } from './YMYLTrustSignalsServer'

vi.mock('@/lib/sitemap-utils', () => ({
  getLastPublishedAt: vi.fn(() => Promise.resolve(new Date('2024-01-15T14:30:00Z'))),
}))

describe('YMYLTrustSignals', () => {
  it('renders last updated timestamp', () => {
    render(<YMYLTrustSignals lastPublishedAt={new Date('2024-01-15T14:30:00Z')} />)
    expect(screen.getByText(/LAST UPDATED:/)).toBeDefined()
    expect(screen.getByText(/Jan 15, 2024/)).toBeDefined()
  })

  it('renders em dash when no timestamp', () => {
    render(<YMYLTrustSignals lastPublishedAt={null} />)
    expect(screen.getByText(/LAST UPDATED: —/)).toBeDefined()
  })

  it('renders data source attribution', () => {
    render(<YMYLTrustSignals lastPublishedAt={null} />)
    expect(screen.getByText(/DATA: On-Chain & Public Web/)).toBeDefined()
  })

  it('renders financial disclaimer', () => {
    render(<YMYLTrustSignals lastPublishedAt={null} />)
    expect(
      screen.getByText(/Not financial advice\. Cryptocurrency assets involve high risk\./)
    ).toBeDefined()
  })
})

describe('YMYLTrustSignalsServer', () => {
  it('fetches last published date and renders it', async () => {
    render(await YMYLTrustSignalsServer())
    expect(screen.getByText(/LAST UPDATED:/)).toBeDefined()
    expect(screen.getByText(/Jan 15, 2024/)).toBeDefined()
  })

  it('renders em dash when last published date is null', async () => {
    const { getLastPublishedAt } = await import('@/lib/sitemap-utils')
    vi.mocked(getLastPublishedAt).mockResolvedValueOnce(null)
    render(await YMYLTrustSignalsServer())
    expect(screen.getByText(/LAST UPDATED: —/)).toBeDefined()
  })
})

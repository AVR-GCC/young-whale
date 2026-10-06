import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MascotTopBar, { MASCOT_CONTRACT_ADDRESS } from './MascotTopBar'

vi.mock('lucide-react', () => ({
  ArrowUpRight: () => <svg data-testid="arrow-up-right-icon" />,
  Copy: () => <svg data-testid="copy-icon" />,
}))

describe('MascotTopBar', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the official contract address label', () => {
    render(<MascotTopBar />)
    expect(screen.getByText('Official Contract Address')).toBeDefined()
  })

  it('renders the mascot announcement text', () => {
    render(<MascotTopBar />)
    expect(screen.getByText(/The YoungWhale mascot/)).toBeDefined()
    expect(screen.getByText(/lives on Robinhood:/)).toBeDefined()
  })

  it('renders the truncated contract address with a Robinhood explorer link', () => {
    render(<MascotTopBar />)
    const truncated = `${MASCOT_CONTRACT_ADDRESS.slice(0, 6)}...${MASCOT_CONTRACT_ADDRESS.slice(-4)}`
    const link = screen.getByText(truncated).closest('a')
    expect(link).toBeDefined()
    expect(link?.getAttribute('href')).toBe(`https://robin.etherscan.io/tx/${MASCOT_CONTRACT_ADDRESS}`)
    expect(link?.getAttribute('target')).toBe('_blank')
    expect(link?.getAttribute('rel')).toContain('noopener')
  })

  it('copies the full contract address to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })

    render(<MascotTopBar />)
    fireEvent.click(screen.getByRole('button', { name: /copy contract address/i }))

    expect(writeText).toHaveBeenCalledWith(MASCOT_CONTRACT_ADDRESS)
    await waitFor(() => expect(screen.getByText('Copied')).toBeDefined())
  })
})

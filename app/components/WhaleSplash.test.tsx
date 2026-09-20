import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WhaleSplash from './WhaleSplash'

describe('WhaleSplash', () => {
  it('announces a single new token with singular wording', () => {
    render(<WhaleSplash count={1} />)
    expect(screen.getByText('1 NEW TOKEN SURFACED')).toBeDefined()
  })

  it('announces multiple new tokens with plural wording', () => {
    render(<WhaleSplash count={3} />)
    expect(screen.getByText('3 NEW TOKENS SURFACED')).toBeDefined()
  })

  it('shows the whale and is hidden from assistive technology', () => {
    const { container } = render(<WhaleSplash count={2} />)
    expect(screen.getByText('🐋')).toBeDefined()
    const overlay = container.firstChild as HTMLElement
    expect(overlay.getAttribute('aria-hidden')).toBe('true')
    expect(overlay.className).toContain('pointer-events-none')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeaderBanner from './HeaderBanner'

describe('HeaderBanner', () => {
  it('renders the Young Whale title', () => {
    render(<HeaderBanner />)
    expect(screen.getByText('Young Whale')).toBeDefined()
  })

  it('renders in a header element', () => {
    render(<HeaderBanner />)
    const header = screen.getByRole('banner')
    expect(header).toBeDefined()
  })

  it('has correct heading level', () => {
    render(<HeaderBanner />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeDefined()
    expect(heading.textContent).toBe('Young Whale')
  })
})

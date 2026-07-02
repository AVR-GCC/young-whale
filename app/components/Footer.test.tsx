import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('renders brand sign-off', () => {
    render(<Footer />)
    expect(screen.getByText(/SONAR RADAR ACTIVE/)).toBeDefined()
    expect(screen.getByAltText('logo')).toBeDefined()
  })

  it('renders footer links', () => {
    render(<Footer />)
    expect(screen.getByText('[ SUBMIT TOKEN ]')).toBeDefined()
    expect(screen.getByText('[ ADVERTISE ]')).toBeDefined()
    expect(screen.getByText('[ T&C ]')).toBeDefined()
    expect(screen.getByText('[ PRIVACY ]')).toBeDefined()
  })

  it('renders social link', () => {
    render(<Footer />)
    expect(screen.getByLabelText('X (Twitter)')).toBeDefined()
  })

  it('renders disclaimer', () => {
    render(<Footer />)
    expect(screen.getByText(/All data provided on youngwhale.io is for informational purposes/)).toBeDefined()
  })

  it('renders footer element', () => {
    const { container } = render(<Footer />)
    expect(container.querySelector('footer')).toBeDefined()
  })
})

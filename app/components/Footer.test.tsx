import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

const mockProps = {
  playAudioFeedback: () => {},
  openSubmitModal: () => {},
  setIsContactModalOpen: () => {},
  setLegalModalTab: () => {},
}

describe('Footer', () => {
  it('renders brand sign-off', () => {
    render(<Footer {...mockProps} />)
    expect(screen.getByText(/SONAR RADAR ACTIVE/)).toBeDefined()
    expect(screen.getByAltText('logo')).toBeDefined()
  })

  it('renders footer links', () => {
    render(<Footer {...mockProps} />)
    expect(screen.getByText('[ SUBMIT TOKEN ]')).toBeDefined()
    expect(screen.getByText('[ CONTACT ]')).toBeDefined()
    expect(screen.getByText('[ T&C ]')).toBeDefined()
    expect(screen.getByText('[ LEGAL DISCLAIMER ]')).toBeDefined()
    expect(screen.getByText('[ PRIVACY ]')).toBeDefined()
  })

  it('renders social link', () => {
    render(<Footer {...mockProps} />)
    expect(screen.getByLabelText('X (Twitter)')).toBeDefined()
  })

  it('renders disclaimer', () => {
    render(<Footer {...mockProps} />)
    expect(screen.getByText(/All data provided on youngwhale.io is for informational purposes/)).toBeDefined()
  })

  it('renders footer element', () => {
    const { container } = render(<Footer {...mockProps} />)
    expect(container.querySelector('footer')).toBeDefined()
  })
})

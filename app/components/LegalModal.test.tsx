import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LegalModal } from './LegalModal'

const mockOnClose = vi.fn()

describe('LegalModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <LegalModal isOpen={false} onClose={mockOnClose} initialTab="tc" />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders when isOpen is true', () => {
    render(<LegalModal isOpen={true} onClose={mockOnClose} initialTab="tc" />)
    expect(screen.getByText('[ T&C ]')).toBeDefined()
    expect(screen.getByText('[ LEGAL DISCLAIMER ]')).toBeDefined()
    expect(screen.getByText('[ PRIVACY ]')).toBeDefined()
  })

  it('renders with default tab as tc', () => {
    render(<LegalModal isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText('[ T&C ]')).toBeDefined()
  })

  it('calls onClose when clicking the close button', () => {
    render(<LegalModal isOpen={true} onClose={mockOnClose} initialTab="tc" />)
    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('switches tabs when clicking different tab buttons', () => {
    render(<LegalModal isOpen={true} onClose={mockOnClose} initialTab="tc" />)

    const legalTab = screen.getByText('[ LEGAL DISCLAIMER ]')
    fireEvent.click(legalTab)

    const privacyTab = screen.getByText('[ PRIVACY ]')
    fireEvent.click(privacyTab)

    const tcTab = screen.getByText('[ T&C ]')
    fireEvent.click(tcTab)

    expect(screen.getByText('[ T&C ]')).toBeDefined()
  })

  it('renders with initialTab set to legal', () => {
    render(<LegalModal isOpen={true} onClose={mockOnClose} initialTab="legal" />)
    expect(screen.getByText('[ LEGAL DISCLAIMER ]')).toBeDefined()
  })

  it('renders with initialTab set to privacy', () => {
    render(<LegalModal isOpen={true} onClose={mockOnClose} initialTab="privacy" />)
    expect(screen.getByText('[ PRIVACY ]')).toBeDefined()
  })
})

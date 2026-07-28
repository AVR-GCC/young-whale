import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContactForm, ContactFormModal } from './ContactForm'

const mockFetch = vi.fn()
const mockOnClose = vi.fn()

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = mockFetch
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Message sent successfully', id: 'msg-1' }),
    })
  })

  it('renders all form inputs and submit button', () => {
    render(<ContactForm onClose={mockOnClose} />)
    expect(screen.getByPlaceholderText('[ Enter Name ]')).toBeDefined()
    expect(screen.getByPlaceholderText('[ Enter Email ]')).toBeDefined()
    expect(screen.getByPlaceholderText('[ Enter Message ]')).toBeDefined()
    expect(screen.getByRole('button', { name: /> EXECUTE_MESSAGE/i })).toBeDefined()
  })

  it('shows header by default', () => {
    render(<ContactForm onClose={mockOnClose} />)
    expect(screen.getByText('[CONTACT US]')).toBeDefined()
  })

  it('hides header when hideHeader is true', () => {
    render(<ContactForm onClose={mockOnClose} hideHeader />)
    expect(screen.queryByText('[CONTACT US]')).toBeNull()
  })

  it('updates form data on input change', () => {
    render(<ContactForm onClose={mockOnClose} />)
    const nameInput = screen.getByPlaceholderText('[ Enter Name ]') as HTMLInputElement
    const emailInput = screen.getByPlaceholderText('[ Enter Email ]') as HTMLInputElement
    const messageInput = screen.getByPlaceholderText('[ Enter Message ]') as HTMLTextAreaElement

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(messageInput, { target: { value: 'Hello world' } })

    expect(nameInput.value).toBe('John Doe')
    expect(emailInput.value).toBe('john@example.com')
    expect(messageInput.value).toBe('Hello world')
  })

  it('submits form with correct data', async () => {
    render(<ContactForm onClose={mockOnClose} />)
    const nameInput = screen.getByPlaceholderText('[ Enter Name ]')
    const emailInput = screen.getByPlaceholderText('[ Enter Email ]')
    const messageInput = screen.getByPlaceholderText('[ Enter Message ]')
    const button = screen.getByRole('button', { name: /> EXECUTE_MESSAGE/i })

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(messageInput, { target: { value: 'Hello world' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          content: 'Hello world',
        }),
      })
    })
  })

  it('shows submitting state during submission', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}))

    render(<ContactForm onClose={mockOnClose} />)
    const nameInput = screen.getByPlaceholderText('[ Enter Name ]')
    const emailInput = screen.getByPlaceholderText('[ Enter Email ]')
    const messageInput = screen.getByPlaceholderText('[ Enter Message ]')
    const button = screen.getByRole('button', { name: /> EXECUTE_MESSAGE/i })

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(messageInput, { target: { value: 'Hello world' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('EXECUTING...')).toBeDefined()
    })
  })

  it('shows success message after submission', async () => {
    render(<ContactForm onClose={mockOnClose} />)
    const nameInput = screen.getByPlaceholderText('[ Enter Name ]')
    const emailInput = screen.getByPlaceholderText('[ Enter Email ]')
    const messageInput = screen.getByPlaceholderText('[ Enter Message ]')
    const button = screen.getByRole('button', { name: /> EXECUTE_MESSAGE/i })

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(messageInput, { target: { value: 'Hello world' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/TRANSMITTED ✓/i)).toBeDefined()
    })
  })

  it('handles API errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    render(<ContactForm onClose={mockOnClose} />)
    const nameInput = screen.getByPlaceholderText('[ Enter Name ]')
    const emailInput = screen.getByPlaceholderText('[ Enter Email ]')
    const messageInput = screen.getByPlaceholderText('[ Enter Message ]')
    const button = screen.getByRole('button', { name: /> EXECUTE_MESSAGE/i })

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(messageInput, { target: { value: 'Hello world' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /> EXECUTE_MESSAGE/i })).toBeDefined()
    })
  })
})

describe('ContactFormModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ContactFormModal isOpen={false} onClose={mockOnClose} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders when isOpen is true', () => {
    render(<ContactFormModal isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText('[CONTACT US]')).toBeDefined()
    expect(screen.getByPlaceholderText('[ Enter Name ]')).toBeDefined()
    expect(screen.getByPlaceholderText('[ Enter Email ]')).toBeDefined()
    expect(screen.getByPlaceholderText('[ Enter Message ]')).toBeDefined()
  })

  it('calls onClose when clicking the close button', () => {
    render(<ContactFormModal isOpen={true} onClose={mockOnClose} />)
    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('renders ContactForm without header inside modal', () => {
    render(<ContactFormModal isOpen={true} onClose={mockOnClose} />)
    // The modal header should be present
    expect(screen.getByText('[CONTACT US]')).toBeDefined()
    // But the ContactForm header should not be present (hideHeader is true)
    expect(screen.queryAllByText('[CONTACT US]')).toHaveLength(1)
  })
})

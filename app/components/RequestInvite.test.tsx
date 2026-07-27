import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RequestInvite } from './RequestInvite'

const mockFetch = vi.fn()

describe('RequestInvite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = mockFetch
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Subscribed successfully' }),
    })
  })

  it('renders email input and submit button', () => {
    render(<RequestInvite onClose={() => {}} />)
    expect(screen.getByRole('textbox')).toBeDefined()
    expect(screen.getByRole('button', { name: /request_invite/i })).toBeDefined()
  })

  it('shows header by default', () => {
    render(<RequestInvite onClose={() => {}} />)
    expect(screen.getByText(/request invite/i)).toBeDefined()
  })

  it('hides header when hideHeader is true', () => {
    render(<RequestInvite onClose={() => {}} hideHeader />)
    expect(screen.queryByText(/request invite/i)).toBeNull()
  })

  it('disables button when email is invalid', () => {
    render(<RequestInvite onClose={() => {}} />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request_invite/i }) as HTMLButtonElement

    fireEvent.change(input, { target: { value: 'invalid-email' } })
    expect(button.disabled).toBe(true)
  })

  it('disables button when email is empty', () => {
    render(<RequestInvite onClose={() => {}} />)
    const button = screen.getByRole('button', { name: /request_invite/i }) as HTMLButtonElement

    expect(button.disabled).toBe(true)
  })

  it('enables button when email is valid', () => {
    render(<RequestInvite onClose={() => {}} />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request_invite/i }) as HTMLButtonElement

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    expect(button.disabled).toBe(false)
  })

  it('shows error when submitting invalid email via form', () => {
    render(<RequestInvite onClose={() => {}} />)
    const form = document.querySelector('form')
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'invalid-email' } })
    if (form) {
      fireEvent.submit(form)
    }

    expect(screen.getByText('Invalid email — try again.')).toBeDefined()
  })

  it('clears error when user starts typing after error', () => {
    render(<RequestInvite onClose={() => {}} />)
    const form = document.querySelector('form')
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'invalid' } })
    if (form) {
      fireEvent.submit(form)
    }
    expect(screen.getByText('Invalid email — try again.')).toBeDefined()

    fireEvent.change(input, { target: { value: 'valid@example.com' } })
    expect(screen.queryByText('Invalid email — try again.')).toBeNull()
  })

  it('calls fetch with email on valid submit', async () => {
    render(<RequestInvite onClose={() => {}} />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request_invite/i })

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    })
  })

  it('shows processing state during submission', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}))

    render(<RequestInvite onClose={() => {}} />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request_invite/i })

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('EXECUTING...')).toBeDefined()
    })
  })

  it('disables input and button during processing', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}))

    render(<RequestInvite onClose={() => {}} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    const button = screen.getByRole('button', { name: /request_invite/i }) as HTMLButtonElement

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(input.disabled).toBe(true)
      expect(button.disabled).toBe(true)
    })
  })

  it('shows success message after successful submission', async () => {
    render(<RequestInvite onClose={() => {}} />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request_invite/i })

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/request logged/i)).toBeDefined()
      expect(screen.getByText(/you're on the waiting list/i)).toBeDefined()
    })
  })

  it('shows error when API call fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Server error' }),
    })

    render(<RequestInvite onClose={() => {}} />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request_invite/i })

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Invalid email — try again.')).toBeDefined()
    })
  })

  it('hides form after successful submission', async () => {
    render(<RequestInvite onClose={() => {}} />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request_invite/i })

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).toBeNull()
      expect(screen.queryByRole('button', { name: /request_invite/i })).toBeNull()
    })
  })

  it('accepts email with plus sign', async () => {
    render(<RequestInvite onClose={() => {}} />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request_invite/i })

    fireEvent.change(input, { target: { value: 'test+tag@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test+tag@example.com' }),
      })
    })
  })

  it('accepts email with subdomain', async () => {
    render(<RequestInvite onClose={() => {}} />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request_invite/i })

    fireEvent.change(input, { target: { value: 'test@mail.example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@mail.example.com' }),
      })
    })
  })
})

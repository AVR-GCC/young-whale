import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SubscriptionTerminal } from './SubscriptionTerminal'

const mockInsert = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: mockInsert,
    })),
  },
}))

describe('SubscriptionTerminal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockInsert.mockResolvedValue({ error: null })
  })

  it('renders the terminal with title', () => {
    render(<SubscriptionTerminal />)
    expect(screen.getByText('YOUNG WHALE CLUB')).toBeDefined()
  })

  it('renders email input and submit button', () => {
    render(<SubscriptionTerminal />)
    expect(screen.getByRole('textbox')).toBeDefined()
    expect(screen.getByRole('button', { name: /request invite/i })).toBeDefined()
  })

  it('shows simulated placeholder when email is empty', () => {
    render(<SubscriptionTerminal />)
    expect(screen.getByText('Email')).toBeDefined()
  })

  it('hides placeholder when email is typed', () => {
    render(<SubscriptionTerminal />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    expect(screen.queryByText('Email')).toBeNull()
    expect(input.value).toBe('test@example.com')
  })

  it('shows error for invalid email', () => {
    render(<SubscriptionTerminal />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request invite/i })

    fireEvent.change(input, { target: { value: 'invalid-email' } })
    fireEvent.click(button)

    expect(screen.getByText('Invalid email — try again.')).toBeDefined()
  })

  it('shows error for empty email', () => {
    render(<SubscriptionTerminal />)
    const button = screen.getByRole('button', { name: /request invite/i })

    fireEvent.click(button)

    expect(screen.getByText('Invalid email — try again.')).toBeDefined()
  })

  it('clears error when user starts typing after error', () => {
    render(<SubscriptionTerminal />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request invite/i })

    fireEvent.change(input, { target: { value: 'invalid' } })
    fireEvent.click(button)
    expect(screen.getByText('Invalid email — try again.')).toBeDefined()

    fireEvent.change(input, { target: { value: 'valid@example.com' } })
    expect(screen.queryByText('Invalid email — try again.')).toBeNull()
  })

  it('calls supabase insert with email on valid submit', async () => {
    render(<SubscriptionTerminal />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request invite/i })

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({ email: 'test@example.com' })
    })
  })

  it('shows processing state during submission', async () => {
    mockInsert.mockImplementation(() => new Promise(() => {}))

    render(<SubscriptionTerminal />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request invite/i })

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('[ AUTHENTICATING... ]')).toBeDefined()
    })
  })

  it('disables input and button during processing', async () => {
    mockInsert.mockImplementation(() => new Promise(() => {}))

    render(<SubscriptionTerminal />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    const button = screen.getByRole('button', { name: /request invite/i }) as HTMLButtonElement

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(input.disabled).toBe(true)
      expect(button.disabled).toBe(true)
    })
  })

  it('shows success message after successful submission', async () => {
    render(<SubscriptionTerminal />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request invite/i })

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/request logged/i)).toBeDefined()
      expect(screen.getByText(/you're on the waiting list/i)).toBeDefined()
    })
  })

  it('shows error when supabase insert fails', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'Database error' } })

    render(<SubscriptionTerminal />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request invite/i })

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Invalid email — try again.')).toBeDefined()
    })
  })

  it('hides form after successful submission', async () => {
    render(<SubscriptionTerminal />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request invite/i })

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).toBeNull()
      expect(screen.queryByRole('button', { name: /request invite/i })).toBeNull()
    })
  })

  it('accepts email with plus sign', async () => {
    render(<SubscriptionTerminal />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request invite/i })

    fireEvent.change(input, { target: { value: 'test+tag@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({ email: 'test+tag@example.com' })
    })
  })

  it('accepts email with subdomain', async () => {
    render(<SubscriptionTerminal />)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /request invite/i })

    fireEvent.change(input, { target: { value: 'test@mail.example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({ email: 'test@mail.example.com' })
    })
  })
})

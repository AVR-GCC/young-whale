import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useEmailSubscription } from './useEmailSubscription'

const mockFetch = vi.fn()

describe('useEmailSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = mockFetch
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Subscribed successfully' }),
    })
  })

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useEmailSubscription())

    expect(result.current.email).toBe('')
    expect(result.current.isSubmitted).toBe(false)
    expect(result.current.isProcessing).toBe(false)
    expect(result.current.error).toBe(false)
    expect(result.current.isValidEmail).toBe(false)
  })

  it('updates email state', () => {
    const { result } = renderHook(() => useEmailSubscription())

    act(() => {
      result.current.setEmail('test@example.com')
    })

    expect(result.current.email).toBe('test@example.com')
    expect(result.current.isValidEmail).toBe(true)
  })

  it('validates email correctly', () => {
    const { result } = renderHook(() => useEmailSubscription())

    act(() => {
      result.current.setEmail('invalid-email')
    })

    expect(result.current.isValidEmail).toBe(false)

    act(() => {
      result.current.setEmail('test@example.com')
    })

    expect(result.current.isValidEmail).toBe(true)
  })

  it('shows error for invalid email on submit', async () => {
    const { result } = renderHook(() => useEmailSubscription())

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>

    await act(async () => {
      await result.current.handleSubmit(mockEvent)
    })

    expect(result.current.error).toBe(true)
    expect(result.current.isSubmitted).toBe(false)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('calls fetch with normalized email on valid submit', async () => {
    const { result } = renderHook(() => useEmailSubscription())

    act(() => {
      result.current.setEmail('Test@Example.COM')
    })

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>

    await act(async () => {
      await result.current.handleSubmit(mockEvent)
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    })
  })

  it('sets submitted state on success', async () => {
    const { result } = renderHook(() => useEmailSubscription())

    act(() => {
      result.current.setEmail('test@example.com')
    })

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>

    await act(async () => {
      await result.current.handleSubmit(mockEvent)
    })

    expect(result.current.isSubmitted).toBe(true)
    expect(result.current.error).toBe(false)
    expect(result.current.isProcessing).toBe(false)
  })

  it('sets error state on API failure', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Server error' }),
    })

    const { result } = renderHook(() => useEmailSubscription())

    act(() => {
      result.current.setEmail('test@example.com')
    })

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>

    await act(async () => {
      await result.current.handleSubmit(mockEvent)
    })

    expect(result.current.error).toBe(true)
    expect(result.current.isSubmitted).toBe(false)
    expect(result.current.isProcessing).toBe(false)
  })

  it('sets error state on network failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useEmailSubscription())

    act(() => {
      result.current.setEmail('test@example.com')
    })

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>

    await act(async () => {
      await result.current.handleSubmit(mockEvent)
    })

    expect(result.current.error).toBe(true)
    expect(result.current.isSubmitted).toBe(false)
    expect(result.current.isProcessing).toBe(false)
  })

  it('sets processing state during submission', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useEmailSubscription())

    act(() => {
      result.current.setEmail('test@example.com')
    })

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    await waitFor(() => {
      expect(result.current.isProcessing).toBe(true)
    })
  })

  it('clears error state', async () => {
    const { result } = renderHook(() => useEmailSubscription())

    act(() => {
      result.current.setEmail('invalid')
    })

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>

    await act(async () => {
      await result.current.handleSubmit(mockEvent)
    })

    expect(result.current.error).toBe(true)

    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBe(false)
  })

  it('resets all state', async () => {
    const { result } = renderHook(() => useEmailSubscription())

    act(() => {
      result.current.setEmail('test@example.com')
    })

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>

    await act(async () => {
      await result.current.handleSubmit(mockEvent)
    })

    expect(result.current.isSubmitted).toBe(true)

    act(() => {
      result.current.reset()
    })

    expect(result.current.email).toBe('')
    expect(result.current.isSubmitted).toBe(false)
    expect(result.current.isProcessing).toBe(false)
    expect(result.current.error).toBe(false)
  })
})

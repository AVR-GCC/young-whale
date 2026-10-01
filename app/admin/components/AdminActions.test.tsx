import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => Promise.resolve({ count: 3, error: null }),
      }),
    }),
    auth: {
      signOut: vi.fn(),
    },
  },
}))

import AdminActions from './AdminActions'

describe('AdminActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('renders Run New Process and Attach to Run buttons', () => {
    render(<AdminActions userEmail="admin@test.com" />)
    expect(screen.getByText('Run New Process')).toBeDefined()
    expect(screen.getByText('Attach to Run')).toBeDefined()
  })

  it('starts a new processing run with mode=new', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ runId: 'run-1', status: 'running' }),
    } as unknown as Response)

    render(<AdminActions userEmail="admin@test.com" />)
    fireEvent.click(screen.getByText('Run New Process'))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/cron/process?mode=new')
    })
  })

  it('attaches to an existing run with mode=attach', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ runId: 'existing-run-1', status: 'running' }),
    } as unknown as Response)

    render(<AdminActions userEmail="admin@test.com" />)
    fireEvent.click(screen.getByText('Attach to Run'))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/cron/process?mode=attach')
    })
  })

  it('shows a message when attaching and no run is in progress', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 404,
      json: vi.fn().mockResolvedValue({ error: 'No processing run in progress' }),
    } as unknown as Response)

    render(<AdminActions userEmail="admin@test.com" />)
    fireEvent.click(screen.getByText('Attach to Run'))

    await waitFor(() => {
      expect(screen.getByText('No processing run in progress')).toBeDefined()
    })
  })
})

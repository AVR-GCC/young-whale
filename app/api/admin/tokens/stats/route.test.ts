import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'
import { supabaseService } from '@/lib/supabase/service'

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    })),
  },
}))

function createMockQueryBuilder(
  finalResolution: { data: unknown; error: unknown } = { data: null, error: null }
) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    then: (onfulfilled?: (value: { data: unknown; error: unknown }) => unknown) =>
      Promise.resolve(finalResolution).then(onfulfilled),
  }
  return builder
}

describe('GET /api/admin/tokens/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns counts for all token statuses', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: [
          { status: 'approved', is_promoted: false, confidence: 'high' },
          { status: 'approved', is_promoted: true, confidence: 'high' },
          { status: 'pending_review', is_promoted: false, confidence: 'medium' },
          { status: 'rejected', is_promoted: false, confidence: 'low' },
          { status: 'approved', is_promoted: false, confidence: 'low' },
        ],
        error: null,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.total).toBe(5)
    expect(json.approved).toBe(3)
    expect(json.pending_review).toBe(1)
    expect(json.rejected).toBe(1)
    expect(json.promoted).toBe(1)
    expect(json.low_confidence).toBe(2)
  })

  it('returns zeros when no tokens exist', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: [],
        error: null,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.total).toBe(0)
    expect(json.approved).toBe(0)
    expect(json.pending_review).toBe(0)
    expect(json.rejected).toBe(0)
    expect(json.promoted).toBe(0)
    expect(json.low_confidence).toBe(0)
  })

  it('handles database errors', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: null,
        error: { message: 'Connection failed' },
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Failed to fetch stats')
  })
})

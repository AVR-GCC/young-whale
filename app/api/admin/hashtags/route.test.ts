import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'
import { supabaseService } from '@/lib/supabase/service'

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
    })),
  },
}))

function createMockQueryBuilder(
  finalResolution: { data: unknown; error: unknown } = { data: null, error: null }
) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => builder),
    then: (onfulfilled?: (value: { data: unknown; error: unknown }) => unknown) =>
      Promise.resolve(finalResolution).then(onfulfilled),
  }
  return builder
}

describe('GET /api/admin/hashtags', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns active hashtags ordered by name', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: [
          { id: 'h1', name: 'AI', slug: 'ai' },
          { id: 'h2', name: 'DeFi', slug: 'defi' },
          { id: 'h3', name: 'Gaming', slug: 'gaming' },
        ],
        error: null,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toHaveLength(3)
    expect(json[0].name).toBe('AI')
    expect(json[0].slug).toBe('ai')
  })

  it('returns empty array when no hashtags exist', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: [],
        error: null,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toHaveLength(0)
  })

  it('handles database errors', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: null,
        error: { message: 'Database error' },
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Database error')
  })
})

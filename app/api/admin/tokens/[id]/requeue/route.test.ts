import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'
import { supabaseService } from '@/lib/supabase/service'

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}))

interface MockQueryBuilder {
  select: () => MockQueryBuilder
  insert: () => MockQueryBuilder
  update: () => MockQueryBuilder
  delete: () => MockQueryBuilder
  eq: () => MockQueryBuilder
  single: () => Promise<{ data: unknown; error: unknown }>
}

function createMockQueryBuilder(
  overrides: { single?: () => Promise<{ data: unknown; error: unknown }> } = {},
  finalResolution: { data: unknown; error: unknown } = { data: null, error: null }
): MockQueryBuilder & PromiseLike<{ data: unknown; error: unknown }> {
  const builder = {
    select: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    single: overrides.single ?? vi.fn().mockResolvedValue({ data: null, error: null }),
    then: (onfulfilled?: (value: { data: unknown; error: unknown }) => unknown) =>
      Promise.resolve(finalResolution).then(onfulfilled),
  }
  return builder as MockQueryBuilder & PromiseLike<{ data: unknown; error: unknown }>
}

describe('POST /api/admin/tokens/[id]/requeue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('re-queues token for reprocessing and deletes hashtags', async () => {
    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'tokens') {
        return createMockQueryBuilder(
          {
            single: vi.fn().mockResolvedValue({
              data: { raw_token_id: 'raw-1' },
              error: null,
            }),
          },
          { data: { raw_token_id: 'raw-1' }, error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }
      if (table === 'token_hashtags') {
        return createMockQueryBuilder(
          {},
          { data: null, error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }
      return createMockQueryBuilder(
        {},
        { data: null, error: null }
      ) as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await POST(
      new Request('http://localhost/api/admin/tokens/token-1/requeue', { method: 'POST' }),
      { params: Promise.resolve({ id: 'token-1' }) }
    )
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.message).toBe('Token re-queued for reprocessing')
  })

  it('returns 404 when token not found', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder(
        {
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Not found' },
          }),
        },
        { data: null, error: { message: 'Not found' } }
      ) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await POST(
      new Request('http://localhost/api/admin/tokens/token-1/requeue', { method: 'POST' }),
      { params: Promise.resolve({ id: 'token-1' }) }
    )
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Not found')
  })

  it('returns 400 when token has no raw_token_id', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder(
        {
          single: vi.fn().mockResolvedValue({
            data: { raw_token_id: null },
            error: null,
          }),
        },
        { data: { raw_token_id: null }, error: null }
      ) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await POST(
      new Request('http://localhost/api/admin/tokens/token-1/requeue', { method: 'POST' }),
      { params: Promise.resolve({ id: 'token-1' }) }
    )
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('Token has no associated raw token')
  })

  it('handles database error when deleting hashtags', async () => {
    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'tokens') {
        return createMockQueryBuilder(
          {
            single: vi.fn().mockResolvedValue({
              data: { raw_token_id: 'raw-1' },
              error: null,
            }),
          },
          { data: { raw_token_id: 'raw-1' }, error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }
      if (table === 'token_hashtags') {
        return createMockQueryBuilder(
          {},
          { data: null, error: { message: 'Hashtag delete failed' } }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }
      return createMockQueryBuilder(
        {},
        { data: null, error: null }
      ) as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await POST(
      new Request('http://localhost/api/admin/tokens/token-1/requeue', { method: 'POST' }),
      { params: Promise.resolve({ id: 'token-1' }) }
    )
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Hashtag delete failed')
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, DELETE } from './route'
import { supabaseService } from '@/lib/supabase/service'

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
    })),
  },
}))

interface MockQueryBuilder {
  select: () => MockQueryBuilder
  insert: () => MockQueryBuilder
  update: () => MockQueryBuilder
  delete: () => MockQueryBuilder
  eq: () => MockQueryBuilder
  in: () => MockQueryBuilder
  or: () => MockQueryBuilder
  range: () => MockQueryBuilder
  order: () => MockQueryBuilder
  gte: () => MockQueryBuilder
  lte: () => MockQueryBuilder
}

function createMockQueryBuilder(
  finalResolution: { data: unknown; error: unknown; count?: number } = { data: null, error: null }
): MockQueryBuilder & PromiseLike<{ data: unknown; error: unknown; count?: number }> {
  const builder = {
    select: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    in: vi.fn(() => builder),
    or: vi.fn(() => builder),
    range: vi.fn(() => builder),
    order: vi.fn(() => builder),
    gte: vi.fn(() => builder),
    lte: vi.fn(() => builder),
    then: (onfulfilled?: (value: { data: unknown; error: unknown; count?: number }) => unknown) =>
      Promise.resolve(finalResolution).then(onfulfilled),
  }
  return builder as MockQueryBuilder & PromiseLike<{ data: unknown; error: unknown; count?: number }>
}

const mockToken = {
  id: 'token-1',
  name: 'Test Token',
  symbol: 'TEST',
  chain: 'ethereum',
  contract_address: '0x123',
  category: 'Tech',
  confidence: 'high',
  status: 'approved',
  is_promoted: false,
  is_verified: true,
  created_at: '2024-01-01T00:00:00Z',
  token_hashtags: [
    { hashtags: { id: 'h1', name: 'defi', slug: 'defi' } },
  ],
}

function createRequest(url: string): Request {
  return new Request(`http://localhost${url}`)
}

describe('GET /api/admin/tokens', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns paginated tokens list', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: [mockToken],
        error: null,
        count: 1,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET(createRequest('/api/admin/tokens?page=1&pageSize=25'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.tokens).toHaveLength(1)
    expect(json.tokens[0].id).toBe('token-1')
    expect(json.tokens[0].hashtags).toHaveLength(1)
    expect(json.pagination.total).toBe(1)
    expect(json.pagination.page).toBe(1)
  })

  it('filters by search term', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: [mockToken],
        error: null,
        count: 1,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET(createRequest('/api/admin/tokens?search=Test'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.tokens).toHaveLength(1)
  })

  it('filters by status', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: [{ ...mockToken, status: 'pending_review' }],
        error: null,
        count: 1,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET(createRequest('/api/admin/tokens?status=pending_review'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.tokens[0].status).toBe('pending_review')
  })

  it('filters by review queue mode', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: [{ ...mockToken, status: 'pending_review' }],
        error: null,
        count: 1,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET(createRequest('/api/admin/tokens?review_queue=true'))
    const json = await response.json()

    expect(response.status).toBe(200)
  })

  it('returns empty list when no tokens exist', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: [],
        error: null,
        count: 0,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET(createRequest('/api/admin/tokens'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.tokens).toHaveLength(0)
    expect(json.pagination.total).toBe(0)
  })

  it('handles database errors', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: null,
        error: { message: 'Database connection failed' },
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET(createRequest('/api/admin/tokens'))
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Database connection failed')
  })
})

describe('DELETE /api/admin/tokens', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes multiple tokens by IDs', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: null,
        error: null,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const request = new Request('http://localhost/api/admin/tokens', {
      method: 'DELETE',
      body: JSON.stringify({ ids: ['token-1', 'token-2'] }),
    })

    const response = await DELETE(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.deleted).toBe(2)
  })

  it('returns 400 when no IDs provided', async () => {
    const request = new Request('http://localhost/api/admin/tokens', {
      method: 'DELETE',
      body: JSON.stringify({ ids: [] }),
    })

    const response = await DELETE(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('No token IDs provided')
  })

  it('handles database errors during deletion', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: null,
        error: { message: 'Foreign key constraint' },
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const request = new Request('http://localhost/api/admin/tokens', {
      method: 'DELETE',
      body: JSON.stringify({ ids: ['token-1'] }),
    })

    const response = await DELETE(request)
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Foreign key constraint')
  })
})

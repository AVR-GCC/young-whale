import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, PATCH, DELETE } from './route'
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
    single: overrides.single ?? vi.fn(() => Promise.resolve(finalResolution)),
    then: (onfulfilled?: (value: { data: unknown; error: unknown }) => unknown) =>
      Promise.resolve(finalResolution).then(onfulfilled),
  }
  return builder as MockQueryBuilder & PromiseLike<{ data: unknown; error: unknown }>
}

const mockToken = {
  id: 'token-1',
  name: 'Test Token',
  symbol: 'TEST',
  chain: 'ethereum',
  contract_address: '0x123',
  slug: 'test-token',
  category: 'Tech',
  short_description: 'A test token',
  full_description: 'This is a test token',
  main_hashtag: 'defi',
  logo_url: 'https://example.com/logo.png',
  website_url: 'https://example.com',
  social_links: { twitter: 'https://twitter.com/test', telegram: '', discord: '' },
  exchange_links: ['https://dex.example.com'],
  preferred_exchange: 'https://dex.example.com',
  start_date: null,
  end_date: null,
  confidence: 'high',
  status: 'approved',
  is_promoted: false,
  is_verified: true,
  raw_token_id: 'raw-1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  token_hashtags: [
    { hashtags: { id: 'h1', name: 'defi', slug: 'defi' } },
  ],
  raw_token: {
    id: 'raw-1',
    raw_payload: { cmc_details: { tags: ['defi', 'ethereum'] } },
  },
}

describe('GET /api/admin/tokens/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns token with hashtags and raw data', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder(
        {
          single: vi.fn().mockResolvedValue({
            data: mockToken,
            error: null,
          }),
        },
        { data: mockToken, error: null }
      ) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET(
      new Request('http://localhost/api/admin/tokens/token-1'),
      { params: Promise.resolve({ id: 'token-1' }) }
    )
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.id).toBe('token-1')
    expect(json.hashtags).toHaveLength(1)
    expect(json.hashtags[0].name).toBe('defi')
    expect(json.raw_token).toBeDefined()
    expect(json.raw_token.raw_payload.cmc_details.tags).toEqual(['defi', 'ethereum'])
  })

  it('returns 404 when token not found', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder(
        {
          single: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        },
        { data: null, error: null }
      ) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET(
      new Request('http://localhost/api/admin/tokens/nonexistent'),
      { params: Promise.resolve({ id: 'nonexistent' }) }
    )
    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.error).toBe('Token not found')
  })

  it('handles database errors', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder(
        {
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'DB error' },
          }),
        },
        { data: null, error: { message: 'DB error' } }
      ) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET(
      new Request('http://localhost/api/admin/tokens/token-1'),
      { params: Promise.resolve({ id: 'token-1' }) }
    )
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('DB error')
  })
})

describe('PATCH /api/admin/tokens/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates allowed fields', async () => {
    const updatedToken = { ...mockToken, category: 'Meme', confidence: 'medium' }

    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder(
        {},
        { data: updatedToken, error: null }
      ) as unknown as ReturnType<typeof supabaseService.from>
    )

    const request = new Request('http://localhost/api/admin/tokens/token-1', {
      method: 'PATCH',
      body: JSON.stringify({ category: 'Meme', confidence: 'medium' }),
    })

    const response = await PATCH(request, { params: Promise.resolve({ id: 'token-1' }) })
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.category).toBe('Meme')
    expect(json.confidence).toBe('medium')
  })

  it('returns 400 when no valid fields provided', async () => {
    const request = new Request('http://localhost/api/admin/tokens/token-1', {
      method: 'PATCH',
      body: JSON.stringify({ invalid_field: 'value' }),
    })

    const response = await PATCH(request, { params: Promise.resolve({ id: 'token-1' }) })
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('No valid fields to update')
  })

  it('handles database errors during update', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder(
        {},
        { data: null, error: { message: 'Update failed' } }
      ) as unknown as ReturnType<typeof supabaseService.from>
    )

    const request = new Request('http://localhost/api/admin/tokens/token-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'rejected' }),
    })

    const response = await PATCH(request, { params: Promise.resolve({ id: 'token-1' }) })
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Update failed')
  })
})

describe('DELETE /api/admin/tokens/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes a single token', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder(
        {},
        { data: null, error: null }
      ) as unknown as ReturnType<typeof supabaseService.from>
    )

    const request = new Request('http://localhost/api/admin/tokens/token-1', {
      method: 'DELETE',
    })

    const response = await DELETE(request, { params: Promise.resolve({ id: 'token-1' }) })
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
  })

  it('handles database errors during deletion', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder(
        {},
        { data: null, error: { message: 'Cannot delete token' } }
      ) as unknown as ReturnType<typeof supabaseService.from>
    )

    const request = new Request('http://localhost/api/admin/tokens/token-1', {
      method: 'DELETE',
    })

    const response = await DELETE(request, { params: Promise.resolve({ id: 'token-1' }) })
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Cannot delete token')
  })
})

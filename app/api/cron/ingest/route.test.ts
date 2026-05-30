import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GET } from './route'
import { supabaseService } from '@/lib/supabase/service'

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      single: vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
    })),
  },
}))

const mockListings = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Token ${i + 1}`,
  symbol: `TKN${i + 1}`,
  date_added: '2024-01-01',
}))

const mockDetails = {
  name: 'Token',
  symbol: 'TKN',
  logo: 'https://example.com/logo.png',
  description: 'Test token',
  urls: { website: ['https://example.com'] },
  contract_address: [],
  category: 'token',
  tags: [],
}

const mockFetch = vi.fn()
global.fetch = mockFetch

interface MockQueryBuilder {
  select: () => MockQueryBuilder
  insert: () => MockQueryBuilder
  limit: () => MockQueryBuilder
  eq: () => MockQueryBuilder
  maybeSingle: () => Promise<{ data: unknown; error: null }>
  single: () => Promise<{ data: unknown; error: null }>
}

function createMockQueryBuilder(overrides: Partial<MockQueryBuilder> = {}): MockQueryBuilder {
  const builder: MockQueryBuilder = {
    select: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    maybeSingle: overrides.maybeSingle ?? vi.fn().mockResolvedValue({ data: null, error: null }),
    single: overrides.single ?? vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
  }
  return builder
}

function createRequest(): Request {
  return new Request('http://localhost/api/cron/ingest', {
    headers: { Authorization: 'Bearer test-cron-secret' },
  })
}

function setupMockFetch() {
  mockFetch.mockImplementation((url: string) => {
    if (url.includes('/listings/latest')) {
      const limitMatch = url.match(/limit=(\d+)/)
      const limit = limitMatch ? parseInt(limitMatch[1], 10) : 50
      return Promise.resolve({ ok: true, json: async () => ({ data: mockListings.slice(0, limit) }) })
    }
    const idMatch = url.match(/id=(\d+)/)
    const id = idMatch ? idMatch[1] : '1'
    return Promise.resolve({
      ok: true,
      json: async () => ({
        data: { [id]: { ...mockDetails, name: `Token ${id}`, symbol: `TKN${id}` } }
      }),
    })
  })
}

describe('GET /api/cron/ingest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(supabaseService.from).mockImplementation(() => createMockQueryBuilder() as any)
    
    vi.stubEnv('COINMARKETCAP_API_KEY', 'test-cmc-key')
    vi.stubEnv('CRON_SECRET', 'test-cron-secret')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns 401 when Authorization header is missing', async () => {
    const request = new Request('http://localhost/api/cron/ingest')
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.error).toBe('Unauthorized')
  })

  it('returns 500 when COINMARKETCAP_API_KEY is not set', async () => {
    vi.stubEnv('COINMARKETCAP_API_KEY', '')

    const response = await GET(createRequest())
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('COINMARKETCAP_API_KEY is not set')
  })

  it('ingests 20 tokens when raw_tokens table is empty', async () => {
    const mockMaybeSingle = vi.fn()
      .mockResolvedValueOnce({ data: null, error: null }) // isRawTokensTableEmpty check
      .mockResolvedValue({ data: null, error: null })     // individual token checks

    vi.mocked(supabaseService.from).mockImplementation(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMockQueryBuilder({ maybeSingle: mockMaybeSingle }) as any
    )

    setupMockFetch()

    const response = await GET(createRequest())
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.imported).toBe(20)
  })

  it('stops ingesting when it finds an existing token', async () => {
    const mockMaybeSingle = vi.fn()
      .mockResolvedValueOnce({ data: { id: 'existing-id' }, error: null }) // not empty
      .mockResolvedValueOnce({ data: null, error: null })                  // token 1 doesn't exist
      .mockResolvedValueOnce({ data: { id: 'existing-id' }, error: null }) // token 2 exists

    vi.mocked(supabaseService.from).mockImplementation(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMockQueryBuilder({ maybeSingle: mockMaybeSingle }) as any
    )

    setupMockFetch()

    const response = await GET(createRequest())
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.imported).toBe(1)
  })

  it('adds jobs to processing_queue after ingesting tokens', async () => {
    const mockMaybeSingle = vi.fn()
      .mockResolvedValueOnce({ data: null, error: null }) // isRawTokensTableEmpty check
      .mockResolvedValue({ data: null, error: null })     // individual token checks

    const processingQueueInsert = vi.fn().mockResolvedValue({ error: null })

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'processing_queue') {
        return {
          select: vi.fn().mockReturnThis(),
          insert: processingQueueInsert,
          limit: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          single: vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return createMockQueryBuilder({ maybeSingle: mockMaybeSingle }) as any
    })

    setupMockFetch()

    const response = await GET(createRequest())
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.imported).toBe(20)
    expect(processingQueueInsert).toHaveBeenCalledTimes(1)
    expect(processingQueueInsert).toHaveBeenCalledWith(
      Array.from({ length: 20 }, () => ({ raw_token_id: 'test-id' }))
    )
  })

  it('handles CMC API errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const response = await GET(createRequest())
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toContain('Network error')
  })
})

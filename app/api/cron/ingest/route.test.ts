import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST } from './route'
import { supabaseService } from '@/lib/supabase/service'

// 1. Setup Hoisted Mocks cleanly below imports
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

// 2. Share reusable mock data at the top
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

// 3. Mock Global Fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// 4. Query Builder Mock Helper
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

// 5. Reusable Fetch implementation helper to keep individual tests short
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

describe('POST /api/cron/ingest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(supabaseService.from).mockImplementation(() => createMockQueryBuilder() as any)
    
    // Use Vitest's environment stubbing features
    vi.stubEnv('COINMARKETCAP_API_KEY', 'test-cmc-key')
    vi.stubEnv('CRON_SECRET', 'test-cron-secret')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns 401 when Authorization header is missing', async () => {
    const request = new Request('http://localhost/api/cron/ingest')
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.error).toBe('Unauthorized')
  })

  it('returns 500 when COINMARKETCAP_API_KEY is not set', async () => {
    vi.stubEnv('COINMARKETCAP_API_KEY', '') // Safely empty it out for just this test

    const response = await POST(createRequest())
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('COINMARKETCAP_API_KEY is not set')
  })

  it('ingests 10 tokens when raw_tokens table is empty', async () => {
    const mockMaybeSingle = vi.fn()
      .mockResolvedValueOnce({ data: null, error: null }) // isRawTokensTableEmpty check
      .mockResolvedValue({ data: null, error: null })     // individual token checks

    vi.mocked(supabaseService.from).mockImplementation(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMockQueryBuilder({ maybeSingle: mockMaybeSingle }) as any
    )

    setupMockFetch()

    const response = await POST(createRequest())
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.imported).toBe(10)
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

    const response = await POST(createRequest())
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.imported).toBe(1)
  })

  it('handles CMC API errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const response = await POST(createRequest())
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toContain('Network error')
  })
})

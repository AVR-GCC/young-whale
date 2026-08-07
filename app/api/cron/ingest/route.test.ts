import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextResponse } from 'next/server'
import { GET } from './route'
import { supabaseService } from '@/lib/supabase/service'
import { verifyCronRequest } from '@/lib/cron/verify'
import { requireAdminApi } from '@/lib/admin-auth'

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

vi.mock('@/lib/cron/verify', () => ({
  verifyCronRequest: vi.fn(),
}))

vi.mock('@/lib/admin-auth', () => ({
  requireAdminApi: vi.fn(),
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
  'tag-names': [],
}

const mockFetch = vi.fn()
global.fetch = mockFetch

interface MockQueryBuilder {
  select: () => MockQueryBuilder
  insert: () => MockQueryBuilder
  limit: () => MockQueryBuilder
  eq: () => MockQueryBuilder
  in: () => MockQueryBuilder
  maybeSingle: () => Promise<{ data: unknown; error: null }>
  single: () => Promise<{ data: unknown; error: null }>
  then: (onfulfilled?: (value: { data: unknown; error: unknown }) => unknown) => Promise<unknown>
}

function createMockQueryBuilder(
  overrides: Partial<MockQueryBuilder> = {},
  finalResolution: { data: unknown; error: unknown } = { data: null, error: null }
): MockQueryBuilder & PromiseLike<{ data: unknown; error: unknown }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const builder: any = {
    select: vi.fn(() => builder),
    insert: overrides.insert ?? vi.fn(() => builder),
    limit: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    in: vi.fn(() => builder),
    maybeSingle: overrides.maybeSingle ?? vi.fn().mockResolvedValue({ data: null, error: null }),
    single: overrides.single ?? vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
    then: (onfulfilled?: (value: { data: unknown; error: unknown }) => unknown) =>
      Promise.resolve(finalResolution).then(onfulfilled),
  }
  return builder as MockQueryBuilder & PromiseLike<{ data: unknown; error: unknown }>
}

function createRequest(authHeader?: string): Request {
  const headers: Record<string, string> = {}
  if (authHeader) {
    headers.Authorization = authHeader
  }
  return new Request('http://localhost/api/cron/ingest', { headers })
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
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('COINMARKETCAP_API_KEY', 'test-cmc-key')
    vi.stubEnv('CRON_SECRET', 'test-cron-secret')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(supabaseService.from).mockImplementation(() => createMockQueryBuilder() as any)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns 401 when not in development and both cron and admin auth fail', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(false)
    vi.mocked(requireAdminApi).mockResolvedValue(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) as Awaited<ReturnType<typeof requireAdminApi>>
    )

    const response = await GET(createRequest('Bearer wrong-secret'))
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.error).toBe('Unauthorized')
  })

  it('bypasses auth check in development mode', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.mocked(verifyCronRequest).mockReturnValue(false)

    setupMockFetch()

    const response = await GET(createRequest())
    const json = await response.json()

    expect(response.status).toBe(200)
  })

  it('allows access with valid admin auth when cron verification fails', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(false)
    vi.mocked(requireAdminApi).mockResolvedValue({
      id: 'admin-1',
      email: 'admin@test.com',
      role: 'admin',
    } as Awaited<ReturnType<typeof requireAdminApi>>)

    setupMockFetch()

    const response = await GET(createRequest('Bearer admin-token'))
    const json = await response.json()

    expect(response.status).toBe(200)
  })

  it('returns 500 when COINMARKETCAP_API_KEY is not set', async () => {
    vi.stubEnv('COINMARKETCAP_API_KEY', '')
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('COINMARKETCAP_API_KEY is not set')
  })

  it('ingests 20 tokens when raw_tokens table is empty', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    const mockMaybeSingle = vi.fn()
      .mockResolvedValueOnce({ data: null, error: null }) // isRawTokensTableEmpty check
      .mockResolvedValue({ data: null, error: null })     // individual token checks

    vi.mocked(supabaseService.from).mockImplementation(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMockQueryBuilder({ maybeSingle: mockMaybeSingle }) as any
    )

    setupMockFetch()

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.imported).toBe(20)
  })

  it('stops ingesting when it finds an existing token', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    const mockMaybeSingle = vi.fn()
      .mockResolvedValueOnce({ data: { id: 'existing-id' }, error: null }) // not empty
      .mockResolvedValueOnce({ data: null, error: null })                  // token 1 doesn't exist
      .mockResolvedValueOnce({ data: { id: 'existing-id' }, error: null }) // token 2 exists

    vi.mocked(supabaseService.from).mockImplementation(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMockQueryBuilder({ maybeSingle: mockMaybeSingle }) as any
    )

    setupMockFetch()

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.imported).toBe(1)
  })

  it('adds jobs to processing_queue after ingesting tokens', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

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

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.imported).toBe(20)
    expect(processingQueueInsert).toHaveBeenCalledTimes(1)
    expect(processingQueueInsert).toHaveBeenCalledWith(
      Array.from({ length: 20 }, () => ({ raw_token_id: 'test-id' }))
    )
  })

  it('assigns chain id from chains table when explorer matches prefix', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    const mockChains = [
      { id: 'chain-1', explorer_prefix: 'https://example-explorer.com/token/' },
      { id: 'chain-2', explorer_prefix: 'https://other-explorer.com/address/' },
    ]

    const detailsWithExplorer = {
      ...mockDetails,
      urls: {
        website: ['https://example.com'],
        explorer: ['https://example-explorer.com/token/0x123'],
      },
      contract_address: [],
    }

    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/listings/latest')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: mockListings.slice(0, 1) }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          data: { '1': { ...detailsWithExplorer, name: 'Token 1', symbol: 'TKN1' } },
        }),
      })
    })

    let insertedTokenData: { chain?: string } & Record<string, unknown> | null = null

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'chains') {
        return createMockQueryBuilder(
          {},
          { data: mockChains, error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'raw_tokens') {
        const builder: Record<string, unknown> = {
          select: vi.fn(() => builder),
          insert: vi.fn().mockImplementation((data: Record<string, unknown>) => {
            insertedTokenData = data
            return builder
          }),
          limit: vi.fn(() => builder),
          eq: vi.fn(() => builder),
          in: vi.fn(() => builder),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          single: vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
          then: (onfulfilled?: (value: { data: unknown; error: unknown }) => unknown) =>
            Promise.resolve({ data: null, error: null }).then(onfulfilled),
        }
        return builder as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder({
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }) as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.imported).toBe(1)
    expect(insertedTokenData).toBeDefined()
    expect(insertedTokenData && (insertedTokenData as Record<string, unknown>)['chain']).toBe('chain-1')
  })

  it('assigns chain "original" when no platform name and no explorer prefix matches', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    const mockChains = [
      { id: 'chain-1', explorer_prefix: 'https://example-explorer.com/token/' },
    ]

    const detailsWithNoMatch = {
      ...mockDetails,
      urls: {
        website: ['https://example.com'],
        explorer: ['https://unmatched-explorer.com/token/0x123'],
      },
      contract_address: [],
    }

    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/listings/latest')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: mockListings.slice(0, 1) }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          data: { '1': { ...detailsWithNoMatch, name: 'Token 1', symbol: 'TKN1' } },
        }),
      })
    })

    let insertedTokenData: { chain?: string } & Record<string, unknown> | null = null

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'chains') {
        return createMockQueryBuilder(
          {},
          { data: mockChains, error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'raw_tokens') {
        const builder: MockQueryBuilder = {
          select: vi.fn(() => builder),
          insert: vi.fn().mockImplementation((data: { chain?: string } & Record<string, unknown>) => {
            insertedTokenData = data
            return builder
          }),
          limit: vi.fn(() => builder),
          eq: vi.fn(() => builder),
          in: vi.fn(() => builder),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          single: vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
          then: (onfulfilled?: (value: { data: unknown; error: unknown }) => unknown) =>
            Promise.resolve({ data: null, error: null }).then(onfulfilled),
        }
        return builder as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder({
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }) as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.imported).toBe(1)
    expect(insertedTokenData).toBeDefined()
    expect(insertedTokenData && (insertedTokenData as Record<string, unknown>)['chain']).toBe('original')
  })

  it('handles CMC API errors gracefully', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toContain('Network error')
  })

  it('bulk inserts new hashtags after ingesting tokens', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    const detailsWithTags = {
      ...mockDetails,
      tags: ['defi', 'ai', 'meme'],
      'tag-names': ['DeFi', 'AI', 'Meme'],
    }

    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/listings/latest')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: mockListings.slice(0, 3) }),
        })
      }
      const idMatch = url.match(/id=(\d+)/)
      const id = idMatch ? idMatch[1] : '1'
      return Promise.resolve({
        ok: true,
        json: async () => ({
          data: {
            [id]: { ...detailsWithTags, name: `Token ${id}`, symbol: `TKN${id}` },
          },
        }),
      })
    })

    const hashtagsInsert = vi.fn().mockResolvedValue({ error: null })

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'hashtags') {
        return createMockQueryBuilder(
          { insert: hashtagsInsert },
          { data: [{ slug: 'defi' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder({
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }) as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.imported).toBe(3)
    expect(hashtagsInsert).toHaveBeenCalledTimes(1)
    expect(hashtagsInsert).toHaveBeenCalledWith([
      { slug: 'ai', name: 'AI' },
      { slug: 'meme', name: 'Meme' },
    ])
  })
})

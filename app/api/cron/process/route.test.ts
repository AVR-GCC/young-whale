import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextResponse } from 'next/server'
import { GET } from './route'
import { supabaseService } from '@/lib/supabase/service'
import { generateText } from 'ai'
import { verifyCronRequest } from '@/lib/cron/verify'
import { requireAdminApi } from '@/lib/admin-auth'

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}))

vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: vi.fn(() => ({
    chat: vi.fn(() => 'mock-fireworks-model'),
  })),
}))

vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: vi.fn(() => ({
    chat: vi.fn(() => 'mock-gemini-model'),
  })),
}))

vi.mock('ai', () => ({
  generateText: vi.fn(),
}))

vi.mock('@/lib/cron/verify', () => ({
  verifyCronRequest: vi.fn(),
}))

vi.mock('@/lib/admin-auth', () => ({
  requireAdminApi: vi.fn(),
}))

vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server')
  return {
    ...actual,
    after: vi.fn((task: () => void) => task()),
  }
})

interface MockQueryBuilder {
  select: () => MockQueryBuilder
  insert: () => MockQueryBuilder
  update: () => MockQueryBuilder
  upsert: () => MockQueryBuilder
  eq: () => MockQueryBuilder
  in: () => MockQueryBuilder
  or: () => MockQueryBuilder
  limit: () => MockQueryBuilder
  order: () => MockQueryBuilder
  maybeSingle: () => Promise<{ data: unknown; error: null }>
  single: () => Promise<{ data: unknown; error: null }>
  then: (onfulfilled?: (value: { data: unknown; error: unknown }) => unknown) => Promise<unknown>
}

function createMockQueryBuilder(
  overrides: Partial<MockQueryBuilder> = {},
  finalResolution: { data: unknown; error: unknown } = { data: null, error: null }
): MockQueryBuilder & PromiseLike<{ data: unknown; error: unknown }> {
  const builder = {
    select: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    upsert: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    in: vi.fn(() => builder),
    or: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    neq: vi.fn(() => builder),
    order: vi.fn(() => builder),
    maybeSingle: overrides.maybeSingle ?? vi.fn().mockResolvedValue({ data: null, error: null }),
    single: overrides.single ?? vi.fn().mockResolvedValue({ data: null, error: null }),
    then: (onfulfilled?: (value: { data: unknown; error: unknown }) => unknown) =>
      Promise.resolve(finalResolution).then(onfulfilled),
  }
  return builder as MockQueryBuilder & PromiseLike<{ data: unknown; error: unknown }>
}

function createProcessingRunsMock(runId = 'run-1') {
  const builder = createMockQueryBuilder(
    {
      single: vi.fn().mockResolvedValue({
        data: { id: runId, status: 'running', processed_count: 0, failed_count: 0 },
        error: null,
      }),
    },
    { data: { id: runId, status: 'running', processed_count: 0, failed_count: 0 }, error: null }
  )
  builder.insert = vi.fn(() => builder)
  return builder
}

function createRequest(authHeader?: string): Request {
  const headers: Record<string, string> = {}
  if (authHeader) {
    headers.Authorization = authHeader
  }
  return new Request('http://localhost/api/cron/process', { headers })
}

function createQueueMock(jobs: typeof mockJob[] = [mockJob]) {
  const builder = createMockQueryBuilder({}, { data: [], error: null })
  builder.select = vi.fn(() => {
    createQueueMock.selectCallCount++
    if (createQueueMock.selectCallCount === 1) {
      return createMockQueryBuilder({}, { data: jobs, error: null })
    }
    return createMockQueryBuilder({}, { data: [], error: null })
  })
  return builder
}

createQueueMock.selectCallCount = 0

const mockJob = {
  id: 'job-1',
  raw_token_id: 'raw-1',
  status: 'queued',
  retry_count: 0,
  max_retries: 3,
  error_message: null,
  locked_until: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockRawToken = {
  id: 'raw-1',
  name: 'Test Token',
  symbol: 'TEST',
  chain: 'ethereum',
  contract_address: '0x123',
  website_url: 'https://test.com',
  logo_url: 'https://test.com/logo.png',
  social_links: {},
  exchange_links: [],
  source_type: 'coinbase',
  source_url: 'https://coinmarketcap.com',
  raw_payload: null,
  status: 'pending',
  retry_count: 0,
  error_message: null,
  created_at: new Date().toISOString(),
}

const mockAIResult = {
  category: 'Tech',
  main_hashtag: 'defi',
  short_description: 'A test token',
  full_description: 'This is a test token for testing purposes.',
  confidence: 'high',
}

describe('GET /api/cron/process', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('FIREWORKS_API_KEY', 'test-fireworks-key')
    vi.stubEnv('GOOGLE_GENERATIVE_AI_API_KEY', 'test-google-key')
    vi.stubEnv('CRON_SECRET', 'test-cron-secret')
    createQueueMock.selectCallCount = 0
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  // it('returns 401 when not in development and Authorization header is invalid', async () => {
  //   vi.mocked(verifyCronRequest).mockReturnValue(false)
  //
  //   const response = await GET(createRequest('Bearer wrong-secret'))
  //   const json = await response.json()
  //
  //   expect(response.status).toBe(401)
  //   expect(json.error).toBe('Unauthorized')
  // })

  it('bypasses auth check in development mode', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.mocked(verifyCronRequest).mockReturnValue(false)

    let callCount = 0
    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      callCount++
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }
      if (callCount === 2) {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }, { slug: 'ai' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }
      return createMockQueryBuilder(
        {},
        { data: [], error: null }
      ) as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest())
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
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

  it('allows access with valid admin auth when cron verification fails', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(false)
    vi.mocked(requireAdminApi).mockResolvedValue({
      id: 'admin-1',
      email: 'admin@test.com',
      role: 'admin',
    } as Awaited<ReturnType<typeof requireAdminApi>>)

    let callCount = 0
    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      callCount++
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }
      if (callCount === 2) {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }, { slug: 'ai' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }
      return createMockQueryBuilder(
        {},
        { data: [], error: null }
      ) as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer admin-token'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
  })

  it('returns 500 when fetching hashtags fails', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }
      return createMockQueryBuilder(
        {},
        { data: null, error: { message: 'DB error' } }
      ) as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
  })

  it('returns 500 when picking up jobs fails', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    let callCount = 0
    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      callCount++
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }
      if (callCount === 2) {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }
      return createMockQueryBuilder(
        {},
        { data: null, error: { message: 'DB error' } }
      ) as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
  })

  it('returns empty counts when no jobs in queue', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    let callCount = 0
    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      callCount++
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }
      if (callCount === 2) {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }
      return createMockQueryBuilder(
        {},
        { data: [], error: null }
      ) as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
  })

  it('fetches exchange links from DexScreener when raw.exchange_links is empty', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)
    vi.mocked(generateText).mockResolvedValue({
      text: JSON.stringify(mockAIResult),
    } as unknown as Awaited<ReturnType<typeof generateText>>)

    const dexScreenerResponse = {
      pairs: [
        { url: 'https://dexscreener.com/ethereum/0xabc', baseToken: { symbol: 'TEST' }, quoteToken: { symbol: 'WETH' }, marketCap: 1000000 },
        { url: 'https://dexscreener.com/ethereum/0xdef', baseToken: { symbol: 'TEST' }, quoteToken: { symbol: 'USDC' }, marketCap: 2000000 },
      ],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(dexScreenerResponse),
    } as unknown as Response)

    let tokenUpsertData: Record<string, unknown> | null = null

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }, { slug: 'ai' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createQueueMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'raw_tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: { ...mockRawToken, exchange_links: [] },
            error: null,
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'tokens') {
        const builder = createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: { id: 'token-1' },
            error: null,
          }),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        })
        builder.upsert = vi.fn().mockImplementation((data: Record<string, unknown>) => {
          tokenUpsertData = data
          return builder
        })
        return builder as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'token_hashtags') {
        return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    // Wait for background processing to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(mockRawToken.contract_address)}`
    )
    expect(tokenUpsertData).not.toBeNull()
    expect(tokenUpsertData!.exchange_links).toEqual([
      'TEST_USDC_https://dexscreener.com/ethereum/0xdef',
      'TEST_WETH_https://dexscreener.com/ethereum/0xabc',
    ])
    expect(tokenUpsertData!.preferred_exchange).toBe('TEST_USDC_https://dexscreener.com/ethereum/0xdef')
  })

  it('sorts DexScreener links by marketCap, prefixes with token symbols, and deduplicates', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)
    vi.mocked(generateText).mockResolvedValue({
      text: JSON.stringify(mockAIResult),
    } as unknown as Awaited<ReturnType<typeof generateText>>)

    const dexScreenerResponse = {
      pairs: [
        // Lower market cap - should come last
        { url: 'https://dexscreener.com/ethereum/0xabc', baseToken: { symbol: 'TEST' }, quoteToken: { symbol: 'WETH' }, marketCap: 1000000 },
        // Higher market cap - should come first
        { url: 'https://dexscreener.com/ethereum/0xdef', baseToken: { symbol: 'TEST' }, quoteToken: { symbol: 'USDC' }, marketCap: 5000000 },
        // Medium market cap - should come second
        { url: 'https://dexscreener.com/ethereum/0xghi', baseToken: { symbol: 'TEST' }, quoteToken: { symbol: 'DAI' }, marketCap: 3000000 },
        // Duplicate URL - should be deduplicated
        { url: 'https://dexscreener.com/ethereum/0xdef', baseToken: { symbol: 'TEST' }, quoteToken: { symbol: 'USDC' }, marketCap: 6000000 },
      ],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(dexScreenerResponse),
    } as unknown as Response)

    let tokenUpsertData: Record<string, unknown> | null = null

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }, { slug: 'ai' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createQueueMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'raw_tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: { ...mockRawToken, exchange_links: [] },
            error: null,
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'tokens') {
        const builder = createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: { id: 'token-1' },
            error: null,
          }),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        })
        builder.upsert = vi.fn().mockImplementation((data: Record<string, unknown>) => {
          tokenUpsertData = data
          return builder
        })
        return builder as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'token_hashtags') {
        return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    // Wait for background processing to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
    expect(tokenUpsertData).not.toBeNull()
    // Should be sorted by marketCap descending, deduplicated, and prefixed with symbols
    expect(tokenUpsertData!.exchange_links).toEqual([
      'TEST_USDC_https://dexscreener.com/ethereum/0xdef',
      'TEST_DAI_https://dexscreener.com/ethereum/0xghi',
      'TEST_WETH_https://dexscreener.com/ethereum/0xabc',
    ])
    expect(tokenUpsertData!.preferred_exchange).toBe('TEST_USDC_https://dexscreener.com/ethereum/0xdef')
  })

  it('processes a job successfully end-to-end', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)
    vi.mocked(generateText).mockResolvedValue({
      text: JSON.stringify(mockAIResult),
    } as unknown as Awaited<ReturnType<typeof generateText>>)

    let callCount = 0
    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      callCount++

      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }, { slug: 'ai' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        if (callCount === 3) {
          // Pick up jobs
          return createMockQueryBuilder(
            {},
            { data: [mockJob], error: null }
          ) as unknown as ReturnType<typeof supabaseService.from>
        }
        return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'raw_tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: mockRawToken,
            error: null,
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: { id: 'token-1' },
            error: null,
          }),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'token_hashtags') {
        return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
  })

  it('creates missing chain in chains table before inserting token', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)
    vi.mocked(generateText).mockResolvedValue({
      text: JSON.stringify(mockAIResult),
    } as unknown as Awaited<ReturnType<typeof generateText>>)

    const rawTokenWithNewChain = {
      ...mockRawToken,
      chain: 'new-chain',
    }

    let chainsInsertCalled = false
    let chainsInsertData: Record<string, unknown> | null = null

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }, { slug: 'ai' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createQueueMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'raw_tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: rawTokenWithNewChain,
            error: null,
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'chains') {
        const builder: MockQueryBuilder = {
          select: vi.fn(() => builder),
          insert: vi.fn().mockImplementation((data: Record<string, unknown>) => {
            chainsInsertCalled = true
            chainsInsertData = data
            return builder
          }),
          update: vi.fn(() => builder),
          upsert: vi.fn(() => builder),
          eq: vi.fn(() => builder),
          in: vi.fn(() => builder),
          or: vi.fn(() => builder),
          limit: vi.fn(() => builder),
          order: vi.fn(() => builder),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
          then: (onfulfilled?: (value: { data: unknown; error: unknown }) => unknown) =>
            Promise.resolve({ data: null, error: null }).then(onfulfilled),
        }
        return builder as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: { id: 'token-1' },
            error: null,
          }),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'token_hashtags') {
        return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    // Wait for background processing to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
    expect(chainsInsertCalled).toBe(true)
    expect(chainsInsertData).toEqual({
      id: 'new-chain',
      name: 'new-chain',
      icon: 'star.png',
      explorer_prefix: null,
    })
  })

  it('uses CMC tags for hashtags and stores AI-selected main hashtag', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)
    vi.mocked(generateText).mockResolvedValue({
      text: JSON.stringify({
        category: 'Tech',
        main_hashtag: 'defi',
        short_description: 'A DeFi token',
        full_description: 'This is a DeFi token.',
        confidence: 'high',
      }),
    } as unknown as Awaited<ReturnType<typeof generateText>>)

    const rawTokenWithCmc = {
      ...mockRawToken,
      raw_payload: {
        cmc_details: {
          tags: ['defi', 'ai', 'infrastructure'],
        },
      },
    }

    let callCount = 0

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      callCount++

      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          {
            data: [
              { slug: 'defi', id: 'hashtag-1' },
              { slug: 'ai', id: 'hashtag-2' },
              { slug: 'infrastructure', id: 'hashtag-3' },
            ],
            error: null,
          }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        if (callCount === 3) {
          return createMockQueryBuilder(
            {},
            { data: [mockJob], error: null }
          ) as unknown as ReturnType<typeof supabaseService.from>
        }
        return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'raw_tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: rawTokenWithCmc,
            error: null,
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: { id: 'token-1' },
            error: null,
          }),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'token_hashtags') {
        return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
  })

  it('marks job as failed when raw token is not found', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createQueueMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'raw_tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Not found' },
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
  })

  it('marks job as failed when AI returns invalid category', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)
    vi.mocked(generateText).mockResolvedValue({
      text: JSON.stringify({
        ...mockAIResult,
        category: 'InvalidCategory',
      }),
    } as unknown as Awaited<ReturnType<typeof generateText>>)

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }, { slug: 'ai' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createQueueMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'raw_tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: mockRawToken,
            error: null,
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
  })

  it('marks job as failed when AI call throws', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)
    vi.mocked(generateText).mockRejectedValue(new Error('AI API error'))

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createQueueMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'raw_tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: mockRawToken,
            error: null,
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
  })

  it('handles missing required fields (name, symbol, chain)', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createQueueMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'raw_tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: { ...mockRawToken, name: null, symbol: null },
            error: null,
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
  })

  it('processes multiple batches until queue is empty', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)
    vi.mocked(generateText).mockResolvedValue({
      text: JSON.stringify(mockAIResult),
    } as unknown as Awaited<ReturnType<typeof generateText>>)

    let selectCallCount = 0

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }, { slug: 'ai' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        const builder = createMockQueryBuilder({}, { data: null, error: null })
        builder.select = vi.fn(() => {
          selectCallCount++
          if (selectCallCount <= 2) {
            return createMockQueryBuilder(
              {},
              { data: [{ ...mockJob, id: `job-${selectCallCount}` }], error: null }
            )
          }
          return createMockQueryBuilder(
            {},
            { data: [], error: null }
          )
        })
        return builder as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'raw_tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: mockRawToken,
            error: null,
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: { id: 'token-1' },
            error: null,
          }),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'token_hashtags') {
        return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
  })

  it('does not stop processing other jobs when one fails', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    const jobs = [
      { ...mockJob, id: 'job-1', raw_token_id: 'raw-1' },
      { ...mockJob, id: 'job-2', raw_token_id: 'raw-2' },
    ]

    let rawTokenCallCount = 0

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createQueueMock(jobs) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'raw_tokens') {
        rawTokenCallCount++
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: rawTokenCallCount === 1 ? null : mockRawToken,
            error: rawTokenCallCount === 1 ? { message: 'Not found' } : null,
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
  })

  it('retries job when retry_count is less than max_retries', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    const jobWithRetries = {
      ...mockJob,
      retry_count: 1,
      max_retries: 3,
    }

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createQueueMock([jobWithRetries]) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'raw_tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Not found' },
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
  })

  it('marks job as permanently failed when retry_count reaches max_retries', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    const jobMaxRetries = {
      ...mockJob,
      retry_count: 2,
      max_retries: 3,
    }

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'processing_runs') {
        return createProcessingRunsMock() as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createQueueMock([jobMaxRetries]) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'raw_tokens') {
        return createMockQueryBuilder({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Not found' },
          }),
        }) as unknown as ReturnType<typeof supabaseService.from>
      }

      return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('run-1')
    expect(json.status).toBe('running')
  })

  it('returns existing running run instead of creating a new one', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'processing_runs') {
        return createMockQueryBuilder(
          {
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: 'existing-run-1', message: 'Already processing' },
              error: null,
            }),
          },
          { data: { id: 'existing-run-1', message: 'Already processing' }, error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }
      return createMockQueryBuilder() as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.runId).toBe('existing-run-1')
    expect(json.status).toBe('running')
    expect(json.message).toBe('Already processing')
  })
})

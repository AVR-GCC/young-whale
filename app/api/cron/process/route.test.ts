import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GET } from './route'
import { supabaseService } from '@/lib/supabase/service'
import { generateText } from 'ai'
import { verifyCronRequest } from '@/lib/cron/verify'

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}))

vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: vi.fn(() => ({
    chat: vi.fn(() => 'mock-model'),
  })),
}))

vi.mock('ai', () => ({
  generateText: vi.fn(),
}))

vi.mock('@/lib/cron/verify', () => ({
  verifyCronRequest: vi.fn(),
}))

interface MockQueryBuilder {
  select: () => MockQueryBuilder
  insert: () => MockQueryBuilder
  update: () => MockQueryBuilder
  upsert: () => MockQueryBuilder
  eq: () => MockQueryBuilder
  in: () => MockQueryBuilder
  or: () => MockQueryBuilder
  limit: () => MockQueryBuilder
  maybeSingle: () => Promise<{ data: unknown; error: null }>
  single: () => Promise<{ data: unknown; error: null }>
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
    eq: vi.fn(() => builder),
    in: vi.fn(() => builder),
    or: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    maybeSingle: overrides.maybeSingle ?? vi.fn().mockResolvedValue({ data: null, error: null }),
    single: overrides.single ?? vi.fn().mockResolvedValue({ data: null, error: null }),
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
  return new Request('http://localhost/api/cron/process', { headers })
}

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
  hashtags: ['defi', 'ai'],
  short_description: 'A test token',
  full_description: 'This is a test token for testing purposes.',
  confidence: 'high',
}

describe('GET /api/cron/process', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('FIREWORKS_API_KEY', 'test-fireworks-key')
    vi.stubEnv('CRON_SECRET', 'test-cron-secret')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns 401 when not in development and Authorization header is invalid', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(false)

    const response = await GET(createRequest('Bearer wrong-secret'))
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.error).toBe('Unauthorized')
  })

  it('bypasses auth check in development mode', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.mocked(verifyCronRequest).mockReturnValue(false)

    let callCount = 0
    vi.mocked(supabaseService.from).mockImplementation(() => {
      callCount++
      if (callCount === 1) {
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
    expect(json.processed).toBe(0)
    expect(json.failed).toBe(0)
  })

  it('returns 500 when fetching hashtags fails', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    vi.mocked(supabaseService.from).mockImplementation(() =>
      createMockQueryBuilder(
        {},
        { data: null, error: { message: 'DB error' } }
      ) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Database error fetching hashtags')
  })

  it('returns 500 when picking up jobs fails', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    let callCount = 0
    vi.mocked(supabaseService.from).mockImplementation(() => {
      callCount++
      if (callCount === 1) {
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

    expect(response.status).toBe(500)
    expect(json.error).toBe('Database error picking up jobs')
  })

  it('returns empty counts when no jobs in queue', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    let callCount = 0
    vi.mocked(supabaseService.from).mockImplementation(() => {
      callCount++
      if (callCount === 1) {
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
    expect(json.processed).toBe(0)
    expect(json.failed).toBe(0)
  })

  it('processes a job successfully end-to-end', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)
    vi.mocked(generateText).mockResolvedValue({
      text: JSON.stringify(mockAIResult),
    } as unknown as Awaited<ReturnType<typeof generateText>>)

    let callCount = 0
    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      callCount++

      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }, { slug: 'ai' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        if (callCount === 2) {
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
    expect(json.processed).toBe(1)
    expect(json.failed).toBe(0)
  })

  it('marks job as failed when raw token is not found', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createMockQueryBuilder(
          {},
          { data: [mockJob], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
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
    expect(json.processed).toBe(0)
    expect(json.failed).toBe(1)
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
      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }, { slug: 'ai' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createMockQueryBuilder(
          {},
          { data: [mockJob], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
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
    expect(json.processed).toBe(0)
    expect(json.failed).toBe(1)
  })

  it('marks job as failed when AI call throws', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)
    vi.mocked(generateText).mockRejectedValue(new Error('AI API error'))

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createMockQueryBuilder(
          {},
          { data: [mockJob], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
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
    expect(json.processed).toBe(0)
    expect(json.failed).toBe(1)
  })

  it('handles missing required fields (name, symbol, chain)', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createMockQueryBuilder(
          {},
          { data: [mockJob], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
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
    expect(json.processed).toBe(0)
    expect(json.failed).toBe(1)
  })

  it('processes multiple batches until queue is empty', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)
    vi.mocked(generateText).mockResolvedValue({
      text: JSON.stringify(mockAIResult),
    } as unknown as Awaited<ReturnType<typeof generateText>>)

    let selectCallCount = 0

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
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
    expect(json.processed).toBe(2)
    expect(json.failed).toBe(0)
  })

  it('does not stop processing other jobs when one fails', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    const jobs = [
      { ...mockJob, id: 'job-1', raw_token_id: 'raw-1' },
      { ...mockJob, id: 'job-2', raw_token_id: 'raw-2' },
    ]

    let rawTokenCallCount = 0

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createMockQueryBuilder(
          {},
          { data: jobs, error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
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
    expect(json.processed).toBe(0)
    expect(json.failed).toBe(2)
  })

  it('retries job when retry_count is less than max_retries', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    const jobWithRetries = {
      ...mockJob,
      retry_count: 1,
      max_retries: 3,
    }

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createMockQueryBuilder(
          {},
          { data: [jobWithRetries], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
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
    expect(json.processed).toBe(0)
    expect(json.failed).toBe(1)
  })

  it('marks job as permanently failed when retry_count reaches max_retries', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    const jobMaxRetries = {
      ...mockJob,
      retry_count: 2,
      max_retries: 3,
    }

    vi.mocked(supabaseService.from).mockImplementation((table: string) => {
      if (table === 'hashtags') {
        return createMockQueryBuilder(
          {},
          { data: [{ slug: 'defi' }], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
      }

      if (table === 'processing_queue') {
        return createMockQueryBuilder(
          {},
          { data: [jobMaxRetries], error: null }
        ) as unknown as ReturnType<typeof supabaseService.from>
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
    expect(json.processed).toBe(0)
    expect(json.failed).toBe(1)
  })
})

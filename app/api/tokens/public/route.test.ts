import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from './route'
import { supabaseService } from '@/lib/supabase/service'

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(),
  },
}))

type QueryResult = {
  data: unknown[] | null
  error: { message: string } | null
}

interface MockQueryBuilder {
  select: () => MockQueryBuilder
  not: () => MockQueryBuilder
  eq: () => MockQueryBuilder
  or: () => MockQueryBuilder
  order: () => MockQueryBuilder
  limit: () => MockQueryBuilder
}

function createMockQueryBuilder(result: QueryResult): MockQueryBuilder & PromiseLike<QueryResult> {
  const builder = {
    select: vi.fn(() => builder),
    not: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    or: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    then: (onfulfilled?: (value: QueryResult) => unknown) => Promise.resolve(result).then(onfulfilled),
  }
  return builder as MockQueryBuilder & PromiseLike<QueryResult>
}

function asQueryBuilder(builder: MockQueryBuilder & PromiseLike<QueryResult>) {
  return builder as unknown as ReturnType<typeof supabaseService.from>
}

const categories = ['Tech', 'Meme', 'RWA', 'Presale'] as const
type Category = (typeof categories)[number]

function makeToken(category: Category, index: number, publishedAt?: string) {
  return {
    id: `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
    name: `${category} ${index}`,
    category,
    published_at: publishedAt ?? new Date(Date.UTC(2026, 0, 1, 0, 0, -index)).toISOString(),
    token_hashtags: [
      {
        hashtags: {
          id: `hashtag-${index}`,
          name: 'defi',
          slug: 'defi',
          is_active: true,
          created_at: '2026-01-01T00:00:00.000Z',
        },
      },
    ],
  }
}

function mockBuilders(builders: (MockQueryBuilder & PromiseLike<QueryResult>)[]) {
  let index = 0
  vi.mocked(supabaseService.from).mockImplementation(() => asQueryBuilder(builders[index++]))
}

describe('GET /api/tokens/public', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches an independent latest page for every category', async () => {
    const builders = categories.map((category, index) => createMockQueryBuilder({
      data: [makeToken(category, index + 1)],
      error: null,
    }))
    mockBuilders(builders)

    const response = await GET(new Request('http://localhost/api/tokens/public'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.tokens.map((token: { category: string }) => token.category)).toEqual(categories)
    expect(json.nextCursors).toEqual({ Tech: null, Meme: null, RWA: null, Presale: null })
    builders.forEach((builder, index) => {
      expect(builder.eq).toHaveBeenCalledWith('category', categories[index])
      expect(builder.limit).toHaveBeenCalledWith(51)
      expect(builder.order).toHaveBeenCalledWith('published_at', { ascending: false })
      expect(builder.order).toHaveBeenCalledWith('id', { ascending: false })
    })
  })

  it('caps each category independently and returns a cursor when more rows exist', async () => {
    const builders = [
      createMockQueryBuilder({ data: Array.from({ length: 51 }, (_, index) => makeToken('Tech', index + 1)), error: null }),
      createMockQueryBuilder({ data: [], error: null }),
      createMockQueryBuilder({ data: [], error: null }),
      createMockQueryBuilder({ data: [], error: null }),
    ]
    mockBuilders(builders)

    const response = await GET(new Request('http://localhost/api/tokens/public'))
    const json = await response.json()

    expect(json.tokens).toHaveLength(50)
    expect(json.nextCursors.Tech).toEqual(expect.any(String))
    expect(json.nextCursors.Meme).toBeNull()
    expect(json.nextCursors.RWA).toBeNull()
    expect(json.nextCursors.Presale).toBeNull()
  })

  it('uses the published_at and id cursor for the next category page', async () => {
    const firstBuilder = createMockQueryBuilder({
      data: [makeToken('Tech', 1), makeToken('Tech', 2), makeToken('Tech', 3)],
      error: null,
    })
    vi.mocked(supabaseService.from).mockReturnValueOnce(asQueryBuilder(firstBuilder))

    const firstResponse = await GET(new Request('http://localhost/api/tokens/public?category=Tech&limit=2'))
    const firstJson = await firstResponse.json()
    const cursorToken = firstJson.tokens[1]

    expect(firstJson.tokens).toHaveLength(2)
    expect(firstJson.nextCursor).toEqual(expect.any(String))
    expect(firstBuilder.limit).toHaveBeenCalledWith(3)

    const secondBuilder = createMockQueryBuilder({ data: [makeToken('Tech', 4)], error: null })
    vi.mocked(supabaseService.from).mockReturnValueOnce(asQueryBuilder(secondBuilder))

    const secondResponse = await GET(new Request(
      `http://localhost/api/tokens/public?category=Tech&limit=2&cursor=${encodeURIComponent(firstJson.nextCursor)}`
    ))
    const secondJson = await secondResponse.json()

    expect(secondResponse.status).toBe(200)
    expect(secondJson.tokens).toHaveLength(1)
    expect(secondJson.nextCursor).toBeNull()
    expect(secondBuilder.or).toHaveBeenCalledWith(
      `published_at.lt.${cursorToken.published_at},and(published_at.eq.${cursorToken.published_at},id.lt.${cursorToken.id})`
    )
  })

  it('rejects invalid pagination parameters', async () => {
    const urls = [
      'http://localhost/api/tokens/public?category=Unknown',
      'http://localhost/api/tokens/public?category=Tech&cursor=invalid',
      'http://localhost/api/tokens/public?cursor=invalid',
      'http://localhost/api/tokens/public?limit=51',
    ]

    for (const url of urls) {
      const response = await GET(new Request(url))
      expect(response.status).toBe(400)
    }
    expect(supabaseService.from).not.toHaveBeenCalled()
  })

  it('returns database errors', async () => {
    mockBuilders([createMockQueryBuilder({ data: null, error: { message: 'Database unavailable' } })])

    const response = await GET(new Request('http://localhost/api/tokens/public?category=Tech'))
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Database unavailable')
  })
})

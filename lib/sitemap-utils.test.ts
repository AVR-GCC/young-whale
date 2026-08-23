import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getLastPublishedAt } from './sitemap-utils'
import { supabaseService } from './supabase/service'

vi.mock('./supabase/service', () => ({
  supabaseService: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        not: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              single: vi.fn(),
            })),
          })),
        })),
      })),
    })),
  },
}))

function mockSingle(response: { data: unknown; error: unknown }) {
  const singleMock = vi.fn().mockResolvedValue(response)
  vi.mocked(supabaseService.from).mockReturnValue({
    select: vi.fn(() => ({
      not: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => ({
            single: singleMock,
          })),
        })),
      })),
    })),
  } as unknown as ReturnType<typeof supabaseService.from>)
  return singleMock
}

describe('getLastPublishedAt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns date when token exists', async () => {
    mockSingle({ data: { published_at: '2024-01-15T14:30:00Z' }, error: null })

    const result = await getLastPublishedAt()

    expect(result).toBeInstanceOf(Date)
    expect(result?.toISOString()).toBe('2024-01-15T14:30:00.000Z')
  })

  it('returns null when no tokens found', async () => {
    mockSingle({ data: null, error: { message: 'No tokens found' } })

    const result = await getLastPublishedAt()

    expect(result).toBeNull()
  })

  it('returns null when error occurs', async () => {
    mockSingle({ data: null, error: { message: 'Database error' } })

    const result = await getLastPublishedAt()

    expect(result).toBeNull()
  })
})

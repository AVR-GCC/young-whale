import { describe, it, expect, vi, beforeEach } from 'vitest'
import sitemap from './sitemap'
import { supabaseService } from '@/lib/supabase/service'
import { getLastPublishedAt } from '@/lib/sitemap-utils'

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        not: vi.fn(() => Promise.resolve({ count: 0, error: null })),
      })),
    })),
  },
}))

vi.mock('@/lib/sitemap-utils', () => ({
  getLastPublishedAt: vi.fn(),
}))

function mockCountSelect(response: { count: number | null; error: unknown }) {
  vi.mocked(supabaseService.from).mockReturnValue({
    select: vi.fn(() => ({
      not: vi.fn(() => Promise.resolve(response)),
    })),
  } as unknown as ReturnType<typeof supabaseService.from>)
}

describe('pages sitemap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns paginated pages with YMYL timestamp', async () => {
    const mockDate = new Date('2024-01-15T14:30:00Z')
    vi.mocked(getLastPublishedAt).mockResolvedValue(mockDate)

    // 45 tokens = 3 pages total, so 3 paginated pages (page 1, 2, and 3)
    mockCountSelect({ count: 45, error: null })

    const result = await sitemap()

    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({
      url: 'https://youngwhale.io/page/1',
      lastModified: mockDate,
      changeFrequency: 'daily',
      priority: 0.4,
    })
    expect(result[1]).toEqual({
      url: 'https://youngwhale.io/page/2',
      lastModified: mockDate,
      changeFrequency: 'daily',
      priority: 0.4,
    })
    expect(result[2]).toEqual({
      url: 'https://youngwhale.io/page/3',
      lastModified: mockDate,
      changeFrequency: 'daily',
      priority: 0.4,
    })
  })

  it('returns 1 page when only 1 page exists', async () => {
    const mockDate = new Date('2024-01-15T14:30:00Z')
    vi.mocked(getLastPublishedAt).mockResolvedValue(mockDate)

    // 15 tokens = 1 page
    mockCountSelect({ count: 15, error: null })

    const result = await sitemap()

    expect(result).toHaveLength(1)
    expect(result[0].url).toBe('https://youngwhale.io/page/1')
  })

  it('returns empty array when no tokens exist', async () => {
    const mockDate = new Date('2024-01-15T14:30:00Z')
    vi.mocked(getLastPublishedAt).mockResolvedValue(mockDate)

    mockCountSelect({ count: 0, error: null })

    const result = await sitemap()

    expect(result).toHaveLength(0)
  })

  it('uses current date when YMYL timestamp is null', async () => {
    vi.mocked(getLastPublishedAt).mockResolvedValue(null)

    mockCountSelect({ count: 45, error: null })

    const result = await sitemap()

    expect(result[0].lastModified).toBeInstanceOf(Date)
    expect(result[0].url).toBe('https://youngwhale.io/page/1')
  })
})

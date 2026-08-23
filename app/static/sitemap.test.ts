import { describe, it, expect, vi, beforeEach } from 'vitest'
import sitemap from './sitemap'
import { getLastPublishedAt } from '@/lib/sitemap-utils'

vi.mock('@/lib/sitemap-utils', () => ({
  getLastPublishedAt: vi.fn(),
}))

describe('static sitemap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns static pages with YMYL timestamp', async () => {
    const mockDate = new Date('2024-01-15T14:30:00Z')
    vi.mocked(getLastPublishedAt).mockResolvedValue(mockDate)

    const result = await sitemap()

    expect(result).toHaveLength(5)
    expect(result[0]).toEqual({
      url: 'https://youngwhale.io',
      lastModified: mockDate,
      changeFrequency: 'hourly',
      priority: 1.0,
    })
    expect(result[1]).toEqual({
      url: 'https://youngwhale.io/legal',
      lastModified: mockDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    })
    expect(result[2]).toEqual({
      url: 'https://youngwhale.io/privacy',
      lastModified: mockDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    })
    expect(result[3]).toEqual({
      url: 'https://youngwhale.io/terms',
      lastModified: mockDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    })
    expect(result[4]).toEqual({
      url: 'https://youngwhale.io/login',
      lastModified: mockDate,
      changeFrequency: 'monthly',
      priority: 0.2,
    })
  })

  it('uses current date when YMYL timestamp is null', async () => {
    vi.mocked(getLastPublishedAt).mockResolvedValue(null)

    const result = await sitemap()

    expect(result[0].lastModified).toBeInstanceOf(Date)
    expect(result[0].url).toBe('https://youngwhale.io')
  })
})

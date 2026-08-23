import { describe, it, expect, vi, beforeEach } from 'vitest'
import sitemap from './sitemap'
import { supabaseService } from '@/lib/supabase/service'
import { getLastPublishedAt } from '@/lib/sitemap-utils'

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
  },
}))

vi.mock('@/lib/sitemap-utils', () => ({
  getLastPublishedAt: vi.fn(),
}))

function mockTokensSelect(response: { data: unknown; error: unknown }) {
  vi.mocked(supabaseService.from).mockReturnValue({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve(response)),
      })),
    })),
  } as unknown as ReturnType<typeof supabaseService.from>)
}

describe('tokens sitemap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns token pages with YMYL timestamp', async () => {
    const mockDate = new Date('2024-01-15T14:30:00Z')
    vi.mocked(getLastPublishedAt).mockResolvedValue(mockDate)

    mockTokensSelect({
      data: [
        { symbol: 'BTC' },
        { symbol: 'ETH' },
        { symbol: 'SOL' },
      ],
      error: null,
    })

    const result = await sitemap()

    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({
      url: 'https://youngwhale.io/token/btc',
      lastModified: mockDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    })
    expect(result[1]).toEqual({
      url: 'https://youngwhale.io/token/eth',
      lastModified: mockDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    })
    expect(result[2]).toEqual({
      url: 'https://youngwhale.io/token/sol',
      lastModified: mockDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  })

  it('returns empty array when no tokens', async () => {
    const mockDate = new Date('2024-01-15T14:30:00Z')
    vi.mocked(getLastPublishedAt).mockResolvedValue(mockDate)

    mockTokensSelect({
      data: [],
      error: null,
    })

    const result = await sitemap()

    expect(result).toHaveLength(0)
  })

  it('uses current date when YMYL timestamp is null', async () => {
    vi.mocked(getLastPublishedAt).mockResolvedValue(null)

    mockTokensSelect({
      data: [{ symbol: 'BTC' }],
      error: null,
    })

    const result = await sitemap()

    expect(result[0].lastModified).toBeInstanceOf(Date)
    expect(result[0].url).toBe('https://youngwhale.io/token/btc')
  })
})

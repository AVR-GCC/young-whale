import { describe, it, expect, vi } from 'vitest'
import { getAllApprovedTokens } from './data'
import { supabaseService } from '@/lib/supabase/service'
import type { TokenWithHashtags } from '@/shared/types'

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            then: vi.fn((callback: (value: unknown) => unknown) => callback({ data: [], error: null })),
          })),
        })),
      })),
    })),
  },
}))

const mockToken: TokenWithHashtags = {
  id: '1',
  name: 'TestToken',
  symbol: 'TEST',
  chain: 'Ethereum',
  contract_address: '0x123',
  unique_key: 'test-eth',
  slug: 'testtoken',
  category: 'Tech',
  short_description: 'A test token',
  full_description: 'Full description',
  logo_url: null,
  logo_storage_path: null,
  website_url: null,
  social_links: {},
  exchange_links: [],
  preferred_exchange: null,
  start_date: null,
  end_date: null,
  source_type: null,
  source_url: null,
  confidence: null,
  raw_token_id: null,
  status: 'approved',
  is_promoted: false,
  is_verified: false,
  main_hashtag: null,
  rating: 0,
  supply: 1000000,
  created_at: '2024-06-10T10:00:00Z',
  updated_at: '2024-06-10T10:00:00Z',
  hashtags: [],
}

const mockToken2: TokenWithHashtags = {
  ...mockToken,
  id: '2',
  name: 'MemeToken',
  category: 'Meme',
  created_at: '2024-06-11T10:00:00Z',
  updated_at: '2024-06-11T10:00:00Z',
}

const mockToken3: TokenWithHashtags = {
  ...mockToken,
  id: '3',
  name: 'AnotherTech',
  category: 'Tech',
  created_at: '2024-06-09T10:00:00Z',
  updated_at: '2024-06-09T10:00:00Z',
}

describe('getAllApprovedTokens', () => {
  it('fetches approved tokens from supabase', async () => {
    const mockData = [mockToken, mockToken2, mockToken3]
    
    vi.mocked(supabaseService.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      }),
    } as never)

    const tokens = await getAllApprovedTokens()
    expect(tokens).toHaveLength(3)
  })

  it('throws error when supabase returns error', async () => {
    vi.mocked(supabaseService.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
        }),
      }),
    } as never)

    await expect(getAllApprovedTokens()).rejects.toThrow('Failed to fetch tokens: Database error')
  })

  it('returns empty array when no data', async () => {
    vi.mocked(supabaseService.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    } as never)

    const tokens = await getAllApprovedTokens()
    expect(tokens).toHaveLength(0)
  })

  it('maps hashtags correctly from token_hashtags join', async () => {
    const tokenWithHashtags = {
      ...mockToken,
      token_hashtags: [
        { hashtags: { id: '1', name: 'DeFi', slug: 'defi' } },
        { hashtags: { id: '2', name: 'AI', slug: 'ai' } },
      ],
    }

    vi.mocked(supabaseService.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [tokenWithHashtags], error: null }),
        }),
      }),
    } as never)

    const tokens = await getAllApprovedTokens()
    expect(tokens[0].hashtags).toHaveLength(2)
    expect(tokens[0].hashtags[0].name).toBe('DeFi')
    expect(tokens[0].hashtags[1].name).toBe('AI')
  })

  it('handles tokens without hashtags', async () => {
    const tokenWithoutHashtags = {
      ...mockToken,
      token_hashtags: undefined,
    }

    vi.mocked(supabaseService.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [tokenWithoutHashtags], error: null }),
        }),
      }),
    } as never)

    const tokens = await getAllApprovedTokens()
    expect(tokens[0].hashtags).toHaveLength(0)
  })
})

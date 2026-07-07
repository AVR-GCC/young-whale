import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GET } from './route'
import { supabaseService } from '@/lib/supabase/service'
import { verifyCronRequest } from '@/lib/cron/verify'

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(() => ({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
    })),
  },
}))

vi.mock('@/lib/cron/verify', () => ({
  verifyCronRequest: vi.fn(),
}))

function createRequest(authHeader?: string): Request {
  const headers: Record<string, string> = {}
  if (authHeader) {
    headers.Authorization = authHeader
  }
  return new Request('http://localhost/api/cron/publish', { headers })
}

describe('GET /api/cron/publish', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('NODE_ENV', 'production')
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

    const mockSelect = vi.fn().mockResolvedValue({ data: [{ id: 'token-1' }], error: null })
    const mockIs = vi.fn(() => ({ select: mockSelect }))
    const mockEq = vi.fn(() => ({ is: mockIs }))
    const mockUpdate = vi.fn(() => ({ eq: mockEq }))

    vi.mocked(supabaseService.from).mockReturnValue({
      update: mockUpdate,
    } as unknown as ReturnType<typeof supabaseService.from>)

    const response = await GET(createRequest())
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.published).toBe(1)
    expect(json.message).toBe('Published 1 token(s)')
  })

  it('publishes approved tokens with null published_at', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    const mockSelect = vi.fn().mockResolvedValue({
      data: [{ id: 'token-1' }, { id: 'token-2' }],
      error: null,
    })
    const mockIs = vi.fn(() => ({ select: mockSelect }))
    const mockEq = vi.fn(() => ({ is: mockIs }))
    const mockUpdate = vi.fn(() => ({ eq: mockEq }))

    vi.mocked(supabaseService.from).mockReturnValue({
      update: mockUpdate,
    } as unknown as ReturnType<typeof supabaseService.from>)

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.published).toBe(2)
    expect(json.message).toBe('Published 2 token(s)')

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ published_at: expect.any(String) })
    )
    expect(mockEq).toHaveBeenCalledWith('status', 'approved')
    expect(mockIs).toHaveBeenCalledWith('published_at', null)
  })

  it('returns 0 when no tokens need publishing', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    const mockSelect = vi.fn().mockResolvedValue({ data: [], error: null })
    const mockIs = vi.fn(() => ({ select: mockSelect }))
    const mockEq = vi.fn(() => ({ is: mockIs }))
    const mockUpdate = vi.fn(() => ({ eq: mockEq }))

    vi.mocked(supabaseService.from).mockReturnValue({
      update: mockUpdate,
    } as unknown as ReturnType<typeof supabaseService.from>)

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.published).toBe(0)
    expect(json.message).toBe('Published 0 token(s)')
  })

  it('returns 500 on database error', async () => {
    vi.mocked(verifyCronRequest).mockReturnValue(true)

    const mockSelect = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } })
    const mockIs = vi.fn(() => ({ select: mockSelect }))
    const mockEq = vi.fn(() => ({ is: mockIs }))
    const mockUpdate = vi.fn(() => ({ eq: mockEq }))

    vi.mocked(supabaseService.from).mockReturnValue({
      update: mockUpdate,
    } as unknown as ReturnType<typeof supabaseService.from>)

    const response = await GET(createRequest('Bearer test-cron-secret'))
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('DB error')
  })
})

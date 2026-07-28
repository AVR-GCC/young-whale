import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET as GET_UNREAD } from './unread/route'
import { GET as GET_READ } from './read/route'
import { PATCH } from './[id]/read/route'
import { supabaseService } from '@/lib/supabase/service'

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(),
  },
}))

function createMockQueryBuilder(
  finalResolution: { data: unknown; error: unknown; count?: number } = { data: null, error: null }
) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => builder),
    range: vi.fn(() => builder),
    update: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve(finalResolution)),
    then: (onfulfilled?: (value: { data: unknown; error: unknown; count?: number }) => unknown) =>
      Promise.resolve(finalResolution).then(onfulfilled),
  }
  return builder
}

const mockMessage = {
  id: 'msg-1',
  name: 'John Doe',
  email: 'john@example.com',
  content: 'Hello world',
  is_read: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

function createRequest(url: string): Request {
  return new Request(`http://localhost${url}`)
}

describe('GET /api/admin/messages/unread', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns paginated unread messages', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: [mockMessage],
        error: null,
        count: 1,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET_UNREAD(createRequest('/api/admin/messages/unread?page=1&pageSize=25'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.messages).toHaveLength(1)
    expect(json.messages[0].id).toBe('msg-1')
    expect(json.pagination.total).toBe(1)
    expect(json.pagination.page).toBe(1)
  })

  it('returns empty list when no unread messages exist', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: [],
        error: null,
        count: 0,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET_UNREAD(createRequest('/api/admin/messages/unread'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.messages).toHaveLength(0)
    expect(json.pagination.total).toBe(0)
  })

  it('handles database errors', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: null,
        error: { message: 'Database connection failed' },
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET_UNREAD(createRequest('/api/admin/messages/unread'))
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Database connection failed')
  })
})

describe('GET /api/admin/messages/read', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns paginated read messages', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: [{ ...mockMessage, is_read: true }],
        error: null,
        count: 1,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET_READ(createRequest('/api/admin/messages/read?page=1&pageSize=25'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.messages).toHaveLength(1)
    expect(json.messages[0].is_read).toBe(true)
    expect(json.pagination.total).toBe(1)
  })

  it('returns empty list when no read messages exist', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: [],
        error: null,
        count: 0,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const response = await GET_READ(createRequest('/api/admin/messages/read'))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.messages).toHaveLength(0)
    expect(json.pagination.total).toBe(0)
  })
})

describe('PATCH /api/admin/messages/[id]/read', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('marks a message as read', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: { ...mockMessage, is_read: true },
        error: null,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const request = new Request('http://localhost/api/admin/messages/msg-1/read', {
      method: 'PATCH',
    })

    const response = await PATCH(request, { params: Promise.resolve({ id: 'msg-1' }) })
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.message).toBe('Message marked as read')
    expect(json.data.is_read).toBe(true)
  })

  it('returns 404 when message not found', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: null,
        error: null,
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const request = new Request('http://localhost/api/admin/messages/msg-1/read', {
      method: 'PATCH',
    })

    const response = await PATCH(request, { params: Promise.resolve({ id: 'msg-1' }) })
    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.error).toBe('Message not found')
  })

  it('handles database errors', async () => {
    vi.mocked(supabaseService.from).mockReturnValue(
      createMockQueryBuilder({
        data: null,
        error: { message: 'Database connection failed' },
      }) as unknown as ReturnType<typeof supabaseService.from>
    )

    const request = new Request('http://localhost/api/admin/messages/msg-1/read', {
      method: 'PATCH',
    })

    const response = await PATCH(request, { params: Promise.resolve({ id: 'msg-1' }) })
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Database connection failed')
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'
import { supabaseService } from '@/lib/supabase/service'

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(),
  },
}))

function createMockBuilder(result: { data: unknown; error: unknown }) {
  const builder = {
    select: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve(result)),
  }
  return builder
}

function createRequest(body: unknown): Request {
  return new Request('http://localhost/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/messages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 when name is missing', async () => {
    const response = await POST(createRequest({ email: 'test@example.com', content: 'Hello' }))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('Missing required fields: name, email, content')
  })

  it('returns 400 when email is missing', async () => {
    const response = await POST(createRequest({ name: 'John', content: 'Hello' }))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('Missing required fields: name, email, content')
  })

  it('returns 400 when content is missing', async () => {
    const response = await POST(createRequest({ name: 'John', email: 'test@example.com' }))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('Missing required fields: name, email, content')
  })

  it('returns 400 for invalid email', async () => {
    const response = await POST(createRequest({ name: 'John', email: 'invalid-email', content: 'Hello' }))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('Invalid email address')
  })

  it('creates a new message successfully', async () => {
    const builder = createMockBuilder({
      data: { id: 'msg-1', name: 'John', email: 'test@example.com', content: 'Hello', is_read: false },
      error: null,
    })

    vi.mocked(supabaseService.from).mockReturnValue(builder as unknown as ReturnType<typeof supabaseService.from>)

    const response = await POST(createRequest({ name: 'John', email: 'test@example.com', content: 'Hello' }))
    const json = await response.json()

    expect(response.status).toBe(201)
    expect(json.success).toBe(true)
    expect(json.message).toBe('Message sent successfully')
    expect(json.id).toBe('msg-1')
  })

  it('returns 500 on database error', async () => {
    const builder = createMockBuilder({
      data: null,
      error: { message: 'Database connection failed' },
    })

    vi.mocked(supabaseService.from).mockReturnValue(builder as unknown as ReturnType<typeof supabaseService.from>)

    const response = await POST(createRequest({ name: 'John', email: 'test@example.com', content: 'Hello' }))
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Failed to send message')
  })
})

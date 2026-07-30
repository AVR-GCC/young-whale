import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'
import { supabaseService } from '@/lib/supabase/service'

// Create a mock builder that chains methods
function createMockBuilder(result: { data: unknown; error: unknown }) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve(result)),
  }
  return builder
}

vi.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: vi.fn(),
  },
}))

function createRequest(body: unknown): Request {
  return new Request('http://localhost/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 for invalid email', async () => {
    const response = await POST(createRequest({ email: 'invalid-email' }))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('Invalid email address')
  })

  it('returns 400 for missing email', async () => {
    const response = await POST(createRequest({}))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('Invalid email address')
  })

  it('creates new subscription for new email', async () => {
    // First call: check existing - no rows found (PGRST116)
    const checkBuilder = createMockBuilder({
      data: null,
      error: { code: 'PGRST116', message: 'No rows found' },
    })

    // Second call: insert new subscription
    const insertBuilder = createMockBuilder({
      data: { id: 'sub-1', email: 'test@example.com', is_active: true },
      error: null,
    })

    let callCount = 0
    vi.mocked(supabaseService.from).mockImplementation(() => {
      callCount++
      if (callCount === 1) return checkBuilder as unknown as ReturnType<typeof supabaseService.from>
      return insertBuilder as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await POST(createRequest({ email: 'test@example.com' }))
    const json = await response.json()

    expect(response.status).toBe(201)
    expect(json.success).toBe(true)
    expect(json.message).toBe('Subscribed successfully')
  })

  it('reactivates inactive subscription', async () => {
    const checkBuilder = createMockBuilder({
      data: { id: 'sub-1', email: 'test@example.com', is_active: false },
      error: null,
    })

    const updateBuilder = createMockBuilder({
      data: { id: 'sub-1', email: 'test@example.com', is_active: true },
      error: null,
    })

    let callCount = 0
    vi.mocked(supabaseService.from).mockImplementation(() => {
      callCount++
      if (callCount === 1) return checkBuilder as unknown as ReturnType<typeof supabaseService.from>
      return updateBuilder as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await POST(createRequest({ email: 'test@example.com' }))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.message).toBe('Subscription reactivated')
  })

  it('returns 200 for already active subscription', async () => {
    const builder = createMockBuilder({
      data: { id: 'sub-1', email: 'test@example.com', is_active: true },
      error: null,
    })

    vi.mocked(supabaseService.from).mockReturnValue(builder as unknown as ReturnType<typeof supabaseService.from>)

    const response = await POST(createRequest({ email: 'test@example.com' }))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.message).toBe('Already subscribed')
  })

  it('normalizes email to lowercase', async () => {
    const checkBuilder = createMockBuilder({
      data: null,
      error: { code: 'PGRST116', message: 'No rows found' },
    })

    const insertBuilder = {
      select: vi.fn(() => insertBuilder),
      eq: vi.fn(() => insertBuilder),
      insert: vi.fn((data: unknown) => {
        // Capture the insert data
        insertBuilder._insertedData = data
        return insertBuilder
      }),
      single: vi.fn(() => Promise.resolve({
        data: { id: 'sub-1', email: 'test@example.com', is_active: true },
        error: null,
      })),
      _insertedData: null as unknown,
    }

    let callCount = 0
    vi.mocked(supabaseService.from).mockImplementation(() => {
      callCount++
      if (callCount === 1) return checkBuilder as unknown as ReturnType<typeof supabaseService.from>
      return insertBuilder as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await POST(createRequest({ email: 'Test@Example.COM' }))
    await response.json()

    expect(response.status).toBe(201)
    expect(insertBuilder._insertedData).toEqual({ email: 'test@example.com', is_active: true })
  })

  it('returns 500 on database fetch error', async () => {
    const builder = createMockBuilder({
      data: null,
      error: { code: 'PGRST999', message: 'Database connection failed' },
    })

    vi.mocked(supabaseService.from).mockReturnValue(builder as unknown as ReturnType<typeof supabaseService.from>)

    const response = await POST(createRequest({ email: 'test@example.com' }))
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Failed to process subscription')
  })

  it('returns 500 on insert error', async () => {
    const checkBuilder = createMockBuilder({
      data: null,
      error: { code: 'PGRST116', message: 'No rows found' },
    })

    const insertBuilder = createMockBuilder({
      data: null,
      error: { code: 'PGRST999', message: 'Insert failed' },
    })

    let callCount = 0
    vi.mocked(supabaseService.from).mockImplementation(() => {
      callCount++
      if (callCount === 1) return checkBuilder as unknown as ReturnType<typeof supabaseService.from>
      return insertBuilder as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await POST(createRequest({ email: 'test@example.com' }))
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Failed to create subscription')
  })

  it('returns 500 on reactivate error', async () => {
    const checkBuilder = createMockBuilder({
      data: { id: 'sub-1', email: 'test@example.com', is_active: false },
      error: null,
    })

    const updateBuilder = createMockBuilder({
      data: null,
      error: { code: 'PGRST999', message: 'Update failed' },
    })

    let callCount = 0
    vi.mocked(supabaseService.from).mockImplementation(() => {
      callCount++
      if (callCount === 1) return checkBuilder as unknown as ReturnType<typeof supabaseService.from>
      return updateBuilder as unknown as ReturnType<typeof supabaseService.from>
    })

    const response = await POST(createRequest({ email: 'test@example.com' }))
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Failed to reactivate subscription')
  })
})

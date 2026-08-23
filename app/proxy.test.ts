import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { proxy } from '../proxy'

const mockSingle = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: mockSingle,
        })),
      })),
    })),
  })),
}))

describe('proxy', () => {
  beforeEach(() => {
    mockSingle.mockReset()
  })

  it('adds noindex, follow header to URLs with filter params', async () => {
    const request = new NextRequest('http://localhost:3000/?filter=tech')
    const response = await proxy(request)

    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, follow')
  })

  it('adds noindex, follow header to URLs with sort params', async () => {
    const request = new NextRequest('http://localhost:3000/?sort=score')
    const response = await proxy(request)

    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, follow')
  })

  it('adds noindex, follow header to URLs with search params', async () => {
    const request = new NextRequest('http://localhost:3000/?search=bitcoin')
    const response = await proxy(request)

    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, follow')
  })

  it('adds noindex, follow header to URLs with category params', async () => {
    const request = new NextRequest('http://localhost:3000/?category=meme')
    const response = await proxy(request)

    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, follow')
  })

  it('does not add noindex header to clean URLs without filter/sort params', async () => {
    const request = new NextRequest('http://localhost:3000/')
    const response = await proxy(request)

    expect(response.headers.get('X-Robots-Tag')).toBeNull()
  })

  it('does not add noindex header to token pages', async () => {
    mockSingle.mockResolvedValue({ data: { published_at: '2024-01-01' }, error: null })

    const request = new NextRequest('http://localhost:3000/token/bitcoin')
    const response = await proxy(request)

    expect(response.headers.get('X-Robots-Tag')).toBeNull()
  })

  it('does not add noindex header to paginated archive pages', async () => {
    const request = new NextRequest('http://localhost:3000/page/2')
    const response = await proxy(request)

    expect(response.headers.get('X-Robots-Tag')).toBeNull()
  })

  it('returns 410 Gone for delisted tokens (published_at is null)', async () => {
    mockSingle.mockResolvedValue({ data: { published_at: null }, error: null })

    const request = new NextRequest('http://localhost:3000/token/bitcoin')
    const response = await proxy(request)

    expect(response.status).toBe(410)
    expect(response.statusText).toBe('Gone')
  })

  it('returns 410 Gone for delisted tokens with lowercase slug', async () => {
    mockSingle.mockResolvedValue({ data: { published_at: null }, error: null })

    const request = new NextRequest('http://localhost:3000/token/bitcoin')
    await proxy(request)
  })

  it('continues normally for non-existent tokens (lets page handle 404)', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'No rows found' } })

    const request = new NextRequest('http://localhost:3000/token/faketoken')
    const response = await proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('X-Robots-Tag')).toBeNull()
  })

  it('continues normally for published tokens', async () => {
    mockSingle.mockResolvedValue({ data: { published_at: '2024-01-15T14:30:00Z' }, error: null })

    const request = new NextRequest('http://localhost:3000/token/bitcoin')
    const response = await proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('X-Robots-Tag')).toBeNull()
  })
})

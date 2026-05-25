import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import { verifyCronRequest } from './verify'

describe('verifyCronRequest', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('returns true when Authorization header matches CRON_SECRET', () => {
    process.env.CRON_SECRET = 'test-secret-123'
    const request = new Request('http://localhost', {
      headers: { Authorization: 'Bearer test-secret-123' },
    })

    expect(verifyCronRequest(request)).toBe(true)
  })

  it('returns false when Authorization header does not match CRON_SECRET', () => {
    process.env.CRON_SECRET = 'test-secret-123'
    const request = new Request('http://localhost', {
      headers: { Authorization: 'Bearer wrong-secret' },
    })

    expect(verifyCronRequest(request)).toBe(false)
  })

  it('returns false when Authorization header is missing', () => {
    process.env.CRON_SECRET = 'test-secret-123'
    const request = new Request('http://localhost')

    expect(verifyCronRequest(request)).toBe(false)
  })

  it('throws error when CRON_SECRET is not set', () => {
    delete process.env.CRON_SECRET
    const request = new Request('http://localhost', {
      headers: { Authorization: 'Bearer test-secret-123' },
    })

    expect(() => verifyCronRequest(request)).toThrow('CRON_SECRET is not set')
  })
})

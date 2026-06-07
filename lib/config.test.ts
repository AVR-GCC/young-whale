import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getConfig, getConfigString, getConfigNumber, getConfigBoolean } from './config'
import { supabaseService } from './supabase/service'

vi.mock('./supabase/service', () => ({
  supabaseService: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}))

function mockSingle(response: { data: unknown; error: unknown }) {
  const singleMock = vi.fn().mockResolvedValue(response)
  vi.mocked(supabaseService.from).mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: singleMock,
  } as unknown as ReturnType<typeof supabaseService.from>)
  return singleMock
}

describe('getConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns value when config exists', async () => {
    mockSingle({ data: { value: 'test-value' }, error: null })

    const result = await getConfig('test-key')

    expect(result).toBe('test-value')
    expect(supabaseService.from).toHaveBeenCalledWith('platform_config')
  })

  it('returns null when config is not found', async () => {
    mockSingle({ data: null, error: { message: 'Not found' } })

    const result = await getConfig('missing-key')

    expect(result).toBeNull()
  })

  it('returns null when error occurs', async () => {
    mockSingle({ data: null, error: { message: 'Database error' } })

    const result = await getConfig('error-key')

    expect(result).toBeNull()
  })
})

describe('getConfigString', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns string value as-is', async () => {
    mockSingle({ data: { value: 'hello' }, error: null })

    const result = await getConfigString('test-key')

    expect(result).toBe('hello')
  })

  it('returns null when config is missing', async () => {
    mockSingle({ data: null, error: { message: 'Not found' } })

    const result = await getConfigString('missing-key')

    expect(result).toBeNull()
  })

  it('stringifies non-string values', async () => {
    mockSingle({ data: { value: { foo: 'bar' } }, error: null })

    const result = await getConfigString('test-key')

    expect(result).toBe('{"foo":"bar"}')
  })
})

describe('getConfigNumber', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns number value as-is', async () => {
    mockSingle({ data: { value: 42 }, error: null })

    const result = await getConfigNumber('test-key')

    expect(result).toBe(42)
  })

  it('parses numeric string', async () => {
    mockSingle({ data: { value: '3.14' }, error: null })

    const result = await getConfigNumber('test-key')

    expect(result).toBe(3.14)
  })

  it('returns null for non-numeric string', async () => {
    mockSingle({ data: { value: 'not-a-number' }, error: null })

    const result = await getConfigNumber('test-key')

    expect(result).toBeNull()
  })

  it('returns null when config is missing', async () => {
    mockSingle({ data: null, error: { message: 'Not found' } })

    const result = await getConfigNumber('missing-key')

    expect(result).toBeNull()
  })
})

describe('getConfigBoolean', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns boolean value as-is', async () => {
    mockSingle({ data: { value: true }, error: null })

    const result = await getConfigBoolean('test-key')

    expect(result).toBe(true)
  })

  it('parses "true" string', async () => {
    mockSingle({ data: { value: 'true' }, error: null })

    const result = await getConfigBoolean('test-key')

    expect(result).toBe(true)
  })

  it('parses "TRUE" string', async () => {
    mockSingle({ data: { value: 'TRUE' }, error: null })

    const result = await getConfigBoolean('test-key')

    expect(result).toBe(true)
  })

  it('parses "false" string', async () => {
    mockSingle({ data: { value: 'false' }, error: null })

    const result = await getConfigBoolean('test-key')

    expect(result).toBe(false)
  })

  it('returns null for non-boolean value', async () => {
    mockSingle({ data: { value: 123 }, error: null })

    const result = await getConfigBoolean('test-key')

    expect(result).toBeNull()
  })

  it('returns null when config is missing', async () => {
    mockSingle({ data: null, error: { message: 'Not found' } })

    const result = await getConfigBoolean('missing-key')

    expect(result).toBeNull()
  })
})

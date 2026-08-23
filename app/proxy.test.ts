import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { proxy } from '../proxy'

describe('proxy', () => {
  it('adds noindex, follow header to URLs with filter params', () => {
    const request = new NextRequest('http://localhost:3000/?filter=tech')
    const response = proxy(request)

    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, follow')
  })

  it('adds noindex, follow header to URLs with sort params', () => {
    const request = new NextRequest('http://localhost:3000/?sort=score')
    const response = proxy(request)

    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, follow')
  })

  it('adds noindex, follow header to URLs with search params', () => {
    const request = new NextRequest('http://localhost:3000/?search=bitcoin')
    const response = proxy(request)

    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, follow')
  })

  it('adds noindex, follow header to URLs with category params', () => {
    const request = new NextRequest('http://localhost:3000/?category=meme')
    const response = proxy(request)

    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, follow')
  })

  it('does not add noindex header to clean URLs without filter/sort params', () => {
    const request = new NextRequest('http://localhost:3000/')
    const response = proxy(request)

    expect(response.headers.get('X-Robots-Tag')).toBeNull()
  })

  it('does not add noindex header to token pages', () => {
    const request = new NextRequest('http://localhost:3000/token/bitcoin')
    const response = proxy(request)

    expect(response.headers.get('X-Robots-Tag')).toBeNull()
  })

  it('does not add noindex header to paginated archive pages', () => {
    const request = new NextRequest('http://localhost:3000/page/2')
    const response = proxy(request)

    expect(response.headers.get('X-Robots-Tag')).toBeNull()
  })
})

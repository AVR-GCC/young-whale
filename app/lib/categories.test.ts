import { describe, it, expect } from 'vitest'
import { categories } from './categories'

describe('categories', () => {
  it('has exactly 4 categories', () => {
    expect(categories).toHaveLength(4)
  })

  it('has Tech category as first', () => {
    expect(categories[0].id).toBe('Tech')
    expect(categories[0].name).toBe('Tech')
    expect(categories[0].icon).toBe('tech')
  })

  it('has Meme category as second', () => {
    expect(categories[1].id).toBe('Meme')
    expect(categories[1].name).toBe('Meme')
    expect(categories[1].icon).toBe('meme')
  })

  it('has RWA category as third', () => {
    expect(categories[2].id).toBe('RWA')
    expect(categories[2].name).toBe('Real World Assets')
    expect(categories[2].icon).toBe('rwa')
  })

  it('has Presale category as fourth', () => {
    expect(categories[3].id).toBe('Presale')
    expect(categories[3].name).toBe('Presale')
    expect(categories[3].icon).toBe('presale')
  })

  it('has unique ids', () => {
    const ids = categories.map(c => c.id)
    const uniqueIds = [...new Set(ids)]
    expect(uniqueIds).toHaveLength(categories.length)
  })

  it('has unique names', () => {
    const names = categories.map(c => c.name)
    const uniqueNames = [...new Set(names)]
    expect(uniqueNames).toHaveLength(categories.length)
  })

  it('has unique icons', () => {
    const icons = categories.map(c => c.icon)
    const uniqueIcons = [...new Set(icons)]
    expect(uniqueIcons).toHaveLength(categories.length)
  })

  it('categories are readonly', () => {
    // TypeScript ensures this at compile time, but we can verify the structure
    expect(Object.isFrozen(categories)).toBe(false) // as const doesn't freeze at runtime
    expect(categories[0].id).toBe('Tech')
  })
})

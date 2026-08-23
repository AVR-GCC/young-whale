import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home, { metadata } from './page'

vi.mock('./components/HomePageClient', () => ({
  default: () => <div data-testid="home-page-client">HomePageClient</div>,
}))

describe('Homepage SEO', () => {
  const EXPECTED_DESCRIPTION =
    'YoungWhale is your daily Crypto Intelligence Terminal for discovering the newest coins.'

  it('exports metadata with the exact homepage description', () => {
    expect(metadata.description).toBe(EXPECTED_DESCRIPTION)
    expect(metadata.openGraph?.description).toBe(EXPECTED_DESCRIPTION)
  })

  it('renders WebSite JSON-LD schema with the exact description', () => {
    render(<Home />)

    const script = document.querySelector('script[type="application/ld+json"]')
    expect(script).toBeTruthy()

    const jsonLd = JSON.parse(script!.textContent!)
    expect(jsonLd['@context']).toBe('https://schema.org')
    expect(jsonLd['@type']).toBe('WebSite')
    expect(jsonLd.name).toBe('Young Whale')
    expect(jsonLd.url).toBe('https://youngwhale.io/')
    expect(jsonLd.description).toBe(EXPECTED_DESCRIPTION)
  })

  it('renders the HomePageClient component', () => {
    render(<Home />)
    expect(screen.getByTestId('home-page-client')).toBeTruthy()
  })
})

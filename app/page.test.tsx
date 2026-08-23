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
    expect(Array.isArray(jsonLd['@graph'])).toBe(true)

    const webSite = jsonLd['@graph'].find((item: Record<string, unknown>) => item['@type'] === 'WebSite')
    expect(webSite).toBeTruthy()
    expect(webSite.name).toBe('Young Whale')
    expect(webSite.url).toBe('https://youngwhale.io/')
    expect(webSite.description).toBe(EXPECTED_DESCRIPTION)
  })

  it('renders SiteNavigationElement JSON-LD schema for main sections', () => {
    render(<Home />)

    const script = document.querySelector('script[type="application/ld+json"]')
    expect(script).toBeTruthy()

    const jsonLd = JSON.parse(script!.textContent!)
    const navElements = jsonLd['@graph'].filter((item: Record<string, unknown>) => item['@type'] === 'SiteNavigationElement')
    expect(navElements.length).toBeGreaterThan(0)

    const homeNav = navElements.find((item: Record<string, unknown>) => item.name === 'Home')
    expect(homeNav).toBeTruthy()
    expect(homeNav.url).toBe('https://youngwhale.io/')

    const techNav = navElements.find((item: Record<string, unknown>) => item.name === 'New Tech Projects')
    expect(techNav).toBeTruthy()
    expect(techNav.url).toBe('https://youngwhale.io/?category=tech')
  })

  it('renders the HomePageClient component', () => {
    render(<Home />)
    expect(screen.getByTestId('home-page-client')).toBeTruthy()
  })
})

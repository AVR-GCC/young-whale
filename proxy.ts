import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // Add noindex, follow to any URL with query parameters that indicate filtering or sorting
  const searchParams = request.nextUrl.searchParams
  const filterSortParams = ['filter', 'sort', 'order', 'category', 'search', 'q', 'tag', 'hashtag']

  const hasFilterOrSort = filterSortParams.some(param => searchParams.has(param))

  if (hasFilterOrSort) {
    response.headers.set('X-Robots-Tag', 'noindex, follow')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

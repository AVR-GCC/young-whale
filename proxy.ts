import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check for delisted tokens on token detail pages
  if (pathname.startsWith('/token/')) {
    const slug = pathname.split('/')[2]

    if (slug) {
      const { data, error } = await supabaseService
        .from('tokens')
        .select('published_at')
        .eq('symbol', slug.toUpperCase())
        .single()

      // Token exists but is not published (delisted) -> 410 Gone
      if (!error && data && data.published_at === null) {
        return new Response(
          '<html><body><h1>410 Gone</h1><p>This token has been delisted.</p></body></html>',
          {
            status: 410,
            statusText: 'Gone',
            headers: { 'Content-Type': 'text/html' },
          }
        )
      }
    }
  }

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

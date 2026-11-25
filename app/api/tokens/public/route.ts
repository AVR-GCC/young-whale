import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import type { TokenWithHashtags } from '@/shared/types'

export const revalidate = 60

const PUBLIC_CATEGORIES = ['Tech', 'Meme', 'RWA', 'Presale'] as const
const DEFAULT_PAGE_SIZE = 50
const MAX_PAGE_SIZE = 50
const PROMOTED_BATCH_SIZE = 1000
const TOKEN_SELECTION = `*,
  token_hashtags(
    hashtags(id, name, slug, is_active, created_at)
  )`
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/

type PublicCategory = (typeof PUBLIC_CATEGORIES)[number]
type NextCursors = Record<PublicCategory, string | null>
type TokenRow = TokenWithHashtags & {
  token_hashtags?: {
    hashtags: TokenWithHashtags['hashtags'][number]
  }[]
}
type Cursor = {
  publishedAt: string
  id: string
}

function isPublicCategory(value: string): value is PublicCategory {
  return PUBLIC_CATEGORIES.includes(value as PublicCategory)
}

function parsePageSize(value: string | null) {
  if (value === null) return DEFAULT_PAGE_SIZE
  const pageSize = Number(value)
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) return null
  return pageSize
}

function encodeCursor(token: TokenWithHashtags): string | null {
  if (!token.published_at) return null
  const cursor: Cursor = { publishedAt: token.published_at, id: token.id }
  return Buffer.from(JSON.stringify(cursor)).toString('base64url')
}

function decodeCursor(value: string): Cursor | null {
  try {
    const cursor = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as Partial<Cursor>
    if (
      typeof cursor.publishedAt !== 'string' ||
      !TIMESTAMP_PATTERN.test(cursor.publishedAt) ||
      Number.isNaN(Date.parse(cursor.publishedAt)) ||
      typeof cursor.id !== 'string' ||
      !UUID_PATTERN.test(cursor.id)
    ) {
      return null
    }
    return { publishedAt: cursor.publishedAt, id: cursor.id }
  } catch {
    return null
  }
}

function mapToken(token: TokenRow): TokenWithHashtags {
  return {
    ...token,
    hashtags: token.token_hashtags?.map((th) => th.hashtags) ?? [],
  }
}

function getCursorFilter(cursor: Cursor) {
  return `published_at.lt.${cursor.publishedAt},and(published_at.eq.${cursor.publishedAt},id.lt.${cursor.id})`
}

async function fetchCategoryPage(
  category: PublicCategory,
  cursor: Cursor | null,
  pageSize: number
) {
  let query = supabaseService
    .from('tokens')
    .select(TOKEN_SELECTION)
    .not('published_at', 'is', null)
    .eq('category', category)

  if (cursor) {
    query = query.or(getCursorFilter(cursor))
  }

  const { data, error } = await query
    .order('published_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(pageSize + 1)

  if (error) throw new Error(error.message)

  const rows = (data ?? []) as TokenRow[]
  const tokens = rows.slice(0, pageSize).map(mapToken)
  const lastToken = tokens.at(-1)

  return {
    tokens,
    nextCursor: rows.length > pageSize && lastToken ? encodeCursor(lastToken) : null,
  }
}

async function fetchPromotedTokens() {
  const tokens: TokenWithHashtags[] = []
  let cursor: Cursor | null = null

  while (true) {
    let query = supabaseService
      .from('tokens')
      .select(TOKEN_SELECTION)
      .not('published_at', 'is', null)
      .eq('is_promoted', true)

    if (cursor) {
      query = query.or(getCursorFilter(cursor))
    }

    const { data, error } = await query
      .order('published_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(PROMOTED_BATCH_SIZE)

    if (error) throw new Error(error.message)

    const page = ((data ?? []) as TokenRow[]).map(mapToken)
    tokens.push(...page)

    const lastToken = page.at(-1)
    if (page.length < PROMOTED_BATCH_SIZE || !lastToken) return tokens

    if (!lastToken.published_at) return tokens
    cursor = { publishedAt: lastToken.published_at, id: lastToken.id }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const cursorValue = searchParams.get('cursor')
    const pageSize = parsePageSize(searchParams.get('limit'))

    if (pageSize === null) {
      return NextResponse.json({ error: `limit must be between 1 and ${MAX_PAGE_SIZE}` }, { status: 400 })
    }

    if (category !== null && !isPublicCategory(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    if (cursorValue !== null && category === null) {
      return NextResponse.json({ error: 'cursor requires a category' }, { status: 400 })
    }

    const cursor = cursorValue === null ? null : decodeCursor(cursorValue)
    if (cursorValue !== null && cursor === null) {
      return NextResponse.json({ error: 'Invalid cursor' }, { status: 400 })
    }

    if (category !== null) {
      const page = await fetchCategoryPage(category, cursor, pageSize)
      return NextResponse.json(page)
    }

    const [pages, promotedTokens] = await Promise.all([
      Promise.all(
        PUBLIC_CATEGORIES.map((publicCategory) => fetchCategoryPage(publicCategory, null, pageSize))
      ),
      fetchPromotedTokens(),
    ])
    const nextCursors = Object.fromEntries(
      PUBLIC_CATEGORIES.map((publicCategory, index) => [publicCategory, pages[index].nextCursor])
    ) as NextCursors
    const tokensById = new Map(
      pages.flatMap((page) => page.tokens).map((token) => [token.id, token])
    )
    promotedTokens.forEach((token) => tokensById.set(token.id, token))

    return NextResponse.json({
      tokens: [...tokensById.values()],
      nextCursors,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Public tokens GET error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import type { Token, TokenStatus, TokenCategory, Confidence, SourceType } from '@/shared/types'

export const maxDuration = 60

interface TokenFilters {
  search?: string
  status?: TokenStatus[]
  category?: TokenCategory[]
  confidence?: Confidence[]
  chain?: string[]
  source_type?: SourceType[]
  created_after?: string
  created_before?: string
  has_issues?: boolean
  review_queue?: boolean
}

interface TokenSort {
  column: keyof Token | 'hashtags'
  direction: 'asc' | 'desc'
}

function buildTokenQuery(
  filters: TokenFilters,
  sort: TokenSort,
  page: number,
  pageSize: number
) {
  let query = supabaseService
    .from('tokens')
    .select(
      `*,
      token_hashtags(
        hashtags(id, name, slug)
      )`,
      { count: 'exact' }
    )

  if (filters.search) {
    const searchTerm = `%${filters.search}%`
    query = query.or(
      `name.ilike.${searchTerm},symbol.ilike.${searchTerm},contract_address.ilike.${searchTerm}`
    )
  }

  if (filters.status?.length) {
    query = query.in('status', filters.status)
  }

  if (filters.category?.length) {
    query = query.in('category', filters.category)
  }

  if (filters.confidence?.length) {
    query = query.in('confidence', filters.confidence)
  }

  if (filters.chain?.length) {
    query = query.in('chain', filters.chain)
  }

  if (filters.source_type?.length) {
    query = query.in('source_type', filters.source_type)
  }

  if (filters.created_after) {
    query = query.gte('created_at', filters.created_after)
  }

  if (filters.created_before) {
    query = query.lte('created_at', filters.created_before)
  }

  if (filters.has_issues) {
    query = query.or(
      'short_description.is.null,short_description.eq.,full_description.is.null,full_description.eq.,category.is.null,confidence.eq.low'
    )
  }

  if (filters.review_queue) {
    query = query.eq('status', 'pending_review').order('created_at', { ascending: true })
  } else {
    const ascending = sort.direction === 'asc'
    query = query.order(sort.column as string, { ascending })
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  return query
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') ?? '25', 10)))

    const filters: TokenFilters = {
      search: searchParams.get('search') ?? undefined,
      status: searchParams.getAll('status') as TokenStatus[],
      category: searchParams.getAll('category') as TokenCategory[],
      confidence: searchParams.getAll('confidence') as Confidence[],
      chain: searchParams.getAll('chain'),
      source_type: searchParams.getAll('source_type') as SourceType[],
      created_after: searchParams.get('created_after') ?? undefined,
      created_before: searchParams.get('created_before') ?? undefined,
      has_issues: searchParams.get('has_issues') === 'true',
      review_queue: searchParams.get('review_queue') === 'true',
    }

    const sort: TokenSort = {
      column: (searchParams.get('sortColumn') as keyof Token) ?? 'created_at',
      direction: (searchParams.get('sortDirection') as 'asc' | 'desc') ?? 'desc',
    }

    const { data, error, count } = await buildTokenQuery(filters, sort, page, pageSize)

    if (error) {
      console.error('Failed to fetch tokens:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const tokens = (data ?? []).map((token) => ({
      ...token,
      hashtags: token.token_hashtags?.map((th: { hashtags: { id: string; name: string; slug: string } }) => th.hashtags) ?? [],
    }))

    return NextResponse.json({
      tokens,
      pagination: {
        page,
        pageSize,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Tokens GET error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const ids: string[] = body.ids

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No token IDs provided' }, { status: 400 })
    }

    const { error } = await supabaseService.from('tokens').delete().in('id', ids)

    if (error) {
      console.error('Failed to delete tokens:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, deleted: ids.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Tokens DELETE error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

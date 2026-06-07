import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import type { RawToken } from '@/shared/types'

export const maxDuration = 60

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') ?? '25', 10)))

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabaseService
      .from('raw_tokens')
      .select('*', { count: 'exact' })
      .eq('status', 'failed')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Failed to fetch failed raw tokens:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const rawTokens = (data ?? []) as RawToken[]

    return NextResponse.json({
      rawTokens,
      pagination: {
        page,
        pageSize,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Failed raw tokens GET error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

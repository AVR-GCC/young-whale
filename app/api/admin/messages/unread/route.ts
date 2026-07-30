import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import { requireAdminApi } from '@/lib/admin-auth'

export async function GET(request: Request) {
  const authResult = await requireAdminApi()
  if (authResult instanceof NextResponse) return authResult

  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') ?? '25', 10)))

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabaseService
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Failed to fetch unread messages:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      messages: data ?? [],
      pagination: {
        page,
        pageSize,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Unread messages GET error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

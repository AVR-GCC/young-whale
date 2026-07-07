import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import { verifyCronRequest } from '@/lib/cron/verify'

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    if (!verifyCronRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const { data, error } = await supabaseService
      .from('tokens')
      .update({ published_at: new Date().toISOString() })
      .eq('status', 'approved')
      .is('published_at', null)
      .select('id')

    if (error) {
      console.error('Failed to publish tokens:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const publishedCount = data?.length ?? 0

    return NextResponse.json({
      published: publishedCount,
      message: `Published ${publishedCount} token(s)`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Cron publish error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

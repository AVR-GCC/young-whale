import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import { requireAdminApi } from '@/lib/admin-auth'

export async function GET() {
  const authResult = await requireAdminApi()
  if (authResult instanceof NextResponse) return authResult

  try {
    const { data, error } = await supabaseService
      .from('hashtags')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('name')

    if (error) {
      console.error('Failed to fetch hashtags:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Hashtags GET error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

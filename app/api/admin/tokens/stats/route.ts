import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'

export async function GET() {
  try {
    // Fetch all tokens and count in memory - more reliable than head/count combo
    const { data: allTokens, error: totalError } = await supabaseService
      .from('tokens')
      .select('status, is_promoted, confidence')

    if (totalError) {
      console.error('Failed to fetch token stats:', totalError.message)
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }

    const tokens = allTokens ?? []

    const stats = {
      total: tokens.length,
      approved: tokens.filter((t) => t.status === 'approved').length,
      pending_review: tokens.filter((t) => t.status === 'pending_review').length,
      rejected: tokens.filter((t) => t.status === 'rejected').length,
      promoted: tokens.filter((t) => t.is_promoted).length,
      low_confidence: tokens.filter((t) => t.confidence === 'low').length,
    }

    return NextResponse.json(stats)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Token stats GET error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

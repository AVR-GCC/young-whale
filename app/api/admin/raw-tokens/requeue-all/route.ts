import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import { requireAdminApi } from '@/lib/admin-auth'

export const maxDuration = 60

export async function POST() {
  const authResult = await requireAdminApi()
  if (authResult instanceof NextResponse) return authResult

  try {
    // Get all failed raw token IDs
    const { data: failedTokens, error: fetchError } = await supabaseService
      .from('raw_tokens')
      .select('id')
      .eq('status', 'failed')

    if (fetchError) {
      console.error('Failed to fetch failed raw tokens:', fetchError.message)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    const tokenIds = failedTokens?.map((t) => t.id) ?? []

    if (tokenIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No failed tokens to requeue',
        count: 0,
      })
    }

    // Update all failed raw tokens to pending
    const { error: rawTokenError } = await supabaseService
      .from('raw_tokens')
      .update({ status: 'pending', error_message: null, retry_count: 0 })
      .eq('status', 'failed')

    if (rawTokenError) {
      console.error('Failed to reset raw tokens:', rawTokenError.message)
      return NextResponse.json({ error: rawTokenError.message }, { status: 500 })
    }

    // Update corresponding processing queue entries
    const { error: queueError } = await supabaseService
      .from('processing_queue')
      .update({
        status: 'queued',
        retry_count: 0,
        max_retries: 3,
      })
      .in('raw_token_id', tokenIds)

    if (queueError) {
      console.error('Failed to update processing queue:', queueError.message)
      return NextResponse.json({ error: queueError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Re-queued ${tokenIds.length} token(s) for reprocessing`,
      count: tokenIds.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Bulk raw token requeue error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

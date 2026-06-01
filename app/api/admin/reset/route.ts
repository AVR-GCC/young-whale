import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import { verifyCronRequest } from '@/lib/cron/verify'

export const maxDuration = 60

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    if (!verifyCronRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const results: Record<string, { success: boolean; error?: string; count?: number }> = {}

    // 1. Reset processing_queue: clear errors, retry_count to 0, status to queued
    const { error: queueError, data: queueData } = await supabaseService
      .from('processing_queue')
      .update({
        status: 'queued',
        retry_count: 0,
        error_message: null,
        locked_until: null,
      })
      .neq('status', 'queued')
      .select()

    if (queueError) {
      results.processing_queue = { success: false, error: queueError.message }
    } else {
      results.processing_queue = { success: true, count: queueData?.length ?? 0 }
    }

    // 2. Delete all token_hashtags
    const { error: tokenHashtagsError, count: tokenHashtagsCount } = await supabaseService
      .from('token_hashtags')
      .delete()
      .neq('token_id', '00000000-0000-0000-0000-000000000000')

    if (tokenHashtagsError) {
      results.token_hashtags = { success: false, error: tokenHashtagsError.message }
    } else {
      results.token_hashtags = { success: true, count: tokenHashtagsCount ?? 0 }
    }

    // 3. Delete all tokens
    const { error: tokensError, count: tokensCount } = await supabaseService
      .from('tokens')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (tokensError) {
      results.tokens = { success: false, error: tokensError.message }
    } else {
      results.tokens = { success: true, count: tokensCount ?? 0 }
    }

    // Check if any operation failed
    const hasErrors = Object.values(results).some((r) => !r.success)

    if (hasErrors) {
      return NextResponse.json(
        {
          error: 'Partial failure during reset',
          details: results,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Reset completed successfully',
      details: results,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Reset route error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

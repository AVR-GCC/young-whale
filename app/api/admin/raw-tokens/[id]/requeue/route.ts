import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'

export const maxDuration = 60

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error: rawTokenError } = await supabaseService
      .from('raw_tokens')
      .update({ status: 'pending', error_message: null, retry_count: 0 })
      .eq('id', id)

    if (rawTokenError) {
      console.error('Failed to reset raw token:', rawTokenError.message)
      return NextResponse.json({ error: rawTokenError.message }, { status: 500 })
    }

    const { error: queueError } = await supabaseService
      .from('processing_queue')
      .update({
        status: 'queued',
        retry_count: 0,
        max_retries: 3,
      })
      .eq('raw_token_id', id)

    if (queueError) {
      console.error('Failed to add to processing queue:', queueError.message)
      return NextResponse.json({ error: queueError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Token re-queued for reprocessing',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Raw token requeue error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

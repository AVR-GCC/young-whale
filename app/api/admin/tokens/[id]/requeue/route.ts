import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'

export const maxDuration = 60

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: token, error: tokenError } = await supabaseService
      .from('tokens')
      .select('raw_token_id')
      .eq('id', id)
      .single()

    if (tokenError || !token) {
      return NextResponse.json(
        { error: tokenError?.message ?? 'Token not found' },
        { status: 500 }
      )
    }

    const rawTokenId = token.raw_token_id
    if (!rawTokenId) {
      return NextResponse.json(
        { error: 'Token has no associated raw token' },
        { status: 400 }
      )
    }

    const { error: rawTokenError } = await supabaseService
      .from('raw_tokens')
      .update({ status: 'pending' })
      .eq('id', rawTokenId)

    if (rawTokenError) {
      console.error('Failed to reset raw token:', rawTokenError.message)
      return NextResponse.json({ error: rawTokenError.message }, { status: 500 })
    }

    const { error: queueError } = await supabaseService
      .from('processing_queue')
      .insert({
        raw_token_id: rawTokenId,
        status: 'queued',
        retry_count: 0,
        max_retries: 3,
      })

    if (queueError) {
      console.error('Failed to add to processing queue:', queueError.message)
      return NextResponse.json({ error: queueError.message }, { status: 500 })
    }

    const { error: hashtagsError } = await supabaseService
      .from('token_hashtags')
      .delete()
      .eq('token_id', id)

    if (hashtagsError) {
      console.error('Failed to delete token hashtags:', hashtagsError.message)
      return NextResponse.json({ error: hashtagsError.message }, { status: 500 })
    }

    const { error: deleteError } = await supabaseService
      .from('tokens')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Failed to delete token:', deleteError.message)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Token re-queued for reprocessing',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Token requeue error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

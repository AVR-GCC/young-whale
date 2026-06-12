import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
export async function GET() {
  const { data, error } = await supabaseService
    .from('raw_tokens')
    .select('id')
    .neq('symbol', 'xxx')
  if (error) {
    return NextResponse.json({ error });
  }
  const queueJobs = data.map((rt) => ({ raw_token_id: rt.id }))
  const { error: queueError } = await supabaseService
    .from('processing_queue')
    .insert(queueJobs)

  if (queueError) {
    console.error('Failed to insert processing_queue jobs:', queueError.message)
  }
  return NextResponse.json({ data });
}


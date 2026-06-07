import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import type { ProcessingRun } from '@/shared/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const runId = searchParams.get('runId')

  if (!runId) {
    return NextResponse.json({ error: 'Missing runId parameter' }, { status: 400 })
  }

  try {
    const { data: run, error } = await supabaseService
      .from('processing_runs')
      .select('*')
      .eq('id', runId)
      .single()

    if (error || !run) {
      return NextResponse.json(
        { error: error?.message ?? 'Run not found' },
        { status: 404 }
      )
    }

    const runData = run as ProcessingRun

    return NextResponse.json({
      id: runData.id,
      status: runData.status,
      processed: runData.processed_count,
      failed: runData.failed_count,
      errorMessage: runData.error_message,
      startedAt: runData.started_at,
      completedAt: runData.completed_at,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Status check error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

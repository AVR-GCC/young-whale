import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'

const AI_CONFIG_KEYS = [
  'ai_model',
  'available_models',
  'ai_prompt_system',
  'ai_prompt_category',
  'ai_prompt_main_hashtag',
  'ai_prompt_short_description',
  'ai_prompt_full_description',
  'ai_prompt_confidence',
]

export async function GET() {
  try {
    const { data, error } = await supabaseService
      .from('platform_config')
      .select('key, value')
      .in('key', AI_CONFIG_KEYS)

    if (error) {
      console.error('Failed to fetch AI config:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const config: Record<string, unknown> = {}
    for (const row of data ?? []) {
      config[row.key] = row.value
    }

    return NextResponse.json(config)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('AI config GET error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const updates = []
    for (const key of AI_CONFIG_KEYS) {
      if (key in body) {
        updates.push({
          key,
          value: body[key],
        })
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No valid config keys provided' }, { status: 400 })
    }

    const { error } = await supabaseService
      .from('platform_config')
      .upsert(updates, { onConflict: 'key' })

    if (error) {
      console.error('Failed to update AI config:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('AI config POST error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

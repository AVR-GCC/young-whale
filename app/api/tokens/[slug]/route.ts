import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import type { TokenWithHashtags } from '@/shared/types'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const { data, error } = await supabaseService
      .from('tokens')
      .select(
        `*,
        token_hashtags(
          hashtags(id, name, slug)
        )`
      )
      .eq('slug', slug)
      .not('published_at', 'is', null)
      .single()

    if (error) {
      console.error('Failed to fetch token by slug:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }

    const token: TokenWithHashtags = {
      ...data,
      hashtags:
        data.token_hashtags?.map(
          (th: { hashtags: { id: string; name: string; slug: string } }) => th.hashtags
        ) ?? [],
    }

    return NextResponse.json({ token })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Token GET error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

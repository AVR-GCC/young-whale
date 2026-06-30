import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'
import type { TokenWithHashtags } from '@/shared/types'
// import { sleep } from '@/app/lib/utils'

export const revalidate = 60 // Revalidate every 60 seconds

export async function GET() {
  try {
    const { data, error } = await supabaseService
      .from('tokens')
      .select(
        `*,
        token_hashtags(
          hashtags(id, name, slug)
        )`
      )
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch public tokens:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const tokens: TokenWithHashtags[] = (data ?? []).map((token) => ({
      ...token,
      hashtags:
        token.token_hashtags?.map(
          (th: { hashtags: { id: string; name: string; slug: string } }) => th.hashtags
        ) ?? [],
    }))

    // await sleep(5000)
    return NextResponse.json({ tokens })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Public tokens GET error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { supabaseService } from '@/lib/supabase/service'
import type { TokenWithHashtags } from '@/shared/types'

export async function getAllApprovedTokens(): Promise<TokenWithHashtags[]> {
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
    console.error('Failed to fetch tokens:', error.message)
    throw new Error(`Failed to fetch tokens: ${error.message}`)
  }

  return (data ?? []).map((token) => ({
    ...token,
    hashtags:
      token.token_hashtags?.map(
        (th: { hashtags: { id: string; name: string; slug: string } }) => th.hashtags
      ) ?? [],
  }))
}

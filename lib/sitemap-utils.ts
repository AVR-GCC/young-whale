import { supabaseService } from '@/lib/supabase/service'

export async function getLastPublishedAt(): Promise<Date | null> {
  const { data, error } = await supabaseService
    .from('tokens')
    .select('published_at')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data?.published_at) {
    return null
  }

  return new Date(data.published_at)
}

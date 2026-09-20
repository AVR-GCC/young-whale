'use client'

import { useCallback, useEffect, useState } from 'react'
import HomePage from './HomePage'
import { supabase } from '@/lib/supabase/client'
import type { TokenWithHashtags } from '@/shared/types'

export default function HomePageClient() {
  const [tokens, setTokens] = useState<TokenWithHashtags[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    console.log('loading', new Date());
    fetch('/api/tokens/public')
      .then((res) => res.json())
      .then((data) => {
        setTokens(data.tokens ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    const channel = supabase
      .channel('tokens-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tokens' },
        () => {
          if (timer) clearTimeout(timer)
          timer = setTimeout(load, 1000)
        }
      )
      .subscribe()

    return () => {
      if (timer) clearTimeout(timer)
      supabase.removeChannel(channel)
    }
  }, [load])

  return <HomePage tokens={tokens} loading={loading} />
}

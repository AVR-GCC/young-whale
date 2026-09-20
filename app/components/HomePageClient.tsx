'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HomePage from './HomePage'
import WhaleSplash from './WhaleSplash'
import { supabase } from '@/lib/supabase/client'
import type { TokenWithHashtags } from '@/shared/types'

const SPLASH_DURATION_MS = 4200
const HIGHLIGHT_DURATION_MS = 30_000

export default function HomePageClient() {
  const [tokens, setTokens] = useState<TokenWithHashtags[]>([])
  const [loading, setLoading] = useState(true)
  const [newTokenIds, setNewTokenIds] = useState<string[]>([])
  const [splash, setSplash] = useState<{ key: number; count: number } | null>(null)
  const prevIdsRef = useRef<Set<string> | null>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const load = useCallback(() => {
    fetch('/api/tokens/public')
      .then((res) => res.json())
      .then((data) => {
        const next: TokenWithHashtags[] = data.tokens ?? []
        setTokens(next)
        setLoading(false)

        const nextIds = new Set(next.map((t) => t.id))
        const prevIds = prevIdsRef.current
        prevIdsRef.current = nextIds
        if (!prevIds) return

        const freshIds = next.filter((t) => !prevIds.has(t.id)).map((t) => t.id)
        if (freshIds.length === 0) return

        timersRef.current.forEach(clearTimeout)
        timersRef.current = [
          setTimeout(() => setSplash(null), SPLASH_DURATION_MS),
          setTimeout(() => setNewTokenIds([]), HIGHLIGHT_DURATION_MS),
        ]
        setNewTokenIds(freshIds)
        setSplash({ key: Date.now(), count: freshIds.length })
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
    return () => timersRef.current.forEach(clearTimeout)
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

  const newTokenIdSet = useMemo(() => new Set(newTokenIds), [newTokenIds])

  return (
    <>
      {splash && <WhaleSplash key={splash.key} count={splash.count} />}
      <HomePage tokens={tokens} loading={loading} newTokenIds={newTokenIdSet} />
    </>
  )
}

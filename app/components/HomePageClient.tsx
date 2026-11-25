'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HomePage from './HomePage'
import WhaleSplash from './WhaleSplash'
import { supabase } from '@/lib/supabase/client'
import type { TokenCategory, TokenWithHashtags } from '@/shared/types'

const SPLASH_DURATION_MS = 4200
const HIGHLIGHT_DURATION_MS = 30_000
const TOKEN_PAGE_SIZE = 50

type NextCursors = Partial<Record<TokenCategory, string | null>>
type InitialTokensResponse = {
  tokens?: TokenWithHashtags[]
  nextCursors?: NextCursors
}
type CategoryTokensResponse = {
  tokens?: TokenWithHashtags[]
  nextCursor?: string | null
}

function mergeTokens(current: TokenWithHashtags[], incoming: TokenWithHashtags[]) {
  const tokensById = new Map(current.map((token) => [token.id, token]))
  incoming.forEach((token) => tokensById.set(token.id, token))
  return [...tokensById.values()]
}

export default function HomePageClient() {
  const [tokens, setTokens] = useState<TokenWithHashtags[]>([])
  const [loading, setLoading] = useState(true)
  const [newTokenIds, setNewTokenIds] = useState<string[]>([])
  const [splash, setSplash] = useState<{ key: number; count: number } | null>(null)
  const [nextCursors, setNextCursors] = useState<NextCursors>({})
  const [loadingMore, setLoadingMore] = useState<ReadonlySet<TokenCategory>>(new Set())
  const prevIdsRef = useRef<Set<string> | null>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const tokensRef = useRef<TokenWithHashtags[]>([])
  const nextCursorsRef = useRef<NextCursors>({})
  const loadingMoreRef = useRef<Set<TokenCategory>>(new Set())
  const pagedCategoriesRef = useRef<Set<TokenCategory>>(new Set())

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/tokens/public')
      if (!response.ok) throw new Error('Failed to load tokens')
      const data = (await response.json()) as InitialTokensResponse
      const incoming = data.tokens ?? []
      const prevIds = prevIdsRef.current
      const next = prevIds === null ? incoming : mergeTokens(tokensRef.current, incoming)
      const freshIds = prevIds === null ? [] : incoming.filter((token) => !prevIds.has(token.id)).map((token) => token.id)

      tokensRef.current = next
      prevIdsRef.current = new Set(next.map((token) => token.id))
      setTokens(next)

      const refreshedCursors = data.nextCursors ?? {}
      const mergedCursors = { ...refreshedCursors }
      if (prevIds === null) {
        pagedCategoriesRef.current.clear()
      } else {
        pagedCategoriesRef.current.forEach((category) => {
          const cursor = nextCursorsRef.current[category]
          if (cursor) mergedCursors[category] = cursor
        })
      }
      nextCursorsRef.current = mergedCursors
      setNextCursors(mergedCursors)
      setLoading(false)

      if (freshIds.length === 0) return

      timersRef.current.forEach(clearTimeout)
      timersRef.current = [
        setTimeout(() => setSplash(null), SPLASH_DURATION_MS),
        setTimeout(() => setNewTokenIds([]), HIGHLIGHT_DURATION_MS),
      ]
      setNewTokenIds(freshIds)
      setSplash({ key: Date.now(), count: freshIds.length })
    } catch {
      setLoading(false)
    }
  }, [])

  const loadMore = useCallback(async (category: TokenCategory) => {
    const cursor = nextCursorsRef.current[category]
    if (!cursor || loadingMoreRef.current.has(category)) return false

    const nextLoading = new Set(loadingMoreRef.current)
    nextLoading.add(category)
    loadingMoreRef.current = nextLoading
    setLoadingMore(nextLoading)

    try {
      const params = new URLSearchParams({
        category,
        cursor,
        limit: String(TOKEN_PAGE_SIZE),
      })
      const response = await fetch(`/api/tokens/public?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to load more tokens')
      const data = (await response.json()) as CategoryTokensResponse
      const next = mergeTokens(tokensRef.current, data.tokens ?? [])
      const nextCursor = data.nextCursor ?? null

      tokensRef.current = next
      prevIdsRef.current = new Set(next.map((token) => token.id))
      setTokens(next)

      const mergedCursors = { ...nextCursorsRef.current, [category]: nextCursor }
      nextCursorsRef.current = mergedCursors
      setNextCursors(mergedCursors)
      if (nextCursor) {
        pagedCategoriesRef.current.add(category)
      } else {
        pagedCategoriesRef.current.delete(category)
      }
      return true
    } catch {
      return false
    } finally {
      const nextLoading = new Set(loadingMoreRef.current)
      nextLoading.delete(category)
      loadingMoreRef.current = nextLoading
      setLoadingMore(nextLoading)
    }
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
      <HomePage
        tokens={tokens}
        loading={loading}
        newTokenIds={newTokenIdSet}
        nextCursors={nextCursors}
        loadingMore={loadingMore}
        onLoadMore={loadMore}
      />
    </>
  )
}

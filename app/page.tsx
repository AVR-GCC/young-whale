'use client'

import { useEffect, useState } from 'react'
import HomePage from './components/HomePage'
import type { TokenWithHashtags } from '@/shared/types'

export default function Home() {
  const [tokens, setTokens] = useState<TokenWithHashtags[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tokens/public')
      .then((res) => res.json())
      .then((data) => {
        setTokens(data.tokens ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return <HomePage tokens={tokens} loading={loading} />
}

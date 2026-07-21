'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import TokenTerminal from '@/app/components/TokenTerminal'
import type { TokenWithHashtags } from '@/shared/types'
import { categories } from '@/app/lib/categories'

const ONE_DAY = 24 * 60 * 60 * 1000

export default function TokenPage() {
  const params = useParams()
  const slug = params.slug as string

  const [token, setToken] = useState<TokenWithHashtags | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    fetch(`/api/tokens/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Token not found')
        return res.json()
      })
      .then((data) => {
        setToken(data.token)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [slug])

  const themeColor = useMemo(() => {
    if (!token) return '#22D3EE'
    const category = categories.find((c) => c.id === token.category)
    return category?.color ?? '#22D3EE'
  }, [token])

  const [now] = useState(() => Date.now())

  const isExpired = useMemo(() => {
    if (!token) return false
    const oneDayAgo = new Date(now - ONE_DAY)
    return new Date(token.created_at) < oneDayAgo
  }, [token, now])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="text-[#94A3B8] font-mono text-sm animate-pulse">LOADING TOKEN DATA...</div>
      </div>
    )
  }

  if (error || !token) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#F97316] font-mono text-lg mb-2">ERROR</div>
          <div className="text-[#94A3B8] font-mono text-sm">{error || 'Token not found'}</div>
        </div>
      </div>
    )
  }

  return (
    <TokenTerminal
      token={token}
      themeColor={themeColor}
      isExpired={isExpired}
      isExpanded={true}
    />
  )
}

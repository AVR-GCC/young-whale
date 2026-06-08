'use client'

import { useState, useEffect } from 'react'
import type { RawToken } from '@/shared/types'

interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export default function FailedTokensSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rawTokens, setRawTokens] = useState<RawToken[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0,
  })
  const [expandedRawData, setExpandedRawData] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string>('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [requeueingId, setRequeueingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError('')
      try {
        const params = new URLSearchParams()
        params.set('page', String(pagination.page))
        params.set('pageSize', String(pagination.pageSize))

        const res = await fetch(`/api/admin/raw-tokens/failed?${params.toString()}`)
        const data = await res.json()

        if (cancelled) return

        if (res.ok) {
          setRawTokens(data.rawTokens)
          setPagination(data.pagination)
        } else {
          setError(data.error || 'Failed to fetch failed tokens')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch failed tokens')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [isOpen, pagination.page, pagination.pageSize, refreshKey])

  const toggleRawData = (id: string) => {
    setExpandedRawData((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const requeueToken = async (id: string) => {
    setRequeueingId(id)
    try {
      const res = await fetch(`/api/admin/raw-tokens/${id}/requeue`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setRefreshKey((k) => k + 1)
      } else {
        setError(data.error || 'Failed to requeue token')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to requeue token')
    } finally {
      setRequeueingId(null)
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleString()
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => {
          if (isOpen) {
            setIsOpen(false)
          } else {
            setIsOpen(true)
          }
        }}
        className="w-full px-6 py-4 flex items-center justify-between bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-black dark:text-zinc-50">
            Failed Tokens
          </span>
          {pagination.total > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded text-xs font-medium">
              {pagination.total}
            </span>
          )}
        </div>
        <span className="text-zinc-500 dark:text-zinc-400">
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
          ) : isOpen ? (
            '▲'
          ) : (
            '▼'
          )}
        </span>
      </button>

      {isOpen && (
        <div className="bg-white dark:bg-black">
          {error && (
            <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="px-6 py-3 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Showing {rawTokens.length} of {pagination.total} failed tokens
            </div>
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {isLoading && rawTokens.length === 0 ? (
            <div className="px-6 py-8">
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ) : rawTokens.length === 0 ? (
            <div className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
              No failed tokens found
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {rawTokens.map((token) => (
                <div key={token.id} className="px-6 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-black dark:text-zinc-50">
                        {token.symbol || 'N/A'}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {token.name || 'Unnamed'}
                      </span>
                      {token.chain && (
                        <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 rounded text-xs">
                          {token.chain}
                        </span>
                      )}
                      {token.source_type && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded text-xs capitalize">
                          {token.source_type}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => requeueToken(token.id)}
                        disabled={requeueingId === token.id}
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {requeueingId === token.id ? 'Requeueing...' : 'Requeue'}
                      </button>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        {formatDate(token.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">
                        Error
                      </span>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
                      {token.error_message || 'No error message available'}
                    </p>
                  </div>

                  {token.contract_address && (
                    <div className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
                      Contract: {token.contract_address}
                    </div>
                  )}

                  <button
                    onClick={() => toggleRawData(token.id)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                  >
                    {expandedRawData.has(token.id) ? 'Hide Raw Data' : 'Show Raw Data'}
                  </button>

                  {expandedRawData.has(token.id) && token.raw_payload && (
                    <div className="mt-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 overflow-auto">
                      <pre className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                        {JSON.stringify(token.raw_payload, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                  disabled={pagination.page === 1 || isLoading}
                  className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  Previous
                </button>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination((p) => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                  disabled={pagination.page === pagination.totalPages || isLoading}
                  className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  Next
                </button>
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                {pagination.total} total
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

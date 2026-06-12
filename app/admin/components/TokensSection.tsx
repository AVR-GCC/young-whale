'use client'

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import type { Token, TokenStatus, TokenCategory, Confidence, SourceType, Hashtag } from '@/shared/types'
import TokenEditDrawer from './TokenEditDrawer'


interface TokenWithHashtags extends Token {
  hashtags: Hashtag[]
}

interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

interface TokenStats {
  total: number
  approved: number
  pending_review: number
  rejected: number
  promoted: number
  low_confidence: number
}

type SortColumn = keyof Token | 'hashtags'

interface SortState {
  column: SortColumn
  direction: 'asc' | 'desc'
}

function SortIcon({
  column,
  sortColumn,
  sortDirection,
}: {
  column: SortColumn
  sortColumn: SortColumn
  sortDirection: 'asc' | 'desc'
}) {
  if (sortColumn !== column) return <span className="text-zinc-300 ml-1">↕</span>
  return <span className="text-zinc-700 ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
}

interface FiltersState {
  search: string
  status: TokenStatus[]
  category: TokenCategory[]
  confidence: Confidence[]
  chain: string[]
  source_type: SourceType[]
  created_after: string
  created_before: string
  has_issues: boolean
  review_queue: boolean
}

const DEFAULT_FILTERS: FiltersState = {
  search: '',
  status: [],
  category: [],
  confidence: [],
  chain: [],
  source_type: [],
  created_after: '',
  created_before: '',
  has_issues: false,
  review_queue: false,
}

const STATUS_COLORS: Record<TokenStatus, string> = {
  approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  pending_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

const CONFIDENCE_COLORS: Record<Confidence, string> = {
  low: 'text-red-600 dark:text-red-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  high: 'text-green-600 dark:text-green-400',
}

const CATEGORY_COLORS: Record<TokenCategory, string> = {
  Presale: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Tech: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  Meme: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  RWA: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export default function TokensSection() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [tokens, setTokens] = useState<TokenWithHashtags[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<TokenStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingTokenId, setEditingTokenId] = useState<string | null>(null)
  const [drawerMode, setDrawerMode] = useState<'edit' | 'review'>('edit')
  const [pendingReviewIds, setPendingReviewIds] = useState<string[]>([])
  const [currentPendingIndex, setCurrentPendingIndex] = useState(0)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showConfirm, setShowConfirm] = useState<{
    action: string
    ids: string[]
    message: string
  } | null>(null)

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ message, type })
    toastTimerRef.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const getInitialFilters = useCallback((): FiltersState => {
    return {
      search: searchParams.get('search') ?? '',
      status: (searchParams.getAll('status') as TokenStatus[]) ?? [],
      category: (searchParams.getAll('category') as TokenCategory[]) ?? [],
      confidence: (searchParams.getAll('confidence') as Confidence[]) ?? [],
      chain: searchParams.getAll('chain') ?? [],
      source_type: (searchParams.getAll('source_type') as SourceType[]) ?? [],
      created_after: searchParams.get('created_after') ?? '',
      created_before: searchParams.get('created_before') ?? '',
      has_issues: searchParams.get('has_issues') === 'true',
      review_queue: searchParams.get('review_queue') === 'true',
    }
  }, [searchParams])

  const getInitialSort = useCallback((): SortState => {
    return {
      column: (searchParams.get('sortColumn') as SortColumn) ?? 'created_at',
      direction: (searchParams.get('sortDirection') as 'asc' | 'desc') ?? 'desc',
    }
  }, [searchParams])

  const getInitialPage = useCallback(() => {
    return Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  }, [searchParams])

  const [filters, setFilters] = useState<FiltersState>(getInitialFilters)
  const [sort, setSort] = useState<SortState>(getInitialSort)
  const [page, setPage] = useState(getInitialPage)

  const debouncedSearch = useDebounce(filters.search, 300)

  const updateUrl = useCallback(
    (newFilters: FiltersState, newSort: SortState, newPage: number) => {
      const params = new URLSearchParams()
      if (newFilters.search) params.set('search', newFilters.search)
      newFilters.status.forEach((s) => params.append('status', s))
      newFilters.category.forEach((c) => params.append('category', c))
      newFilters.confidence.forEach((c) => params.append('confidence', c))
      newFilters.chain.forEach((c) => params.append('chain', c))
      newFilters.source_type.forEach((s) => params.append('source_type', s))
      if (newFilters.created_after) params.set('created_after', newFilters.created_after)
      if (newFilters.created_before) params.set('created_before', newFilters.created_before)
      if (newFilters.has_issues) params.set('has_issues', 'true')
      if (newFilters.review_queue) params.set('review_queue', 'true')
      if (newSort.column !== 'created_at') params.set('sortColumn', newSort.column as string)
      if (newSort.direction !== 'desc') params.set('sortDirection', newSort.direction)
      if (newPage > 1) params.set('page', String(newPage))
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname]
  )

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const res = await fetch('/api/admin/tokens/stats')
      const data = await res.json()
      if (res.ok) {
        setStats(data)
      }
    } catch {
      // silently fail
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const fetchTokens = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('pageSize', String(pagination.pageSize))
      if (debouncedSearch) params.set('search', debouncedSearch)
      filters.status.forEach((s) => params.append('status', s))
      filters.category.forEach((c) => params.append('category', c))
      filters.confidence.forEach((c) => params.append('confidence', c))
      filters.chain.forEach((c) => params.append('chain', c))
      filters.source_type.forEach((s) => params.append('source_type', s))
      if (filters.created_after) params.set('created_after', filters.created_after)
      if (filters.created_before) params.set('created_before', filters.created_before)
      if (filters.has_issues) params.set('has_issues', 'true')
      if (filters.review_queue) params.set('review_queue', 'true')
      params.set('sortColumn', sort.column as string)
      params.set('sortDirection', sort.direction)

      const res = await fetch(`/api/admin/tokens?${params.toString()}`)
      const data = await res.json()

      if (res.ok) {
        setTokens(data.tokens)
        setPagination(data.pagination)
        setSelectedIds(new Set())
        fetchStats()
      } else {
        showToast(data.error || 'Failed to fetch tokens', 'error')
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to fetch tokens', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, pagination.pageSize, debouncedSearch, filters, sort, showToast, fetchStats])

  useEffect(() => {
    fetchTokens()
  }, [fetchTokens])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    updateUrl(filters, sort, page)
  }, [filters, sort, page, updateUrl])

  const handleSort = (column: SortColumn) => {
    setSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleFilterChange = <K extends keyof FiltersState>(
    key: K,
    value: FiltersState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const toggleArrayFilter = <K extends keyof FiltersState>(
    key: K,
    value: string
  ) => {
    setFilters((prev) => {
      const arr = (prev[key] as string[]) ?? []
      const newArr = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
      return { ...prev, [key]: newArr }
    })
    setPage(1)
  }

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setSort({ column: 'created_at', direction: 'desc' })
    setPage(1)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === tokens.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(tokens.map((t) => t.id)))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete' | 'requeue') => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return

    const messages: Record<string, string> = {
      approve: `Are you sure you want to approve ${ids.length} token(s)?`,
      reject: `Are you sure you want to reject ${ids.length} token(s)?`,
      delete: `Are you sure you want to delete ${ids.length} token(s)? This action cannot be undone.`,
      requeue: `Are you sure you want to re-queue ${ids.length} token(s) for reprocessing? This will delete the processed tokens and add them back to the queue.`,
    }

    setShowConfirm({ action, ids, message: messages[action] })
  }

  const executeBulkAction = async () => {
    if (!showConfirm) return
    const { action, ids } = showConfirm
    setShowConfirm(null)

    try {
      if (action === 'delete') {
        const res = await fetch('/api/admin/tokens', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        })
        const data = await res.json()
        if (res.ok) {
          showToast(`Deleted ${ids.length} token(s)`, 'success')
          setSelectedIds(new Set())
          fetchTokens()
          fetchStats()
        } else {
          showToast(data.error || 'Failed to delete tokens', 'error')
        }
      } else if (action === 'approve' || action === 'reject') {
        const updates = ids.map((id) =>
          fetch(`/api/admin/tokens/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: action === 'approve' ? 'approved' : 'rejected' }),
          })
        )
        await Promise.all(updates)
        showToast(`${action === 'approve' ? 'Approved' : 'Rejected'} ${ids.length} token(s)`, 'success')
        setSelectedIds(new Set())
        fetchTokens()
        fetchStats()
      } else if (action === 'requeue') {
        for (const id of ids) {
          await fetch(`/api/admin/tokens/${id}/requeue`, { method: 'POST' })
        }
        showToast(`Re-queued ${ids.length} token(s)`, 'success')
        setSelectedIds(new Set())
        fetchTokens()
        fetchStats()
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Action failed', 'error')
    }
  }

  // const handleInlineToggle = async (
  //   id: string,
  //   field: 'is_promoted' | 'is_verified',
  //   value: boolean
  // ) => {
  //   setTokens((prev) =>
  //     prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
  //   )
  //   try {
  //     const res = await fetch(`/api/admin/tokens/${id}`, {
  //       method: 'PATCH',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ [field]: value }),
  //     })
  //     if (!res.ok) {
  //       const data = await res.json()
  //       showToast(data.error || 'Failed to update', 'error')
  //       fetchTokens()
  //     }
  //   } catch (err) {
  //     showToast(err instanceof Error ? err.message : 'Failed to update', 'error')
  //     fetchTokens()
  //   }
  // }

  const openEditDrawer = (tokenId: string, mode: 'edit' | 'review' = 'edit') => {
    setEditingTokenId(tokenId)
    setDrawerMode(mode)
    setDrawerOpen(true)
  }

  const handleReviewQueue = () => {
    const newReviewQueue = !filters.review_queue
    setFilters((prev) => ({ ...prev, review_queue: newReviewQueue }))
    setPage(1)
    if (newReviewQueue) {
      // After fetching, we'll get the pending IDs
      setTimeout(() => {
        setPendingReviewIds(tokens.map((t) => t.id))
        setCurrentPendingIndex(0)
      }, 500)
    }
  }

  const handleNextPending = () => {
    const nextIndex = currentPendingIndex + 1
    if (nextIndex < pendingReviewIds.length) {
      setCurrentPendingIndex(nextIndex)
      setEditingTokenId(pendingReviewIds[nextIndex])
    } else {
      setDrawerOpen(false)
      setEditingTokenId(null)
      fetchTokens()
    }
  }

  const handleTokenUpdate = (updatedToken: TokenWithHashtags) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === updatedToken.id ? updatedToken : t))
    )
    fetchStats()
  }

  const handleTokenDelete = (id: string) => {
    setTokens((prev) => prev.filter((t) => t.id !== id))
    setDrawerOpen(false)
    setEditingTokenId(null)
    fetchStats()
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-black dark:text-zinc-50">Tokens</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReviewQueue}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                filters.review_queue
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              {filters.review_queue ? 'Exit Review Queue' : 'Review Queue'}
            </button>
            <button
              onClick={fetchTokens}
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 py-3 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap gap-4 text-sm">
          {statsLoading || !stats ? (
            <div className="flex gap-4 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 dark:text-zinc-400">Total:</span>
                <span className="font-semibold text-black dark:text-zinc-50">{stats.total}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 dark:text-zinc-400">Approved:</span>
                <span className="font-semibold text-green-600">{stats.approved}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 dark:text-zinc-400">Pending:</span>
                <span className="font-semibold text-yellow-600">{stats.pending_review}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 dark:text-zinc-400">Rejected:</span>
                <span className="font-semibold text-red-600">{stats.rejected}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 dark:text-zinc-400">Promoted:</span>
                <span className="font-semibold text-blue-600">{stats.promoted}</span>
              </div>
              <button
                onClick={() => handleFilterChange('confidence', ['low'])}
                className="flex items-center gap-1.5 hover:opacity-80"
              >
                <span className="text-zinc-500 dark:text-zinc-400">Low Confidence:</span>
                <span className="font-semibold text-red-600">{stats.low_confidence}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Name, symbol, or contract..."
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Status
            </label>
            <div className="flex gap-1">
              {(['approved', 'pending_review', 'rejected'] as TokenStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => toggleArrayFilter('status', status)}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-colors capitalize ${
                    filters.status.includes(status)
                      ? STATUS_COLORS[status]
                      : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Category
            </label>
            <div className="flex gap-1">
              {(['Presale', 'Tech', 'Meme', 'RWA'] as TokenCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleArrayFilter('category', cat)}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                    filters.category.includes(cat)
                      ? CATEGORY_COLORS[cat]
                      : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Confidence
            </label>
            <div className="flex gap-1">
              {(['low', 'medium', 'high'] as Confidence[]).map((conf) => (
                <button
                  key={conf}
                  onClick={() => toggleArrayFilter('confidence', conf)}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-colors capitalize ${
                    filters.confidence.includes(conf)
                      ? conf === 'low'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : conf === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {conf}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Source
            </label>
            <div className="flex gap-1">
              {(['coinbase', 'dex', 'user_paid'] as SourceType[]).map((src) => (
                <button
                  key={src}
                  onClick={() => toggleArrayFilter('source_type', src)}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-colors capitalize ${
                    filters.source_type.includes(src)
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {src.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              From
            </label>
            <input
              type="date"
              value={filters.created_after}
              onChange={(e) => handleFilterChange('created_after', e.target.value)}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              To
            </label>
            <input
              type="date"
              value={filters.created_before}
              onChange={(e) => handleFilterChange('created_before', e.target.value)}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
            />
          </div>

          <button
            onClick={() => handleFilterChange('has_issues', !filters.has_issues)}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              filters.has_issues
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            Has Issues
          </button>

          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 underline"
          >
            Clear all filters
          </button>

          <div className="ml-auto text-sm text-zinc-500 dark:text-zinc-400">
            Showing {tokens.length} of {pagination.total} tokens
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 flex items-center gap-3">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            {selectedIds.size} selected
          </span>
          <button
            onClick={() => handleBulkAction('approve')}
            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => handleBulkAction('reject')}
            className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => handleBulkAction('requeue')}
            className="px-3 py-1.5 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
          >
            Re-queue
          </button>
          <button
            onClick={() => handleBulkAction('delete')}
            className="px-3 py-1.5 bg-zinc-600 text-white rounded text-sm hover:bg-zinc-700 transition-colors"
          >
            Delete
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.size === tokens.length && tokens.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-zinc-300 dark:border-zinc-700"
                />
              </th>
              <th className="px-4 py-3 text-left w-12">Logo</th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => handleSort('symbol')}
              >
                Symbol <SortIcon column="symbol" sortColumn={sort.column} sortDirection={sort.direction} />
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => handleSort('name')}
              >
                Name <SortIcon column="name" sortColumn={sort.column} sortDirection={sort.direction} />
              </th>
              {/*
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => handleSort('chain')}
              >
                Chain <SortIcon column="chain" sortColumn={sort.column} sortDirection={sort.direction} />
              </th>
              */}
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => handleSort('category')}
              >
                Category <SortIcon column="category" sortColumn={sort.column} sortDirection={sort.direction} />
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => handleSort('confidence')}
              >
                Confidence <SortIcon column="confidence" sortColumn={sort.column} sortDirection={sort.direction} />
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => handleSort('status')}
              >
                Status <SortIcon column="status" sortColumn={sort.column} sortDirection={sort.direction} />
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => handleSort('created_at')}
              >
                Created <SortIcon column="created_at" sortColumn={sort.column} sortDirection={sort.direction} />
              </th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                  {[...Array(9)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : tokens.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-zinc-500 dark:text-zinc-400">
                  {filters.review_queue
                    ? 'No tokens pending review'
                    : filters.search ||
                      filters.status.length ||
                      filters.category.length ||
                      filters.confidence.length ||
                      filters.chain.length ||
                      filters.source_type.length ||
                      filters.has_issues
                    ? 'No tokens match your filters'
                    : 'No tokens have been processed yet'}
                </td>
              </tr>
            ) : (
              tokens.map((token) => (
                <tr
                  key={token.id}
                  className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(token.id)}
                      onChange={() => toggleSelect(token.id)}
                      className="rounded border-zinc-300 dark:border-zinc-700"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {token.logo_url || token.logo_storage_path ? (
                      <Image
                        src={token.logo_url || token.logo_storage_path || ''}
                        alt={token.symbol}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                        {token.symbol?.[0] ?? '?'}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-black dark:text-zinc-50">
                    {token.symbol}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{token.name}</td>
                  {/*
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{token.chain}</td>
                  */}
                  <td className="px-4 py-3">
                    {token.category && (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          CATEGORY_COLORS[token.category as TokenCategory] ??
                          'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {token.category}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {token.confidence && (
                      <span
                        className={`font-medium capitalize ${
                          CONFIDENCE_COLORS[token.confidence as Confidence]
                        }`}
                      >
                        {token.confidence}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                        STATUS_COLORS[token.status as TokenStatus] ??
                        'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {token.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                    {formatDate(token.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditDrawer(token.id, 'edit')}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        Edit
                      </button>
                      {token.status === 'pending_review' && (
                        <>
                          <button
                            onClick={() => {
                              setEditingTokenId(token.id)
                              setDrawerMode('review')
                              setDrawerOpen(true)
                            }}
                            className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-800"
                          >
                            Approve
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch(`/api/admin/tokens/${token.id}`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ status: 'rejected' }),
                                })
                                if (res.ok) {
                                  showToast('Token rejected', 'success')
                                  fetchTokens()
                                  fetchStats()
                                } else {
                                  const data = await res.json()
                                  showToast(data.error || 'Failed to reject', 'error')
                                }
                              } catch (err) {
                                showToast(
                                  err instanceof Error ? err.message : 'Failed to reject',
                                  'error'
                                )
                              }
                            }}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setShowConfirm({
                            action: 'delete',
                            ids: [token.id],
                            message: 'Are you sure you want to delete this token? This cannot be undone.',
                          })
                        }}
                        className="px-2 py-1 text-xs bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Previous
            </button>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
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

      {/* Drawer */}
      {drawerOpen && editingTokenId && (
        <TokenEditDrawer
          tokenId={editingTokenId}
          mode={drawerMode}
          onClose={() => {
            setDrawerOpen(false)
            setEditingTokenId(null)
          }}
          onUpdate={handleTokenUpdate}
          onDelete={handleTokenDelete}
          onNext={drawerMode === 'review' ? handleNextPending : undefined}
          showToast={showToast}
        />
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2">Confirm Action</h3>
            <p className="text-zinc-600 dark:text-zinc-300 mb-6">{showConfirm.message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(null)}
                className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={executeBulkAction}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-sm font-medium z-50 transition-opacity ${
            toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}

'use client'

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import type { Message } from '@/shared/types'

interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export default function MessagesSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([])
  const [readMessages, setReadMessages] = useState<Message[]>([])
  const [unreadPagination, setUnreadPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0,
  })
  const [readPagination, setReadPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0,
  })
  const [error, setError] = useState<string>('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [markingReadId, setMarkingReadId] = useState<string | null>(null)
  const [showReadMessages, setShowReadMessages] = useState(false)

  const fetchUnread = useCallback(async () => {
    if (!isOpen) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(unreadPagination.page))
      params.set('pageSize', String(unreadPagination.pageSize))

      const res = await fetch(`/api/admin/messages/unread?${params.toString()}`)
      const data = await res.json()

      if (res.ok) {
        setUnreadMessages(data.messages)
        setUnreadPagination(data.pagination)
      } else {
        setError(data.error || 'Failed to fetch unread messages')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch unread messages')
    } finally {
      setIsLoading(false)
    }
  }, [isOpen, unreadPagination.page, unreadPagination.pageSize])

  // Fetch unread count on mount so the badge shows immediately
  useEffect(() => {
    async function fetchUnreadCount() {
      try {
        const res = await fetch('/api/admin/messages/unread?page=1&pageSize=1')
        const data = await res.json()
        if (res.ok) {
          setUnreadPagination((prev) => ({ ...prev, total: data.pagination.total }))
        }
      } catch {
        // Silently fail on mount
      }
    }
    fetchUnreadCount()
  }, [])

  const fetchRead = useCallback(async () => {
    if (!isOpen || !showReadMessages) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(readPagination.page))
      params.set('pageSize', String(readPagination.pageSize))

      const res = await fetch(`/api/admin/messages/read?${params.toString()}`)
      const data = await res.json()

      if (res.ok) {
        setReadMessages(data.messages)
        setReadPagination(data.pagination)
      } else {
        setError(data.error || 'Failed to fetch read messages')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch read messages')
    } finally {
      setIsLoading(false)
    }
  }, [isOpen, showReadMessages, readPagination.page, readPagination.pageSize])

  useEffect(() => {
    fetchUnread()
  }, [fetchUnread, refreshKey])

  useEffect(() => {
    fetchRead()
  }, [fetchRead])

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const markAsRead = async (id: string) => {
    setMarkingReadId(id)
    try {
      const res = await fetch(`/api/admin/messages/${id}/read`, { method: 'PATCH' })
      const data = await res.json()

      if (res.ok) {
        setRefreshKey((k) => k + 1)
      } else {
        setError(data.error || 'Failed to mark message as read')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark message as read')
    } finally {
      setMarkingReadId(null)
    }
  }

  const formatDate = (date: string) => {
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
            Messages
          </span>
          {unreadPagination.total > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded text-xs font-medium">
              {unreadPagination.total} unread
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

          {/* Unread Messages */}
          <div className="px-6 py-4 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold text-black dark:text-zinc-50">
                Unread Messages
              </h3>
              <button
                onClick={() => setRefreshKey((k) => k + 1)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>

            {unreadMessages.length === 0 ? (
              <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
                No unread messages
              </div>
            ) : (
              <div className="space-y-4">
                {unreadMessages.map((message) => (
                  <div
                    key={message.id}
                    className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-900/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-black dark:text-zinc-50">
                          {message.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {message.email}
                          </span>
                          <button
                            onClick={() => copyToClipboard(message.email, message.id)}
                            className="p-1 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                            title="Copy email"
                          >
                            {copiedId === message.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                          {formatDate(message.created_at)}
                        </span>
                        <button
                          onClick={() => markAsRead(message.id)}
                          disabled={markingReadId === message.id}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {markingReadId === message.id ? 'Marking...' : 'Mark as Read'}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {unreadPagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUnreadPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                    disabled={unreadPagination.page === 1}
                    className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Page {unreadPagination.page} of {unreadPagination.totalPages}
                  </span>
                  <button
                    onClick={() => setUnreadPagination((p) => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                    disabled={unreadPagination.page === unreadPagination.totalPages}
                    className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    Next
                  </button>
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {unreadPagination.total} total
                </div>
              </div>
            )}
          </div>

          {/* Read Messages Toggle */}
          <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setShowReadMessages(!showReadMessages)}
              className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
            >
              <span>{showReadMessages ? '▲' : '▼'}</span>
              <span>Read Messages ({readPagination.total})</span>
            </button>
          </div>

          {/* Read Messages */}
          {showReadMessages && (
            <div className="px-6 py-4 bg-white dark:bg-black">
              {readMessages.length === 0 ? (
                <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
                  No read messages
                </div>
              ) : (
                <div className="space-y-4">
                  {readMessages.map((message) => (
                    <div
                      key={message.id}
                      className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-900/50 opacity-75"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-black dark:text-zinc-50">
                            {message.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                              {message.email}
                            </span>
                            <button
                              onClick={() => copyToClipboard(message.email, `read-${message.id}`)}
                              className="p-1 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                              title="Copy email"
                            >
                              {copiedId === `read-${message.id}` ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {readPagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReadPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                      disabled={readPagination.page === 1}
                      className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Page {readPagination.page} of {readPagination.totalPages}
                    </span>
                    <button
                      onClick={() => setReadPagination((p) => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                      disabled={readPagination.page === readPagination.totalPages}
                      className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      Next
                    </button>
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {readPagination.total} total
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

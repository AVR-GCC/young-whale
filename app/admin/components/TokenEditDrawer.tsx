'use client'

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { Token, TokenStatus, TokenCategory, Confidence, Hashtag } from '@/shared/types'

interface TokenWithHashtags extends Token {
  hashtags: Hashtag[]
  raw_token?: {
    id: string
    raw_payload: Record<string, unknown>
  } | null
}

interface TokenEditDrawerProps {
  tokenId: string
  mode: 'edit' | 'review'
  onClose: () => void
  onUpdate: (token: TokenWithHashtags) => void
  onDelete: (id: string) => void
  onNext?: () => void
  showToast: (message: string, type: 'success' | 'error') => void
}

const STATUS_OPTIONS: TokenStatus[] = ['approved', 'pending_review', 'rejected']
const CATEGORY_OPTIONS: TokenCategory[] = ['Presale', 'Tech', 'Meme', 'RWA']
const CONFIDENCE_OPTIONS: Confidence[] = ['low', 'medium', 'high']

export default function TokenEditDrawer({
  tokenId,
  mode,
  onClose,
  onUpdate,
  onDelete,
  onNext,
  showToast,
}: TokenEditDrawerProps) {
  const [token, setToken] = useState<TokenWithHashtags | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'raw'>('details')
  const [editedToken, setEditedToken] = useState<Partial<TokenWithHashtags>>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRequeueConfirm, setShowRequeueConfirm] = useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [rawJson, setRawJson] = useState<string>('')
  const [tagsArray, setTagsArray] = useState<string[]>([])

  const fetchToken = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/tokens/${tokenId}`)
      const data = await res.json()
      if (res.ok) {
        setToken(data)
        setEditedToken(data)
        if (data.raw_token?.raw_payload) {
          setRawJson(JSON.stringify(data.raw_token.raw_payload, null, 2))
          const tags =
            (data.raw_token.raw_payload.cmc_details as Record<string, unknown>)?.tags ?? []
          setTagsArray(Array.isArray(tags) ? tags : [])
        }
      } else {
        showToast(data.error || 'Failed to load token', 'error')
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to load token', 'error')
    } finally {
      setLoading(false)
    }
  }, [tokenId, showToast])

  useEffect(() => {
    fetchToken()
  }, [fetchToken])

  const handleSave = async () => {
    if (!token) return
    setSaving(true)
    try {
      const body: Record<string, unknown> = {}
      const fields: (keyof Token)[] = [
        'slug',
        'category',
        'short_description',
        'full_description',
        'main_hashtag',
        'logo_url',
        'website_url',
        'social_links',
        'exchange_links',
        'preferred_exchange',
        'start_date',
        'end_date',
        'confidence',
        'status',
        'is_promoted',
        'is_verified',
      ]
      for (const field of fields) {
        if (field in editedToken && editedToken[field] !== token[field]) {
          body[field] = editedToken[field]
        }
      }

      const res = await fetch(`/api/admin/tokens/${tokenId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Token updated successfully', 'success')
        const updated = { ...token, ...data }
        setToken(updated)
        onUpdate(updated)
      } else {
        showToast(data.error || 'Failed to update token', 'error')
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update token', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleApprove = async () => {
    if (!token) return
    try {
      const res = await fetch(`/api/admin/tokens/${tokenId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Token approved', 'success')
        const updated = { ...token, ...data }
        setToken(updated)
        onUpdate(updated)
        if (mode === 'review' && onNext) {
          onNext()
        }
      } else {
        showToast(data.error || 'Failed to approve token', 'error')
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to approve token', 'error')
    }
  }

  const handleReject = async () => {
    if (!token) return
    try {
      const res = await fetch(`/api/admin/tokens/${tokenId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Token rejected', 'success')
        const updated = { ...token, ...data }
        setToken(updated)
        onUpdate(updated)
        setShowRejectConfirm(false)
        if (mode === 'review' && onNext) {
          onNext()
        }
      } else {
        showToast(data.error || 'Failed to reject token', 'error')
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to reject token', 'error')
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/tokens/${tokenId}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Token deleted', 'success')
        onDelete(tokenId)
      } else {
        const data = await res.json()
        showToast(data.error || 'Failed to delete token', 'error')
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete token', 'error')
    }
  }

  const handleRequeue = async () => {
    try {
      const res = await fetch(`/api/admin/tokens/${tokenId}/requeue`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        showToast('Token re-queued for reprocessing', 'success')
        onDelete(tokenId)
      } else {
        showToast(data.error || 'Failed to re-queue token', 'error')
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to re-queue token', 'error')
    }
  }

  const updateField = <K extends keyof Token>(field: K, value: Token[K]) => {
    setEditedToken((prev) => ({ ...prev, [field]: value }))
  }

  const updateSocialLink = (platform: 'twitter' | 'telegram' | 'discord' | 'facebook', value: string) => {
    setEditedToken((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value,
      },
    }))
  }

  const updateExchangeLink = (index: number, value: string) => {
    setEditedToken((prev) => {
      const links = [...(prev.exchange_links ?? token?.exchange_links ?? [])]
      links[index] = value
      return { ...prev, exchange_links: links }
    })
  }

  const addExchangeLink = () => {
    setEditedToken((prev) => ({
      ...prev,
      exchange_links: [...(prev.exchange_links ?? token?.exchange_links ?? []), ''],
    }))
  }

  const removeExchangeLink = (index: number) => {
    setEditedToken((prev) => {
      const links = [...(prev.exchange_links ?? token?.exchange_links ?? [])]
      links.splice(index, 1)
      return { ...prev, exchange_links: links }
    })
  }

  const currentToken = { ...token, ...editedToken } as TokenWithHashtags
  const exchangeLinks = editedToken.exchange_links ?? token?.exchange_links ?? []

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 h-full overflow-y-auto shadow-xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                {mode === 'review' ? 'Review Token' : 'Edit Token'}
              </h2>
              {token && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {token.name} ({token.symbol}) — {token.chain}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-2xl"
            >
              ×
            </button>
          </div>

          {mode === 'review' && (
            <div className="flex gap-3 mb-4">
              <button
                onClick={handleApprove}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors"
              >
                Approve ✓
              </button>
              <button
                onClick={() => setShowRejectConfirm(true)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-colors"
              >
                Reject ✗
              </button>
              {onNext && (
                <button
                  onClick={onNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          )}

          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                activeTab === 'details'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                activeTab === 'raw'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Raw Data
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              ))}
            </div>
          ) : !token ? (
            <p className="text-zinc-500 dark:text-zinc-400">Failed to load token</p>
          ) : activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Read-only fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Name
                  </label>
                  <div className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded text-sm text-zinc-700 dark:text-zinc-300">
                    {token.name}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Symbol
                  </label>
                  <div className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded text-sm text-zinc-700 dark:text-zinc-300">
                    {token.symbol}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Chain
                  </label>
                  <div className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded text-sm text-zinc-700 dark:text-zinc-300">
                    {token.chain}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Contract Address
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded text-sm text-zinc-700 dark:text-zinc-300 truncate font-mono">
                      {token.contract_address ?? 'N/A'}
                    </div>
                    {token.contract_address && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(token.contract_address!)
                          showToast('Copied to clipboard', 'success')
                        }}
                        className="px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600"
                      >
                        Copy
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Editable fields */}
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={currentToken.slug ?? ''}
                  onChange={(e) => updateField('slug', e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Category
                </label>
                <select
                  value={currentToken.category ?? ''}
                  onChange={(e) => updateField('category', e.target.value as TokenCategory)}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                >
                  <option value="">Select category...</option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Short Description (max 6 words, beginner-friendly)
                </label>
                <input
                  type="text"
                  value={currentToken.short_description ?? ''}
                  onChange={(e) => updateField('short_description', e.target.value)}
                  maxLength={60}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                />
                <p className="text-xs text-zinc-400 mt-1">
                  {(currentToken.short_description?.length ?? 0)}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Full Description
                </label>
                <textarea
                  value={currentToken.full_description ?? ''}
                  onChange={(e) => updateField('full_description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                />
              </div>

              {/* Immutable Hashtags */}
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Hashtags
                </label>
                <div className="flex flex-wrap gap-2">
                  {token.hashtags.map((h) => (
                    <span
                      key={h.id}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded text-xs"
                    >
                      {h.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Main Hashtag
                </label>
                <select
                  value={currentToken.main_hashtag ?? ''}
                  onChange={(e) => updateField('main_hashtag', e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                >
                  <option value="">Select main hashtag...</option>
                  {token.hashtags.map((h) => (
                    <option key={h.id} value={h.name}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Logo */}
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={currentToken.logo_url ?? ''}
                  onChange={(e) => updateField('logo_url', e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                />
                {currentToken.logo_url && (
                  <Image
                    src={currentToken.logo_url}
                    alt="Logo preview"
                    width={64}
                    height={64}
                    className="mt-2 rounded object-cover"
                    unoptimized
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={currentToken.website_url ?? ''}
                  onChange={(e) => updateField('website_url', e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                />
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Social Links
                </label>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Twitter</label>
                  <input
                    type="url"
                    value={currentToken.social_links?.twitter ?? ''}
                    onChange={(e) => updateSocialLink('twitter', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Telegram</label>
                  <input
                    type="url"
                    value={currentToken.social_links?.telegram ?? ''}
                    onChange={(e) => updateSocialLink('telegram', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Discord</label>
                  <input
                    type="url"
                    value={currentToken.social_links?.discord ?? ''}
                    onChange={(e) => updateSocialLink('discord', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={currentToken.social_links?.facebook ?? ''}
                    onChange={(e) => updateSocialLink('facebook', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                  />
                </div>
              </div>

              {/* Exchange Links */}
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Exchange Links
                </label>
                <div className="space-y-2">
                  {exchangeLinks.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => updateExchangeLink(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                      />
                      <button
                        onClick={() => removeExchangeLink(index)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addExchangeLink}
                  className="mt-2 px-3 py-1.5 text-xs bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  + Add Exchange Link
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Preferred Exchange
                </label>
                <select
                  value={currentToken.preferred_exchange ?? ''}
                  onChange={(e) => updateField('preferred_exchange', e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                >
                  <option value="">Select preferred exchange...</option>
                  {exchangeLinks
                    .filter((l) => l.trim())
                    .map((link, i) => (
                      <option key={i} value={link}>
                        {link}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    value={currentToken.start_date?.slice(0, 16) ?? ''}
                    onChange={(e) => updateField('start_date', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    value={currentToken.end_date?.slice(0, 16) ?? ''}
                    onChange={(e) => updateField('end_date', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Confidence
                </label>
                <select
                  value={currentToken.confidence ?? ''}
                  onChange={(e) => updateField('confidence', e.target.value as Confidence)}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                >
                  <option value="">Select confidence...</option>
                  {CONFIDENCE_OPTIONS.map((conf) => (
                    <option key={conf} value={conf}>
                      {conf}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  Status
                </label>
                <select
                  value={currentToken.status ?? ''}
                  onChange={(e) => updateField('status', e.target.value as TokenStatus)}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 text-sm"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Promoted
                  </label>
                  <button
                    onClick={() => updateField('is_promoted', !currentToken.is_promoted)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      currentToken.is_promoted ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        currentToken.is_promoted ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Verified
                  </label>
                  <button
                    onClick={() => updateField('is_verified', !currentToken.is_verified)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      currentToken.is_verified ? 'bg-green-600' : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        currentToken.is_verified ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {tagsArray.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                    Tags from CMC
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tagsArray.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  Raw Token Payload
                </label>
                {rawJson ? (
                  <pre className="bg-zinc-900 text-zinc-100 p-4 rounded text-xs overflow-x-auto max-h-[60vh] overflow-y-auto">
                    {rawJson}
                  </pre>
                ) : (
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded text-sm text-zinc-500 dark:text-zinc-400">
                    No raw data available for this token.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'details' && (
          <div className="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => setShowRejectConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => setShowRequeueConfirm(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded font-medium hover:bg-yellow-700 transition-colors"
            >
              Re-queue
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-zinc-600 text-white rounded font-medium hover:bg-zinc-700 transition-colors ml-auto"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2">
              Delete Token
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 mb-6">
              Are you sure you want to delete this token? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requeue Confirmation */}
      {showRequeueConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2">
              Re-queue for Reprocessing
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 mb-6">
              This will delete this processed token and add the raw token back to the processing queue. All current data will be lost.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRequeueConfirm(false)}
                className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRequeue}
                className="px-4 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
              >
                Re-queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation */}
      {showRejectConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2">
              Reject Token
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 mb-6">
              Are you sure you want to reject this token?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRejectConfirm(false)}
                className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

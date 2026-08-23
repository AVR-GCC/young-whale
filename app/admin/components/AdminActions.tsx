'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'

interface AdminActionsProps {
  userEmail: string
}

export default function AdminActions({ userEmail }: AdminActionsProps) {
  const [processStatus, setProcessStatus] = useState<string>('')
  const [processLoading, setProcessLoading] = useState(false)
  const [ingestStatus, setIngestStatus] = useState<string>('')
  const [ingestLoading, setIngestLoading] = useState(false)
  const [availableTokens, setAvailableTokens] = useState<number | null>(null)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearPollInterval = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return clearPollInterval
  }, [clearPollInterval])

  const fetchAvailableTokens = async () => {
    try {
      const { count, error } = await supabase
        .from('processing_queue')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'queued')

      if (error) {
        console.error('Error fetching available tokens:', error)
        return null
      }

      return count
    } catch (err) {
      console.error('Error fetching available tokens:', err)
      return null
    }
  }

  useEffect(() => {
    fetchAvailableTokens().then(count => {
      if (count !== null) setAvailableTokens(count)
    })
  }, [])

  const pollStatus = useCallback((runId: string) => {
    clearPollInterval()

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/cron/process/status?runId=${runId}`)
        const data = await res.json()

        if (!res.ok) {
          setProcessStatus(`Error checking status: ${data.error || 'Unknown error'}`)
          setProcessLoading(false)
          clearPollInterval()
          return
        }

        if (data.status === 'completed') {
          setProcessStatus(`Completed! Processed: ${data.processed}, Failed: ${data.failed}`)
          setProcessLoading(false)
          clearPollInterval()
          fetchAvailableTokens().then(count => {
            if (count !== null) setAvailableTokens(count)
          })
        } else if (data.status === 'failed') {
          setProcessStatus(`Failed: ${data.errorMessage || 'Unknown error'}`)
          setProcessLoading(false)
          clearPollInterval()
          fetchAvailableTokens().then(count => {
            if (count !== null) setAvailableTokens(count)
          })
        } else {
          setProcessStatus(`Processing...\n${data.message || ''}`)
        }
      } catch (err) {
        setProcessStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setProcessLoading(false)
        clearPollInterval()
      }
    }, 2000)
  }, [clearPollInterval])

  const runProcess = useCallback(async () => {
    setProcessLoading(true)
    setProcessStatus('Starting...')
    try {
      const res = await fetch('/api/cron/process')
      const data = await res.json()

      if (!res.ok) {
        setProcessStatus(`Error: ${data.error || 'Unknown error'}`)
        setProcessLoading(false)
        return
      }

      if (data.runId) {
        pollStatus(data.runId)
      } else {
        setProcessStatus('Started but no run ID received')
        setProcessLoading(false)
      }
    } catch (err) {
      setProcessStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setProcessLoading(false)
    }
  }, [pollStatus])

  const runIngest = useCallback(async () => {
    setIngestLoading(true)
    setIngestStatus('Starting ingestion...')
    try {
      const res = await fetch('/api/cron/ingest')
      const data = await res.json()

      if (!res.ok) {
        setIngestStatus(`Error: ${data.error || 'Unknown error'}`)
        setIngestLoading(false)
        return
      }

      setIngestStatus(`Ingested ${data.imported} tokens`)
      setIngestLoading(false)
      fetchAvailableTokens().then(count => {
        if (count !== null) setAvailableTokens(count)
      })
    } catch (err) {
      setIngestStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setIngestLoading(false)
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-1 w-80 h-20">
        <button
          onClick={runProcess}
          disabled={processLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-[80%]"
        >
          {processLoading ? 'Running Process...' : 'Run Process'}
        </button>
        {processStatus && (
          <p className={`text-sm text-center whitespace-pre-line ${processStatus.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
            {processStatus}
          </p>
        )}
        {availableTokens !== null && !processStatus && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {availableTokens} token{availableTokens !== 1 ? 's' : ''} available
          </span>
        )}
      </div>
      <div className="flex flex-col items-center gap-1 w-80 h-20">
        <button
          onClick={runIngest}
          disabled={ingestLoading}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed w-[80%]"
        >
          {ingestLoading ? 'Running Ingest...' : 'Run Ingest'}
        </button>
        {ingestStatus && (
          <p className={`text-sm text-center whitespace-pre-line ${ingestStatus.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
            {ingestStatus}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">{userEmail}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

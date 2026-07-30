'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'

interface AdminActionsProps {
  userEmail: string
}

export default function AdminActions({ userEmail }: AdminActionsProps) {
  const [processStatus, setProcessStatus] = useState<string>('')
  const [processLoading, setProcessLoading] = useState(false)
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
        } else if (data.status === 'failed') {
          setProcessStatus(`Failed: ${data.errorMessage || 'Unknown error'}`)
          setProcessLoading(false)
          clearPollInterval()
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

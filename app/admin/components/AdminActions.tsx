'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

export default function AdminActions() {
  const [resetStatus, setResetStatus] = useState<string>('')
  const [processStatus, setProcessStatus] = useState<string>('')
  const [resetLoading, setResetLoading] = useState(false)
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

  const runReset = useCallback(async () => {
    setResetLoading(true)
    setResetStatus('')
    try {
      const res = await fetch('/api/admin/reset')
      const data = await res.json()
      if (res.ok) {
        setResetStatus(`Success: ${data.message}`)
      } else {
        setResetStatus(`Error: ${data.error || 'Unknown error'}`)
      }
    } catch (err) {
      setResetStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setResetLoading(false)
    }
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
        } else if (data.status === 'failed') {
          setProcessStatus(`Failed: ${data.errorMessage || 'Unknown error'}`)
          setProcessLoading(false)
          clearPollInterval()
        } else {
          setProcessStatus('Processing...')
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

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-1 w-80">
        <button
          onClick={runReset}
          disabled={resetLoading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed w-[80%]"
        >
          {resetLoading ? 'Running Reset...' : 'Run Reset'}
        </button>
        {resetStatus && (
          <p className={`text-sm text-center ${resetStatus.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
            {resetStatus}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-1 w-80">
        <button
          onClick={runProcess}
          disabled={processLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-[80%]"
        >
          {processLoading ? 'Running Process...' : 'Run Process'}
        </button>
        {processStatus && (
          <p className={`text-sm text-center ${processStatus.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
            {processStatus}
          </p>
        )}
      </div>
    </div>
  )
}

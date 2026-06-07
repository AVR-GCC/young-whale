'use client'

import { useState, useCallback } from 'react'

export default function Admin() {
  const [resetStatus, setResetStatus] = useState<string>('')
  const [processStatus, setProcessStatus] = useState<string>('')
  const [resetLoading, setResetLoading] = useState(false)
  const [processLoading, setProcessLoading] = useState(false)

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

  const runProcess = useCallback(async () => {
    setProcessLoading(true)
    setProcessStatus('')
    try {
      const res = await fetch('/api/cron/process')
      const data = await res.json()
      if (res.ok) {
        setProcessStatus(`Processed: ${data.processed}, Failed: ${data.failed}`)
      } else {
        setProcessStatus(`Error: ${data.error || 'Unknown error'}`)
      }
    } catch (err) {
      setProcessStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setProcessLoading(false)
    }
  }, [])

  return (
    <div className="flex flex-col flex-1 w-full bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full flex-col py-8 px-16 bg-white dark:bg-black gap-8">
        <div className="flex items-start justify-between w-full">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Young Whale admin
          </h1>

          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1 w-80">
              <button
                onClick={runReset}
                disabled={resetLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed w-[50%]"
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
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-[50%]"
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
        </div>
      </main>
    </div>
  )
}

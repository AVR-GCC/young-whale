'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function DebugPage() {
  const [session, setSession] = useState<unknown>(null)
  const [user, setUser] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        setSession(sessionData.session)

        const { data: userData } = await supabase.auth.getUser()
        setUser(userData.user)
      } catch (err) {
        console.error('Debug error:', err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Session:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(session, null, 2) || 'No session'}
        </pre>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">User:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(user, null, 2) || 'No user'}
        </pre>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => supabase.auth.signOut()}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Sign Out
        </button>
        <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">
          Go to Login
        </a>
      </div>
    </div>
  )
}

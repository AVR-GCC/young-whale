// lib/supabase/service.ts
// Service role client — uses SERVICE_ROLE_KEY
// NEVER import this in frontend components
// Only use in Next.js API routes (app/api/**)
// Bypasses RLS — full database access

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase service role environment variables')
}

export const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    // Disable auto session management — this is a server-only client
    autoRefreshToken: false,
    persistSession: false
  }
})

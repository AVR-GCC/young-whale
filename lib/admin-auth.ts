import 'server-only'

import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseService } from '@/lib/supabase/service'

export interface AdminUser {
  id: string
  email: string
  role: string
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  const { data: adminUser, error: adminError } = await supabaseService
    .from('admin_users')
    .select('id, email, role')
    .eq('id', user.id)
    .single()

  if (adminError || !adminUser) {
    return null
  }

  return adminUser as AdminUser
}

export async function requireAdmin(): Promise<AdminUser> {
  const adminUser = await getAdminUser()

  if (!adminUser) {
    redirect('/login')
  }

  return adminUser
}

export async function requireAdminApi(): Promise<AdminUser | NextResponse> {
  const adminUser = await getAdminUser()

  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return adminUser
}

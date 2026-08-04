import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'

const EMAIL_OCTOPUS_API_KEY = process.env.EMAIL_OCTOPUS_API_KEY ?? 'YOUR_API_KEY_HERE'
const EMAIL_OCTOPUS_LIST_ID = process.env.EMAIL_OCTOPUS_LIST_ID ?? 'YOUR_LIST_ID_HERE'
const EMAIL_OCTOPUS_API_URL = 'https://api.emailoctopus.com'

async function registerWithEmailOctopus(email: string) {
  try {
    const response = await fetch(
      `${EMAIL_OCTOPUS_API_URL}/lists/${EMAIL_OCTOPUS_LIST_ID}/contacts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${EMAIL_OCTOPUS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          tags: ['website-signup'],
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('EmailOctopus API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      })
      return false
    }

    return true
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Failed to register with EmailOctopus:', message)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Check if email already exists
    const { data: existing, error: fetchError } = await supabaseService
      .from('email_subscriptions')
      .select('id, is_active')
      .eq('email', normalizedEmail)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is expected for new emails
      console.error('Failed to check existing subscription:', fetchError.message)
      return NextResponse.json(
        { error: 'Failed to process subscription' },
        { status: 500 }
      )
    }

    if (existing) {
      if (existing.is_active) {
        // Already subscribed and active
        return NextResponse.json(
          { success: true, message: 'Already subscribed', id: existing.id },
          { status: 200 }
        )
      }

      // Exists but inactive — reactivate
      const { data: updated, error: updateError } = await supabaseService
        .from('email_subscriptions')
        .update({ is_active: true })
        .eq('id', existing.id)
        .select()
        .single()

      if (updateError) {
        console.error('Failed to reactivate subscription:', updateError.message)
        return NextResponse.json(
          { error: 'Failed to reactivate subscription' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { success: true, message: 'Subscription reactivated', id: updated.id },
        { status: 200 }
      )
    }

    // New subscription
    const { data: inserted, error: insertError } = await supabaseService
      .from('email_subscriptions')
      .insert({ email: normalizedEmail, is_active: true })
      .select()
      .single()

    if (insertError) {
      console.error('Failed to create subscription:', insertError.message)
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      )
    }

    // Register with EmailOctopus
    const emailOctopusSuccess = await registerWithEmailOctopus(normalizedEmail)

    return NextResponse.json(
      {
        success: true,
        message: 'Subscribed successfully',
        id: inserted.id,
        emailOctopusRegistered: emailOctopusSuccess,
      },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Subscribe POST error:', message)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

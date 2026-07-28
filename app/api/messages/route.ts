import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, content } = body

    if (!name || !email || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, content' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseService
      .from('messages')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        content: content.trim(),
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create message:', error.message)
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully', id: data.id },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Messages POST error:', message)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

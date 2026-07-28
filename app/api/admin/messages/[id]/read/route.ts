import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase/service'

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseService
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Failed to mark message as read:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Message marked as read',
      data,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Mark as read PATCH error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

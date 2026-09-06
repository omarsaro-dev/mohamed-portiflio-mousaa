'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useToast } from './toast'

interface InsertPayload {
  new?: {
    name?: string | null
    service?: string | null
    lead_score?: number | null
  }
}

export function RealtimeLeadsToasts() {
  const { toast } = useToast()
  const router = useRouter()
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    if (!isSupabaseConfigured()) return
    const client = getSupabaseBrowserClient()
    if (!client) return

    const channel = client
      .channel('admin-leads-insert')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mousaa_leads' },
        (payload) => {
          const row = (payload as InsertPayload).new
          const name = row?.name?.trim() || 'New inquiry'
          const detail = row?.service?.trim()
            ? `${name} — ${row.service.trim()}`
            : name
          toast('info', 'New lead received', detail)
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      client.removeChannel(channel)
    }
  }, [toast, router])

  return null
}
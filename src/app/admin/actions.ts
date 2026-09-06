'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { LEAD_STATUSES, type LeadStatus } from '@/types/lead'

export interface ActionResult {
  ok: boolean
  error?: string
  id?: string
}

const LEAD_STATUS_VALUES = LEAD_STATUSES.map((s) => s.value) as LeadStatus[]

function logError(scope: string, error: unknown) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[admin:${scope}]`, error)
  }
}

async function getAuthedClient() {
  const client = await getSupabaseServerClient()
  if (!client) return null
  const {
    data: { user },
  } = await client.auth.getUser()
  if (!user) return null
  return client
}

export interface UpdateLeadInput {
  id: string
  name: string
  email: string
  phone: string
  service: string
  project_type: string
  budget: string
  location: string
  timeline: string
  message: string
  lead_score: number
  lead_status: LeadStatus
  email_sent: boolean
  telegram_sent: boolean
}

export async function updateLeadAction(input: UpdateLeadInput): Promise<ActionResult> {
  const client = await getAuthedClient()
  if (!client) return { ok: false, error: 'You must be signed in to update leads.' }

  const name = input.name.trim()
  const email = input.email.trim()
  const score = Math.round(Number(input.lead_score))
  if (!name || !email) return { ok: false, error: 'Name and email are required.' }
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    return { ok: false, error: 'Lead score must be between 0 and 100.' }
  }
  if (!LEAD_STATUS_VALUES.includes(input.lead_status)) {
    return { ok: false, error: 'Invalid lead status.' }
  }

  const { error } = await client
    .from('mousaa_leads')
    .update({
      name,
      email,
      phone: input.phone.trim(),
      service: input.service.trim(),
      project_type: input.project_type.trim(),
      budget: input.budget.trim(),
      location: input.location.trim(),
      timeline: input.timeline.trim(),
      message: input.message.trim(),
      lead_score: score,
      lead_status: input.lead_status,
      email_sent: Boolean(input.email_sent),
      telegram_sent: Boolean(input.telegram_sent),
    })
    .eq('id', input.id)

  if (error) {
    logError('update', error)
    return { ok: false, error: 'Could not update this lead. Please try again.' }
  }

  revalidatePath('/admin', 'layout')
  revalidatePath(`/admin/leads/${input.id}`)
  return { ok: true, id: input.id }
}

export async function setLeadStatusAction(
  id: string,
  status: LeadStatus
): Promise<ActionResult> {
  const client = await getAuthedClient()
  if (!client) return { ok: false, error: 'You must be signed in to update leads.' }
  if (!LEAD_STATUS_VALUES.includes(status)) return { ok: false, error: 'Invalid lead status.' }

  const { error } = await client.from('mousaa_leads').update({ lead_status: status }).eq('id', id)
  if (error) {
    logError('status', error)
    return { ok: false, error: 'Could not update the lead status. Please try again.' }
  }

  revalidatePath('/admin', 'layout')
  revalidatePath(`/admin/leads/${id}`)
  return { ok: true, id }
}

export async function deleteLeadAction(id: string): Promise<ActionResult> {
  const client = await getAuthedClient()
  if (!client) return { ok: false, error: 'You must be signed in to delete leads.' }

  const { error } = await client.from('mousaa_leads').delete().eq('id', id)
  if (error) {
    logError('delete', error)
    return { ok: false, error: 'Could not delete this lead. Please try again.' }
  }

  revalidatePath('/admin', 'layout')
  revalidatePath(`/admin/leads/${id}`)
  return { ok: true, id }
}
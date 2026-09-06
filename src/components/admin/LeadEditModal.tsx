'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Modal from './Modal'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { updateLeadAction } from '@/app/admin/actions'
import { LEAD_STATUSES, type LeadRow, type LeadStatus } from '@/types/lead'
import { SERVICE_OPTIONS, BUDGET_OPTIONS, TIMELINE_OPTIONS } from '@/config/inquiry'
import { useToast } from './toast'
import { ErrorState, Skeleton } from './StateViews'

interface LeadEditModalProps {
  open: boolean
  leadId: string | null
  onClose: () => void
}

interface Draft {
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

type FieldErrors = Partial<Record<keyof Draft, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function toDraft(row: LeadRow): Draft {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? '',
    service: row.service ?? '',
    project_type: row.project_type ?? '',
    budget: row.budget ?? '',
    location: row.location ?? '',
    timeline: row.timeline ?? '',
    message: row.message ?? '',
    lead_score: row.lead_score,
    lead_status: row.lead_status,
    email_sent: row.email_sent,
    telegram_sent: row.telegram_sent,
  }
}

function validate(draft: Draft): FieldErrors {
  const errors: FieldErrors = {}
  if (!draft.name.trim()) errors.name = 'Name is required.'
  if (!draft.email.trim()) errors.email = 'Email is required.'
  else if (!EMAIL_RE.test(draft.email.trim())) errors.email = 'Please enter a valid email.'
  if (!Number.isInteger(draft.lead_score) || draft.lead_score < 0 || draft.lead_score > 100) {
    errors.lead_score = 'Score must be an integer from 0 to 100.'
  }
  return errors
}

const inputClass =
  'w-full border-0 border-b border-white/10 bg-transparent py-3 text-sm text-[#F5F5F5] outline-none transition-colors duration-200 focus:border-amber-400/70 placeholder:text-white/25'
const labelClass = 'mb-2 block font-mono text-[10px] uppercase tracking-[0.24em] text-white/40'

export default function LeadEditModal({ open, leadId, onClose }: LeadEditModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [draft, setDraft] = useState<Draft | null>(null)
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open || !leadId) {
      setDraft(null)
      setLoadState('idle')
      setErrors({})
      return
    }

    let cancelled = false
    setLoadState('loading')
    setErrors({})

    const client = getSupabaseBrowserClient()
    if (!client) {
      setLoadState('error')
      return
    }

    void (async () => {
      const { data, error } = await client
        .from('mousaa_leads')
        .select('*')
        .eq('id', leadId)
        .maybeSingle()
      if (cancelled) return
      if (error || !data) {
        setLoadState('error')
        return
      }
      setDraft(toDraft(data as LeadRow))
      setLoadState('ready')
    })()

    return () => {
      cancelled = true
    }
  }, [open, leadId])

  const setField = useCallback(<K extends keyof Draft>(field: K, value: Draft[K]) => {
    setDraft((current) => (current ? { ...current, [field]: value } : current))
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))
  }, [])

  const handleSave = async () => {
    if (!draft) return
    const nextErrors = validate(draft)
    setErrors(nextErrors)
    const firstError = (Object.keys(nextErrors) as (keyof Draft)[]).find((k) => nextErrors[k])
    if (firstError) {
      document.getElementById(`edit-${firstError}`)?.focus()
      return
    }

    setSaving(true)
    const result = await updateLeadAction(draft)
    setSaving(false)

    if (result.ok) {
      toast('success', 'Lead updated', 'Changes have been saved to Supabase.')
      onClose()
      router.refresh()
    } else {
      toast('error', 'Update failed', result.error)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Lead"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="border border-white/15 px-6 py-2.5 text-xs uppercase tracking-widest text-white/65 transition-colors hover:border-white/30 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loadState !== 'ready'}
            className="bg-amber-500 px-6 py-2.5 text-xs uppercase tracking-widest text-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Lead'}
          </button>
        </>
      }
    >
      {loadState === 'loading' && (
        <div className="space-y-6 py-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {loadState === 'error' && (
        <ErrorState title="Could not load lead" message="The lead could not be fetched. Please try again." />
      )}

      {loadState === 'ready' && draft && (
        <div className="space-y-7 py-1">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-name" className={labelClass}>
                Name *
              </label>
              <input
                id="edit-name"
                value={draft.name}
                onChange={(e) => setField('name', e.target.value)}
                className={inputClass}
              />
              {errors.name && <p className="mt-1.5 text-[11px] text-amber-400">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="edit-email" className={labelClass}>
                Email *
              </label>
              <input
                id="edit-email"
                type="email"
                value={draft.email}
                onChange={(e) => setField('email', e.target.value)}
                className={inputClass}
              />
              {errors.email && <p className="mt-1.5 text-[11px] text-amber-400">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="edit-phone" className={labelClass}>
                Phone
              </label>
              <input
                id="edit-phone"
                value={draft.phone}
                onChange={(e) => setField('phone', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="edit-location" className={labelClass}>
                Location
              </label>
              <input
                id="edit-location"
                value={draft.location}
                onChange={(e) => setField('location', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="edit-service" className={labelClass}>
                Service
              </label>
              <select
                id="edit-service"
                value={draft.service}
                onChange={(e) => setField('service', e.target.value)}
                className={inputClass}
              >
                <option value="">—</option>
                {SERVICE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="edit-project_type" className={labelClass}>
                Project Type
              </label>
              <input
                id="edit-project_type"
                value={draft.project_type}
                onChange={(e) => setField('project_type', e.target.value)}
                placeholder="e.g. Residential, Villa…"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="edit-budget" className={labelClass}>
                Budget
              </label>
              <select
                id="edit-budget"
                value={draft.budget}
                onChange={(e) => setField('budget', e.target.value)}
                className={inputClass}
              >
                <option value="">—</option>
                {BUDGET_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="edit-timeline" className={labelClass}>
                Timeline
              </label>
              <select
                id="edit-timeline"
                value={draft.timeline}
                onChange={(e) => setField('timeline', e.target.value)}
                className={inputClass}
              >
                <option value="">—</option>
                {TIMELINE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edit-lead_score" className={labelClass}>
                Lead Score (0–100)
              </label>
              <input
                id="edit-lead_score"
                type="number"
                min={0}
                max={100}
                value={draft.lead_score}
                onChange={(e) => setField('lead_score', Number(e.target.value))}
                className={inputClass}
              />
              {errors.lead_score && (
                <p className="mt-1.5 text-[11px] text-amber-400">{errors.lead_score}</p>
              )}
            </div>
            <div>
              <label htmlFor="edit-lead_status" className={labelClass}>
                Lead Status
              </label>
              <select
                id="edit-lead_status"
                value={draft.lead_status}
                onChange={(e) => setField('lead_status', e.target.value as LeadStatus)}
                className={inputClass}
              >
                {LEAD_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="edit-message" className={labelClass}>
              Project Message
            </label>
            <textarea
              id="edit-message"
              rows={5}
              value={draft.message}
              onChange={(e) => setField('message', e.target.value)}
              className="w-full resize-none border-0 border-b border-white/10 bg-transparent py-3 text-sm leading-relaxed text-[#F5F5F5] outline-none transition-colors focus:border-amber-400/70"
            />
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <label className="flex items-center gap-2.5 text-sm text-white/65">
              <input
                type="checkbox"
                checked={draft.email_sent}
                onChange={(e) => setField('email_sent', e.target.checked)}
                className="h-4 w-4 accent-amber-500"
              />
              Email sent
            </label>
            <label className="flex items-center gap-2.5 text-sm text-white/65">
              <input
                type="checkbox"
                checked={draft.telegram_sent}
                onChange={(e) => setField('telegram_sent', e.target.checked)}
                className="h-4 w-4 accent-amber-500"
              />
              Telegram sent
            </label>
          </div>
        </div>
      )}
    </Modal>
  )
}
export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'won'
  | 'lost'
  | 'cold'
  | 'warm'
  | 'hot'

export interface LeadRow {
  id: string
  name: string
  email: string
  phone: string | null
  service: string | null
  project_type: string | null
  budget: string | null
  location: string | null
  timeline: string | null
  message: string | null
  lead_score: number
  lead_status: LeadStatus
  source: string | null
  email_sent: boolean
  telegram_sent: boolean
  created_at: string
  updated_at: string
}

export interface LeadListItem {
  id: string
  name: string
  email: string
  phone: string | null
  service: string | null
  project_type: string | null
  budget: string | null
  location: string | null
  timeline: string | null
  lead_score: number
  lead_status: LeadStatus
  created_at: string
}

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
  { value: 'cold', label: 'Cold' },
  { value: 'warm', label: 'Warm' },
  { value: 'hot', label: 'Hot' },
]

export function leadStatusLabel(status: string | null | undefined): string {
  const found = LEAD_STATUSES.find((s) => s.value === status)
  return found ? found.label : 'Unknown'
}

export const STATUS_COLORS: Record<string, string> = {
  new: '#fbbf24',
  contacted: '#38bdf8',
  qualified: '#a78bfa',
  won: '#34d399',
  lost: '#a1a1aa',
  cold: '#38bdf8',
  warm: '#fbbf24',
  hot: '#f87171',
}

export function leadStatusColor(status: string | null | undefined): string {
  return status ? (STATUS_COLORS[status] ?? '#a1a1aa') : '#a1a1aa'
}

export type ScoreBucket = 'low' | 'cold' | 'warm' | 'hot'

export function leadScoreBucket(score: number | null | undefined): ScoreBucket {
  if (score === null || score === undefined) return 'low'
  if (score < 40) return 'low'
  if (score < 60) return 'cold'
  if (score < 80) return 'warm'
  return 'hot'
}

export function leadScoreLabel(score: number | null | undefined): string {
  const bucket = leadScoreBucket(score)
  return { low: 'Low Intent', cold: 'Cold', warm: 'Warm', hot: 'Hot' }[bucket]
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
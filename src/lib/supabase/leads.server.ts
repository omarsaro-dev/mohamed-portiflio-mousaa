import type { SupabaseServerClient } from '@/lib/supabase/server'
import type { LeadListItem, LeadRow, LeadStatus } from '@/types/lead'
import type { PostgrestError } from '@supabase/supabase-js'

const LIST_COLUMNS =
  'id,name,email,phone,service,project_type,budget,location,timeline,lead_score,lead_status,created_at'

function sanitizeSearch(value: string): string {
  return value.replace(/[%_]/g, '').trim()
}

function friendlyError(error: PostgrestError | null, fallback: string): string {
  if (!error) return fallback
  if (process.env.NODE_ENV !== 'production') {
    console.error('[leads]', error.message, error.code)
  }
  if (error.code === '42P01') return 'The leads table could not be found. Run the setup migration in Supabase.'
  if (error.code === '42501') return 'You do not have permission to access this data.'
  if (error.code === 'PGRST116') return 'Lead not found.'
  return fallback
}

export type LeadsSort = 'newest' | 'oldest' | 'score-desc' | 'score-asc'

export interface LeadsQuery {
  page?: number
  pageSize?: number
  search?: string
  status?: string | null
  service?: string | null
  budget?: string | null
  timeline?: string | null
  sort?: LeadsSort
}

export interface LeadsResult {
  leads: LeadListItem[]
  total: number
  error: string | null
}

export async function listLeads(client: SupabaseServerClient, query: LeadsQuery): Promise<LeadsResult> {
  const pageSize = Math.min(50, Math.max(5, query.pageSize ?? 15))
  const page = Math.max(1, query.page ?? 1)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let builder = client
    .from('mousaa_leads')
    .select(LIST_COLUMNS, { count: 'exact' })

  const search = sanitizeSearch(query.search ?? '')
  if (search) {
    builder = builder.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,location.ilike.%${search}%`
    )
  }
  if (query.status) builder = builder.eq('lead_status', query.status)
  if (query.service) builder = builder.eq('service', query.service)
  if (query.budget) builder = builder.eq('budget', query.budget)
  if (query.timeline) builder = builder.eq('timeline', query.timeline)

  switch (query.sort ?? 'newest') {
    case 'oldest':
      builder = builder.order('created_at', { ascending: true })
      break
    case 'score-desc':
      builder = builder.order('lead_score', { ascending: false })
      break
    case 'score-asc':
      builder = builder.order('lead_score', { ascending: true })
      break
    default:
      builder = builder.order('created_at', { ascending: false })
  }

  builder = builder.range(from, to)

  const { data, error, count } = await builder

  if (error) return { leads: [], total: 0, error: friendlyError(error, 'Unable to load leads right now.') }
  return { leads: (data as LeadListItem[]) ?? [], total: count ?? 0, error: null }
}

export interface LeadDetailResult {
  lead: LeadRow | null
  error: string | null
}

export async function getLead(client: SupabaseServerClient, id: string): Promise<LeadDetailResult> {
  const { data, error } = await client
    .from('mousaa_leads')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) return { lead: null, error: friendlyError(error, 'Unable to load this lead.') }
  return { lead: (data as LeadRow) ?? null, error: null }
}

export interface DashboardCounts {
  total: number
  newLeads: number
  hot: number
  contacted: number
  qualified: number
  won: number
  error: string | null
}

async function countByStatus(client: SupabaseServerClient, status: LeadStatus): Promise<number> {
  const { count, error } = await client
    .from('mousaa_leads')
    .select('id', { count: 'exact', head: true })
    .eq('lead_status', status)
  return error ? 0 : (count ?? 0)
}

export async function getDashboardCounts(client: SupabaseServerClient): Promise<DashboardCounts> {
  const [totalResult, newResult, hotResult, contacted, qualified, won] = await Promise.all([
    client.from('mousaa_leads').select('id', { count: 'exact', head: true }),
    client.from('mousaa_leads').select('id', { count: 'exact', head: true }).eq('lead_status', 'new'),
    client.from('mousaa_leads').select('id', { count: 'exact', head: true }).gte('lead_score', 80),
    countByStatus(client, 'contacted'),
    countByStatus(client, 'qualified'),
    countByStatus(client, 'won'),
  ])

  const errored = [totalResult, newResult, hotResult].some((r) => r.error)
  if (errored) {
    const first = [totalResult, newResult, hotResult].find((r) => r.error)
    return {
      total: 0,
      newLeads: 0,
      hot: 0,
      contacted,
      qualified,
      won,
      error: friendlyError(first?.error ?? null, 'Unable to load lead statistics.'),
    }
  }

  return {
    total: totalResult.count ?? 0,
    newLeads: newResult.count ?? 0,
    hot: hotResult.count ?? 0,
    contacted,
    qualified,
    won,
    error: null,
  }
}

export async function getRecentLeads(
  client: SupabaseServerClient,
  limit = 6
): Promise<{ leads: LeadListItem[]; error: string | null }> {
  const { data, error } = await client
    .from('mousaa_leads')
    .select(LIST_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return { leads: [], error: friendlyError(error, 'Unable to load recent leads.') }
  return { leads: (data as LeadListItem[]) ?? [], error: null }
}

export interface AnalyticsRow {
  id: string
  created_at: string
  service: string | null
  lead_status: LeadStatus
  budget: string | null
  lead_score: number
}

export async function getAnalyticsRows(
  client: SupabaseServerClient
): Promise<{ rows: AnalyticsRow[]; error: string | null }> {
  const { data, error } = await client
    .from('mousaa_leads')
    .select('id, created_at, service, lead_status, budget, lead_score')
    .order('created_at', { ascending: true })

  if (error) return { rows: [], error: friendlyError(error, 'Unable to load analytics.') }
  return { rows: (data as AnalyticsRow[]) ?? [], error: null }
}

export async function countAllLeads(client: SupabaseServerClient): Promise<number> {
  const { count, error } = await client
    .from('mousaa_leads')
    .select('id', { count: 'exact', head: true })
  return error ? -1 : (count ?? 0)
}
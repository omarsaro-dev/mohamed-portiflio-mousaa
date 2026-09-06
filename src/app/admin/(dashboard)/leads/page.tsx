import { getSupabaseServerClient } from '@/lib/supabase/server'
import { listLeads, type LeadsSort } from '@/lib/supabase/leads.server'
import { LEAD_STATUSES, type LeadStatus } from '@/types/lead'
import LeadsToolbar from '@/components/admin/LeadsToolbar'
import LeadTable from '@/components/admin/LeadTable'
import Pagination from '@/components/admin/Pagination'
import { EmptyState, ErrorState } from '@/components/admin/StateViews'

export const dynamic = 'force-dynamic'

interface LeadsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const PAGE_SIZE = 15
const SORTS: LeadsSort[] = ['newest', 'oldest', 'score-desc', 'score-asc']

function single(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value : ''
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const sp = await searchParams

  const page = Math.max(1, Number.parseInt(single(sp.page), 10) || 1)
  const query = single(sp.search)
  const statusValue = single(sp.status)
  const status: LeadStatus | null = LEAD_STATUSES.some((s) => s.value === statusValue)
    ? (statusValue as LeadStatus)
    : null
  const service = single(sp.service) || null
  const budget = single(sp.budget) || null
  const timeline = single(sp.timeline) || null
  const sortValue = single(sp.sort)
  const sort: LeadsSort = (SORTS as string[]).includes(sortValue) ? (sortValue as LeadsSort) : 'newest'

  const toolbarParams: Record<string, string> = {}
  if (query) toolbarParams.search = query
  if (status) toolbarParams.status = status
  if (service) toolbarParams.service = service
  if (budget) toolbarParams.budget = budget
  if (timeline) toolbarParams.timeline = timeline
  if (sort !== 'newest') toolbarParams.sort = sort

  const supabase = await getSupabaseServerClient()
  if (!supabase) return null

  const result = await listLeads(supabase, {
    page,
    pageSize: PAGE_SIZE,
    search: query || undefined,
    status,
    service,
    budget,
    timeline,
    sort,
  })

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/70">
            Inbox
          </p>
          <h1 className="mt-2 font-serif text-3xl text-[#F5F5F5] lg:text-4xl">Leads</h1>
        </div>
        {result.total > 0 && (
          <p className="text-xs text-white/35">
            {result.total} total · page {page} of {Math.max(1, Math.ceil(result.total / PAGE_SIZE))}
          </p>
        )}
      </header>

      <LeadsToolbar pathname="/admin/leads" searchParams={toolbarParams} />

      {result.error ? (
        <ErrorState
          title="Could not load leads"
          message={`${result.error} Verify your Supabase connection and that the setup migration has been run.`}
        />
      ) : result.leads.length === 0 ? (
        <EmptyState
          title={query || status || service || budget || timeline ? 'No leads match your filters' : 'No project inquiries yet'}
          message={
            query || status || service || budget || timeline
              ? 'Try adjusting your search or clearing the filters above.'
              : 'New inquiries submitted through the website appear here automatically.'
          }
        />
      ) : (
        <>
          <LeadTable leads={result.leads} />
          <Pagination
            pathname="/admin/leads"
            searchParams={toolbarParams}
            page={page}
            pageSize={PAGE_SIZE}
            total={result.total}
          />
        </>
      )}
    </div>
  )
}
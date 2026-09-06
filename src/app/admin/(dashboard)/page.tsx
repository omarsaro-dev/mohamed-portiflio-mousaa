import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getDashboardCounts, getRecentLeads } from '@/lib/supabase/leads.server'
import { KpiCard } from '@/components/admin/KpiCard'
import RecentLeadsSection from '@/components/admin/RecentLeadsSection'
import { ErrorState } from '@/components/admin/StateViews'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await getSupabaseServerClient()
  if (!supabase) return null

  const [counts, recent] = await Promise.all([getDashboardCounts(supabase), getRecentLeads(supabase)])

  if (counts.error) {
    return (
      <ErrorState
        title="Could not load overview"
        message={`${counts.error} Verify your Supabase connection and that the setup migration has been run.`}
      />
    )
  }

  const kpis = [
    { label: 'Total Leads', value: counts.total },
    { label: 'New', value: counts.newLeads },
    { label: 'Hot', value: counts.hot },
    { label: 'Contacted', value: counts.contacted },
    { label: 'Qualified', value: counts.qualified },
    { label: 'Won', value: counts.won },
  ]

  return (
    <div className="space-y-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/70">
            Studio Overview
          </p>
          <h1 className="mt-2 font-serif text-3xl text-[#F5F5F5] lg:text-4xl">Dashboard</h1>
        </div>
        <p className="text-xs text-white/35">
          Data is read live from <span className="font-mono text-white/55">public.mousaa_leads</span>
        </p>
      </header>

      <section aria-label="Key metrics" className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} />
        ))}
      </section>

      <section aria-label="Recent leads">
        <RecentLeadsSection leads={recent.leads} />
        {recent.error && (
          <p className="mt-3 text-xs text-rose-300/80">{recent.error}</p>
        )}
      </section>
    </div>
  )
}
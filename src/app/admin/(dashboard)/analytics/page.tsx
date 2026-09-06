import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getAnalyticsRows } from '@/lib/supabase/leads.server'
import { LEAD_STATUSES, leadStatusColor, leadStatusLabel } from '@/types/lead'
import { KpiCard } from '@/components/admin/KpiCard'
import {
  BarList,
  Donut,
  TimeChart,
  type CountDatum,
  type TimeDatum,
} from '@/components/admin/LeadCharts'
import { EmptyState, ErrorState } from '@/components/admin/StateViews'

export const dynamic = 'force-dynamic'

const DAYS = 30

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function shortDay(key: string): string {
  const [, m, d] = key.split('-')
  return `${+m}/${+d}`
}

function buildTimeData(rows: { created_at: string }[]): TimeDatum[] {
  const counts = new Map<string, number>()
  const now = new Date()
  for (let i = DAYS - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    counts.set(dateKey(date), 0)
  }
  for (const row of rows) {
    const date = new Date(row.created_at)
    if (Number.isNaN(date.getTime())) continue
    const key = dateKey(date)
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return Array.from(counts, ([date, count]) => ({ date, count }))
}

export default async function AnalyticsPage() {
  const supabase = await getSupabaseServerClient()
  if (!supabase) return null

  const { rows, error } = await getAnalyticsRows(supabase)

  if (error) {
    return (
      <ErrorState
        title="Could not load analytics"
        message={`${error} Verify your Supabase connection and that the setup migration has been run.`}
      />
    )
  }

  const timeData: TimeDatum[] = buildTimeData(rows).map((d) => ({
    date: shortDay(d.date),
    count: d.count,
  }))
  const total = rows.length
  const newCount = rows.filter((r) => r.lead_status === 'new').length
  const qualified = rows.filter((r) => r.lead_status === 'qualified').length
  const won = rows.filter((r) => r.lead_status === 'won').length
  const avgScore = total ? Math.round(rows.reduce((sum, r) => sum + r.lead_score, 0) / total) : 0
  const conversionRate = won && total ? Math.round((won / total) * 100) : 0

  const countBy = (key: (r: (typeof rows)[number]) => string | null) => {
    const map = new Map<string, number>()
    for (const row of rows) {
      const label = key(row) ?? '—'
      map.set(label, (map.get(label) ?? 0) + 1)
    }
    return Array.from(map, ([label, count]) => ({ label, count })).sort(
      (a, b) => b.count - a.count
    )
  }

  const byService: CountDatum[] = countBy((r) => r.service).map((d) => ({
    ...d,
    color: '#fbbf24',
  }))
  const byBudget: CountDatum[] = countBy((r) => r.budget).map((d) => ({
    ...d,
    color: '#94a3b8',
  }))
  const byStatus: CountDatum[] = LEAD_STATUSES.map((s) => ({
    label: s.label,
    count: 0,
    color: leadStatusColor(s.value),
  }))
  for (const row of rows) {
    const entry = byStatus.find((d) => d.label === leadStatusLabel(row.lead_status))
    if (entry) entry.count += 1
  }

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/70">
          Performance
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[#F5F5F5] lg:text-4xl">Analytics</h1>
      </header>

      <section aria-label="Key metrics" className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Total Leads" value={total} />
        <KpiCard label="New" value={newCount} />
        <KpiCard label="Qualified" value={qualified} />
        <KpiCard label="Won" value={won} sub={conversionRate ? `${conversionRate}% conversion` : undefined} />
        <KpiCard label="Avg Score" value={avgScore} sub="out of 100" />
      </section>

      <section className="border border-white/10 p-6">
        <h2 className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          Inquiries · Last {DAYS} Days
        </h2>
        <TimeChart data={timeData} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-white/10 p-6">
          <h2 className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            By Status
          </h2>
          <Donut data={byStatus} total={total} />
        </section>

        <section className="border border-white/10 p-6">
          <h2 className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            By Service
          </h2>
          <BarList data={byService} total={total} />
        </section>
      </div>

      <section className="border border-white/10 p-6">
        <h2 className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          By Budget
        </h2>
        <BarList data={byBudget} total={total} />
      </section>

      {total === 0 && (
        <EmptyState
          title="No analytics yet"
          message="Once leads start arriving, trends, status distribution and performance metrics will appear here automatically."
        />
      )}
    </div>
  )
}
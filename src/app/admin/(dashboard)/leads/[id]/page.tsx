import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getLead } from '@/lib/supabase/leads.server'
import { formatDate, formatDateTime, leadStatusLabel } from '@/types/lead'
import { ScoreBadge, StatusBadge, ScoreLegend } from '@/components/admin/LeadBadges'
import LeadDetailActions from '@/components/admin/LeadDetailActions'
import { ErrorState } from '@/components/admin/StateViews'

export const dynamic = 'force-dynamic'

interface LeadDetailPageProps {
  params: Promise<{ id: string }>
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="border-b border-white/[0.07] py-3.5 last:border-b-0">
      <dt className="font-mono text-[9px] uppercase tracking-[0.26em] text-white/35">{label}</dt>
      <dd
        className={`mt-1.5 text-sm text-[#F5F5F5]/90 ${mono ? 'font-mono text-xs' : ''}`}
      >
        {value || '—'}
      </dd>
    </div>
  )
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  if (!supabase) return null

  const { lead, error } = await getLead(supabase, id)
  if (error) {
    return (
      <ErrorState
        title="Could not load this lead"
        message={`${error} Verify your Supabase connection and that the setup migration has been run.`}
      />
    )
  }
  if (!lead) notFound()

  const opener =
    lead.lead_status === 'new'
      ? { label: 'Received', date: formatDateTime(lead.updated_at) }
      : {
          label: `Moved to ${leadStatusLabel(lead.lead_status)}`,
          date: formatDateTime(lead.updated_at),
        }

  const info: Array<[string, string, boolean?]> = [
    ['Service', lead.service ?? '—'],
    ['Project Type', lead.project_type ?? '—'],
    ['Budget', lead.budget ?? '—'],
    ['Location', lead.location ?? '—'],
    ['Timeline', lead.timeline ?? '—'],
    ['Source', lead.source ?? 'website'],
    ['Received', formatDateTime(lead.created_at)],
    ['Last Updated', formatDateTime(lead.updated_at)],
  ]

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/admin/leads"
          className="mb-6 inline-block text-[11px] uppercase tracking-[0.2em] text-white/35 transition-colors hover:text-amber-200"
        >
          ← Back to Leads
        </Link>

        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/70">
              Lead Detail
            </p>
            <h1 className="mt-2 font-serif text-3xl text-[#F5F5F5] lg:text-4xl">{lead.name}</h1>
            <p className="mt-2 text-sm text-white/45">
              {lead.email}
              {lead.phone ? ` · ${lead.phone}` : ''}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <ScoreBadge score={lead.lead_score} />
              <StatusBadge status={lead.lead_status} />
            </div>
          </div>

          <LeadDetailActions leadId={lead.id} leadName={lead.name} />
        </header>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <section className="border border-white/10 p-6">
          <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            Project Inquiry
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">
            {lead.message || '—'}
          </p>
        </section>

        <aside className="space-y-6">
          <section className="border border-white/10">
            <div className="border-b border-white/10 px-6 py-4">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                Contact
              </h2>
            </div>
            <dl className="px-6 py-2">
              <InfoRow label="Email" value={lead.email} mono />
              <InfoRow label="Phone" value={lead.phone ?? '—'} mono />
            </dl>
          </section>

          {opener && (
            <section className="border-l-2 border-amber-400/60 bg-amber-400/[0.04] px-5 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-amber-200/70">
                {opener.label}
              </p>
              <p className="mt-1 text-sm text-amber-100/70">{opener.date}</p>
            </section>
          )}

          <ScoreLegend />
        </aside>
      </div>

      <section className="border border-white/10">
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            Details
          </h2>
        </div>
        <dl className="grid gap-x-10 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {info.map(([label, value, mono]) => (
            <InfoRow key={label} label={label} value={value} mono={mono} />
          ))}
        </dl>
      </section>

      <section className="border border-white/10 px-6 py-5">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          Notifications
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-8 text-sm">
          <span className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${lead.email_sent ? 'bg-emerald-400' : 'bg-white/20'}`}
              aria-hidden="true"
            />
            <span className={lead.email_sent ? 'text-white/70' : 'text-white/35'}>
              {lead.email_sent ? 'Email sent' : 'Email not sent yet'}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${lead.telegram_sent ? 'bg-emerald-400' : 'bg-white/20'}`}
              aria-hidden="true"
            />
            <span className={lead.telegram_sent ? 'text-white/70' : 'text-white/35'}>
              {lead.telegram_sent ? 'Telegram sent' : 'Telegram not sent yet'}
            </span>
          </span>
        </div>
      </section>
    </div>
  )
}
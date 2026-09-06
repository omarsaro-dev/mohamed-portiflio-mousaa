import { getSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { countAllLeads } from '@/lib/supabase/leads.server'

export const dynamic = 'force-dynamic'

interface StatusRow {
  label: string
  tone: 'ok' | 'warn' | 'err'
  note?: string
}

function StatusDot({ status }: { status: StatusRow['tone'] }) {
  const tone =
    status === 'ok' ? 'bg-emerald-400' : status === 'err' ? 'bg-rose-400' : 'bg-amber-400'
  return (
    <span className={`ml-2 inline-block h-1.5 w-1.5 rounded-full ${tone}`} aria-hidden="true" />
  )
}

export default async function AdminSettingsPage() {
  const configured = isSupabaseConfigured()
  const supabase = await getSupabaseServerClient()

  let userEmail: string | null = null
  let dataStatus: StatusRow = configured
    ? { label: 'Connecting…', tone: 'warn' }
    : { label: 'Not configured', tone: 'warn', note: 'Set the Supabase environment variables to connect.' }
  let leadCount: number | null = null

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    userEmail = user?.email ?? null

    try {
      const probe = await supabase.from('mousaa_leads').select('id', { count: 'exact', head: true })
      if (probe.error) {
        dataStatus =
          probe.error.code === '42P01'
            ? {
                label: 'Connected, table missing',
                tone: 'warn',
                note: 'Run the setup migration below to create public.mousaa_leads.',
              }
            : probe.error.code === '42501'
              ? {
                  label: 'Connected, permission problem',
                  tone: 'warn',
                  note: 'Check the Row Level Security policies for authenticated users.',
                }
              : { label: 'Connection error', tone: 'err', note: probe.error.message }
      } else {
        dataStatus = { label: 'Connected', tone: 'ok', note: 'Realtime enabled for inserts.' }
        leadCount = probe.count ?? 0
      }
    } catch {
      dataStatus = { label: 'Connection failed', tone: 'err', note: 'Supabase is unreachable.' }
    }
  }

  const n8nConfigured = Boolean(process.env.N8N_WEBHOOK_URL)

  const rows: StatusRow[] = [
    { label: `${n8nConfigured ? 'Webhook configured' : 'Webhook not configured'} (n8n)`, tone: n8nConfigured ? 'ok' : 'warn' },
    {
      label: leadCount === null ? 'Lead count unknown' : `${leadCount} ${leadCount === 1 ? 'lead' : 'leads'} in database`,
      tone: leadCount === null || leadCount < 0 ? 'warn' : 'ok',
    },
    {
      label: 'Row Level Security',
      tone: 'ok',
      note: 'Anonymous: insert only — Authenticated: full access',
    },
  ]

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/70">
          Configuration
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[#F5F5F5] lg:text-4xl">Settings</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-white/10">
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              Admin Account
            </h2>
          </div>
          <dl className="px-6 py-4">
            <dt className="font-mono text-[9px] uppercase tracking-[0.26em] text-white/35">
              Signed in as
            </dt>
            <dd className="mt-1.5 font-mono text-sm text-[#F5F5F5]/90">
              {userEmail ?? 'Unknown'}
            </dd>
            <dt className="mt-5 font-mono text-[9px] uppercase tracking-[0.26em] text-white/35">
              Session
            </dt>
            <dd className="mt-1.5 text-sm text-white/65">Managed by Supabase Auth (email + password)</dd>
          </dl>
        </section>

        <section className="border border-white/10">
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              Data Source
            </h2>
          </div>
          <dl className="px-6 py-4">
            <dt className="font-mono text-[9px] uppercase tracking-[0.26em] text-white/35">
              Supabase
            </dt>
            <dd className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-[#F5F5F5]/90">
              <span>public.mousaa_leads</span>
              <StatusDot status={dataStatus.tone} />
            </dd>
            <p className="mt-2 text-xs leading-relaxed text-white/45">{dataStatus.label}</p>
            {dataStatus.note && (
              <p className="mt-1 text-xs leading-relaxed text-white/35">{dataStatus.note}</p>
            )}
            <dt className="mt-5 font-mono text-[9px] uppercase tracking-[0.26em] text-white/35">
              n8n Delivery
            </dt>
            <dd className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-white/65">
              <span>
                {n8nConfigured
                  ? 'Website → /api/contact → n8n webhook'
                  : 'Not configured in this environment'}
              </span>
              <StatusDot status={n8nConfigured ? 'ok' : 'warn'} />
            </dd>
          </dl>
        </section>
      </div>

      {!configured && (
        <section className="border border-amber-400/20 bg-amber-400/[0.04] px-6 py-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-100/80">
            First-time setup
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-amber-100/70">
            <li>
              Add <code className="font-mono text-amber-100">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
              <code className="font-mono text-amber-100">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your{' '}
              <code className="font-mono text-amber-100">.env</code> (see <code className="font-mono text-amber-100">.env.example</code>).
            </li>
            <li>
              Run the migration in the Supabase SQL editor:{' '}
              <code className="font-mono text-amber-100">supabase/migrations/20260907000001_init_mousaa_leads.sql</code>.
            </li>
            <li>
              Create an admin user in <span className="font-mono text-amber-100">Authentication → Users</span>, then sign in at{' '}
              <code className="font-mono text-amber-100">/admin/login</code>.
            </li>
          </ol>
        </section>
      )}

      <section className="border border-white/10">
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            System Status
          </h2>
        </div>
        <ul className="divide-y divide-white/[0.06] px-6 py-1">
          {rows.map((row) => (
            <li key={row.label} className="flex flex-wrap items-center gap-2 py-3.5 text-sm text-white/65">
              {row.label}
              <StatusDot status={row.tone} />
              {row.note && <span className="text-xs text-white/35">{row.note}</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
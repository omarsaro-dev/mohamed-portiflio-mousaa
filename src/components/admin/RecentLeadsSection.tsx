'use client'

import Link from 'next/link'
import { formatDate, type LeadListItem } from '@/types/lead'
import { ScoreBadge, StatusBadge } from './LeadBadges'
import { EmptyState } from './StateViews'

export default function RecentLeadsSection({ leads }: { leads: LeadListItem[] }) {
  return (
    <section className="border border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          Recent Leads
        </h2>
        <Link
          href="/admin/leads"
          className="text-[11px] uppercase tracking-[0.2em] text-amber-200/80 transition-colors hover:text-amber-100"
        >
          View All →
        </Link>
      </div>

      {leads.length === 0 ? (
        <div className="py-10">
          <EmptyState
            title="No project inquiries yet"
            message="New inquiries submitted through the website appear here automatically as they arrive."
          />
        </div>
      ) : (
        <ul className="divide-y divide-white/[0.06]">
          {leads.map((lead) => (
            <li key={lead.id}>
              <Link
                href={`/admin/leads/${lead.id}`}
                className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#F5F5F5] transition-colors group-hover:text-amber-100">
                    {lead.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-white/35">
                    {lead.service ?? 'Inquiry'}
                    {lead.budget ? ` · ${lead.budget}` : ''}
                  </p>
                </div>

                <div className="hidden items-center gap-2.5 sm:flex">
                  <ScoreBadge score={lead.lead_score} />
                  <StatusBadge status={lead.lead_status} />
                </div>

                <div className="hidden w-24 text-right text-xs text-white/40 md:block">
                  {formatDate(lead.created_at)}
                </div>

                <span
                  aria-hidden="true"
                  className="text-white/25 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-amber-200"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
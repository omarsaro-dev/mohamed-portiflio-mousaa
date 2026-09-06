'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteLeadAction } from '@/app/admin/actions'
import { formatDate, type LeadListItem } from '@/types/lead'
import { ScoreBadge, StatusBadge } from './LeadBadges'
import ConfirmDialog from './ConfirmDialog'
import LeadEditModal from './LeadEditModal'
import { useToast } from './toast'

interface LeadTableProps {
  leads: LeadListItem[]
}

export default function LeadTable({ leads }: LeadTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<LeadListItem | null>(null)
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!deleting) return
    setBusy(true)
    const result = await deleteLeadAction(deleting.id)
    setBusy(false)
    if (result.ok) {
      toast('success', 'Lead deleted', `${deleting.name} was removed from the database.`)
      setDeleting(null)
      router.refresh()
    } else {
      toast('error', 'Delete failed', result.error)
      setDeleting(null)
    }
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden border border-white/10 md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {['Name', 'Service', 'Project Type', 'Budget', 'Score', 'Status', 'Created', ''].map((h) => (
                <th
                  key={h || 'actions'}
                  scope="col"
                  className="px-4 py-3 font-mono text-[9px] uppercase tracking-[0.26em] text-white/35"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {leads.map((lead, index) => (
              <tr key={lead.id} className={index % 2 === 1 ? 'bg-white/[0.012]' : ''}>
                <td className="px-4 py-3.5">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-medium text-[#F5F5F5] transition-colors hover:text-amber-200"
                  >
                    {lead.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-white/35">{lead.email}</p>
                </td>
                <td className="px-4 py-3.5 text-white/65">{lead.service ?? '—'}</td>
                <td className="px-4 py-3.5 text-white/65">{lead.project_type ?? '—'}</td>
                <td className="px-4 py-3.5 text-white/65">{lead.budget ?? '—'}</td>
                <td className="px-4 py-3.5">
                  <ScoreBadge score={lead.lead_score} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={lead.lead_status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-xs text-white/50">
                  {formatDate(lead.created_at)}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      aria-label={`View ${lead.name}`}
                      className="border border-white/10 p-1.5 text-white/45 transition-colors hover:border-amber-400/50 hover:text-amber-200"
                    >
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d="M2.5 10S6 4.5 10 4.5 17.5 10 17.5 10 14 15.5 10 15.5 2.5 10 2.5 10z" />
                        <circle cx="10" cy="10" r="2.2" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setEditingId(lead.id)}
                      aria-label={`Edit ${lead.name}`}
                      className="border border-white/10 p-1.5 text-white/45 transition-colors hover:border-amber-400/50 hover:text-amber-200"
                    >
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d="M13.5 3.5l3 3L7 16H4v-3L13.5 3.5z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(lead)}
                      aria-label={`Delete ${lead.name}`}
                      className="border border-white/10 p-1.5 text-white/45 transition-colors hover:border-rose-400/50 hover:text-rose-200"
                    >
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d="M2.5 5h15M8 5V3.5A1.5 1.5 0 019.5 2h1A1.5 1.5 0 0112 3.5V5M4 5l1 12h10l1-12" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {leads.map((lead) => (
          <div key={lead.id} className="border border-white/10 p-4">
            <Link
              href={`/admin/leads/${lead.id}`}
              className="font-medium text-[#F5F5F5] transition-colors hover:text-amber-200"
            >
              {lead.name}
            </Link>
            <p className="mt-0.5 text-xs text-white/40">{lead.email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ScoreBadge score={lead.lead_score} />
              <StatusBadge status={lead.lead_status} />
              <span className="text-[11px] text-white/35">{formatDate(lead.created_at)}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/55">
              <p>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-white/30">Service</span>
                {lead.service ?? '—'}
              </p>
              <p>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-white/30">Budget</span>
                {lead.budget ?? '—'}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-white/[0.07] pt-3">
              <Link
                href={`/admin/leads/${lead.id}`}
                className="border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/55 transition-colors hover:border-amber-400/50 hover:text-amber-200"
              >
                View
              </Link>
              <button
                type="button"
                onClick={() => setEditingId(lead.id)}
                className="border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/55 transition-colors hover:border-amber-400/50 hover:text-amber-200"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleting(lead)}
                className="ml-auto border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/55 transition-colors hover:border-rose-400/50 hover:text-rose-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <LeadEditModal open={editingId !== null} leadId={editingId} onClose={() => setEditingId(null)} />

      <ConfirmDialog
        open={deleting !== null}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void handleDelete()}
        busy={busy}
        title="Delete this lead?"
        message={`This action cannot be undone. ${deleting?.name ?? 'This lead'} and all of its data will be permanently removed from the database.`}
        confirmLabel="Delete Lead"
      />
    </>
  )
}
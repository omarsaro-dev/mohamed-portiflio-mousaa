'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LeadEditModal from './LeadEditModal'
import ConfirmDialog from './ConfirmDialog'
import { deleteLeadAction } from '@/app/admin/actions'
import { useToast } from './toast'

interface LeadDetailActionsProps {
  leadId: string
  leadName: string
}

export default function LeadDetailActions({ leadId, leadName }: LeadDetailActionsProps) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    setBusy(true)
    const result = await deleteLeadAction(leadId)
    setBusy(false)
    if (result.ok) {
      toast('success', 'Lead deleted', `${leadName} was removed from the database.`)
      router.push('/admin/leads')
    } else {
      setDeleting(false)
      toast('error', 'Delete failed', result.error)
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="bg-amber-500 px-6 py-2.5 text-xs uppercase tracking-widest text-black transition-colors hover:bg-amber-400"
        >
          Edit Lead
        </button>
        <button
          type="button"
          onClick={() => setDeleting(true)}
          className="border border-white/15 px-6 py-2.5 text-xs uppercase tracking-widest text-white/60 transition-colors hover:border-rose-400/50 hover:text-rose-200"
        >
          Delete Lead
        </button>
      </div>

      <LeadEditModal open={editing} leadId={leadId} onClose={() => setEditing(false)} />
      <ConfirmDialog
        open={deleting}
        onCancel={() => setDeleting(false)}
        onConfirm={() => void handleDelete()}
        busy={busy}
        title="Delete this lead?"
        message={`This action cannot be undone. ${leadName} and all of its data will be permanently removed from the database.`}
        confirmLabel="Delete Lead"
      />
    </>
  )
}
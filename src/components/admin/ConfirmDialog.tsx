'use client'

import Modal from './Modal'

interface ConfirmDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel: string
  busy?: boolean
}

export default function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  message,
  confirmLabel,
  busy = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex items-center justify-center border border-white/15 px-5 py-2.5 text-xs uppercase tracking-widest text-white/70 transition-colors duration-200 hover:border-white/30 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center justify-center bg-rose-600/90 px-5 py-2.5 text-xs uppercase tracking-widest text-white transition-colors duration-200 hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Deleting…' : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-white/60">{message}</p>
    </Modal>
  )
}
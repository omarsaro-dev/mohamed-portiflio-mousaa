'use client'

import { cn } from '@/lib/utils'
import {
  leadScoreBucket,
  leadScoreLabel,
  leadStatusLabel,
  type LeadStatus,
} from '@/types/lead'

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: 'border-amber-400/30 bg-amber-400/[0.07] text-amber-200',
  contacted: 'border-sky-400/30 bg-sky-400/[0.07] text-sky-200',
  qualified: 'border-violet-400/30 bg-violet-400/[0.07] text-violet-200',
  won: 'border-emerald-400/30 bg-emerald-400/[0.07] text-emerald-200',
  lost: 'border-zinc-400/20 bg-zinc-400/[0.06] text-zinc-400',
  cold: 'border-sky-400/25 bg-sky-400/[0.06] text-sky-200',
  warm: 'border-amber-400/25 bg-amber-400/[0.06] text-amber-200',
  hot: 'border-rose-400/30 bg-rose-400/[0.08] text-rose-200',
}

const SCORE_STYLES = {
  low: 'border-zinc-400/20 bg-zinc-400/[0.06] text-zinc-400',
  cold: 'border-sky-400/25 bg-sky-400/[0.06] text-sky-200',
  warm: 'border-amber-400/25 bg-amber-400/[0.06] text-amber-200',
  hot: 'border-rose-400/30 bg-rose-400/[0.08] text-rose-200',
}

export function StatusBadge({ status, className }: { status: LeadStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]',
        STATUS_STYLES[status] ?? STATUS_STYLES.new,
        className
      )}
    >
      {leadStatusLabel(status)}
    </span>
  )
}

export function ScoreBadge({ score, className }: { score: number; className?: string }) {
  const bucket = leadScoreBucket(score)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]',
        SCORE_STYLES[bucket],
        className
      )}
      title={`${score} / 100 — ${leadScoreLabel(score)}`}
    >
      <span
        aria-hidden="true"
        className={cn(
          'h-1 w-1 rounded-full',
          bucket === 'hot'
            ? 'bg-rose-400'
            : bucket === 'warm'
              ? 'bg-amber-400'
              : bucket === 'cold'
                ? 'bg-sky-400'
                : 'bg-zinc-500'
        )}
      />
      {score}
    </span>
  )
}

export function ScoreLegend() {
  const legend: [number, number, string][] = [
    [0, 39, 'Low Intent'],
    [40, 59, 'Cold'],
    [60, 79, 'Warm'],
    [80, 100, 'Hot'],
  ]
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
      {legend.map(([min, max, label]) => (
        <span key={label} className="flex items-center gap-1.5 text-[11px] text-white/45">
          <span
            aria-hidden="true"
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              label === 'Hot' ? 'bg-rose-400' : label === 'Warm' ? 'bg-amber-400' : label === 'Cold' ? 'bg-sky-400' : 'bg-zinc-500'
            )}
          />
          {min}–{max} · {label}
        </span>
      ))}
    </div>
  )
}
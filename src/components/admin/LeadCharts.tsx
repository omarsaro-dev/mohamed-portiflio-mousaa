'use client'

export interface TimeDatum {
  date: string
  count: number
}

export interface CountDatum {
  label: string
  count: number
  color: string
}

export function TimeChart({ data }: { data: TimeDatum[] }) {
  const max = Math.max(1, ...data.map((d) => d.count))
  const step = Math.max(1, Math.floor(data.length / 10))

  return (
    <div>
      <div className="flex h-36 items-end gap-[2px]">
        {data.map((d) => (
          <div
            key={d.date}
            title={`${d.date} — ${d.count} ${d.count === 1 ? 'lead' : 'leads'}`}
            className="min-w-[2px] flex-1 bg-amber-400/60 transition-colors duration-150 hover:bg-amber-300"
            style={{ height: `${Math.max(2, (d.count / max) * 100)}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-widest text-white/30">
        {data.filter((_, i) => i % step === 0).map((d) => (
          <span key={d.date}>{d.date}</span>
        ))}
      </div>
    </div>
  )
}

export function BarList({
  data,
  total,
  emptyLabel = 'No data yet',
}: {
  data: CountDatum[]
  total: number
  emptyLabel?: string
}) {
  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-white/35">{emptyLabel}</p>
  }
  const max = Math.max(1, ...data.map((d) => d.count))

  return (
    <ul className="space-y-4">
      {data.map((item) => (
        <li key={item.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-4 text-sm">
            <span className="truncate text-white/70">{item.label}</span>
            <span className="whitespace-nowrap font-mono text-xs text-white/45">
              {item.count}
              <span className="ml-1.5 text-white/25">
                {total ? `${Math.round((item.count / total) * 100)}%` : ''}
              </span>
            </span>
          </div>
          <div className="h-[3px] w-full bg-white/[0.05]">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${(item.count / max) * 100}%`, backgroundColor: item.color }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function Donut({ data, total }: { data: CountDatum[]; total: number }) {
  if (total === 0) {
    return <p className="py-10 text-center text-sm text-white/35">No data yet</p>
  }

  const size = 168
  const stroke = 18
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-12">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Leads by status">
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {data.map((segment) => {
              const length = (segment.count / total) * circumference
              const el = (
                <circle
                  key={segment.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${length} ${circumference - length}`}
                  strokeDashoffset={-offset}
                />
              )
              offset += length
              return el
            })}
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-serif text-3xl text-[#F5F5F5] tabular-nums">{total}</p>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/40">Leads</p>
        </div>
      </div>

      <ul className="space-y-2.5">
        {data.map((segment) => (
          <li key={segment.label} className="flex items-center gap-2.5 text-sm">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: segment.color }} aria-hidden="true" />
            <span className="text-white/65">{segment.label}</span>
            <span className="ml-auto w-8 text-right font-mono text-xs text-white/45">
              {segment.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
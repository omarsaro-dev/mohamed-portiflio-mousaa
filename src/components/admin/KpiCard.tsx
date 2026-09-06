export function KpiCard({
  label,
  value,
  sub,
}: {
  label: string
  value: number | string
  sub?: string
}) {
  return (
    <div className="border border-white/[0.08] bg-white/[0.015] px-6 py-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">{label}</p>
      <p className="mt-4 font-serif text-4xl text-[#F5F5F5] tabular-nums lg:text-[2.75rem]">
        {value}
      </p>
      {sub && <p className="mt-2 text-[11px] leading-relaxed text-white/35">{sub}</p>}
    </div>
  )
}
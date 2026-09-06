'use client'

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xs bg-white/[0.05] ${className}`} />
}

export function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string
  message: string
  action?: React.ReactNode
}) {
  return (
    <div className="border border-white/10 px-6 py-16 text-center">
      <p className="font-serif text-2xl text-[#F5F5F5]">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/45">{message}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}

export function ErrorState({
  title,
  message,
  onRetry,
}: {
  title: string
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="border border-rose-400/20 bg-rose-400/[0.03] px-6 py-12 text-center">
      <p className="font-serif text-xl text-rose-200">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/50">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex border border-white/15 px-5 py-2.5 text-xs uppercase tracking-widest text-white/70 transition-colors hover:border-amber-400/60 hover:text-amber-200"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
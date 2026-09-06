'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PaginationProps {
  pathname: string
  searchParams: Record<string, string>
  page: number
  pageSize: number
  total: number
}

export default function Pagination({ pathname, searchParams, page, pageSize, total }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(page, totalPages)
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1
  const to = Math.min(current * pageSize, total)

  const urlFor = (p: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(p))
    return `${pathname}?${params.toString()}`
  }

  const pages: (number | 'ellipsis')[] = []
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - current) <= 1) {
      pages.push(p)
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis')
    }
  }

  return (
    <nav aria-label="Lead list pagination" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[11px] tracking-wide text-white/35">
        Showing <span className="text-white/60">{from}–{to}</span> of{' '}
        <span className="text-white/60">{total}</span> leads
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <Link
            href={urlFor(Math.max(1, current - 1))}
            aria-label="Previous page"
            aria-disabled={current <= 1}
            className={cn(
              'px-3 py-1.5 text-xs text-white/50 transition-colors',
              current <= 1 ? 'pointer-events-none opacity-30' : 'hover:text-amber-200'
            )}
          >
            ← Prev
          </Link>

          {pages.map((p, i) =>
            p === 'ellipsis' ? (
              <span key={`e${i}`} className="px-1 text-white/30">
                …
              </span>
            ) : (
              <Link
                key={p}
                href={urlFor(p)}
                aria-current={p === current ? 'page' : undefined}
                className={cn(
                  'min-w-8 border px-2.5 py-1.5 text-center text-xs transition-colors',
                  p === current
                    ? 'border-amber-400/50 bg-amber-400/[0.06] text-amber-200'
                    : 'border-transparent text-white/45 hover:text-white/90'
                )}
              >
                {p}
              </Link>
            )
          )}

          <Link
            href={urlFor(Math.min(totalPages, current + 1))}
            aria-label="Next page"
            aria-disabled={current >= totalPages}
            className={cn(
              'px-3 py-1.5 text-xs text-white/50 transition-colors',
              current >= totalPages ? 'pointer-events-none opacity-30' : 'hover:text-amber-200'
            )}
          >
            Next →
          </Link>
        </div>
      )}
    </nav>
  )
}
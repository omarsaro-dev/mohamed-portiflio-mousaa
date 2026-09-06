'use client'

import Link from 'next/link'

interface AdminHeaderProps {
  onMenuClick: () => void
  userEmail?: string | null
}

export function AdminHeader({ onMenuClick, userEmail }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#080808]/90 px-5 py-3.5 backdrop-blur lg:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="border border-white/15 p-2 text-white/60 transition-colors hover:text-white lg:hidden"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden="true">
            <path d="M3 5h14M3 10h14M3 15h14" />
          </svg>
        </button>

        <div className="hidden items-center gap-3 sm:flex">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            Admin Console
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        {userEmail && (
          <p className="hidden truncate font-mono text-[11px] text-white/40 md:block" title={userEmail}>
            {userEmail}
          </p>
        )}
        <Link
          href="/"
          className="border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/50 transition-colors hover:border-amber-400/50 hover:text-amber-200"
        >
          View Site
        </Link>
      </div>
    </header>
  )
}
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'grid' },
  { href: '/admin/leads', label: 'Leads', icon: 'leads' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'chart' },
  { href: '/admin/settings', label: 'Settings', icon: 'settings' },
] as const

const ICONS: Record<string, React.ReactNode> = {
  grid: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-4 w-4" aria-hidden="true">
      <rect x="3" y="3" width="6" height="6" />
      <rect x="11" y="3" width="6" height="6" />
      <rect x="3" y="11" width="6" height="6" />
      <rect x="11" y="11" width="6" height="6" />
    </svg>
  ),
  leads: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-4 w-4" aria-hidden="true">
      <path d="M10 10a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M4 17c0-3.3 2.7-5 6-5s6 1.7 6 5" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-4 w-4" aria-hidden="true">
      <path d="M3 17V9M10 17V4M17 17v-11M17 17H3" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-4 w-4" aria-hidden="true">
      <circle cx="10" cy="10" r="2.5" />
      <path d="M10 2.5l.9 1.9 2.1-.4 1.2 1.8 2 .7-.3 2.1 1.6 1.4-1.6 1.4.3 2.1-2 .7-1.2 1.8-2.1-.4L10 17.5l-.9-1.9-2.1.4-1.2-1.8-2-.7.3-2.1L2.5 10l1.6-1.4-.3-2.1 2-.7 1.2-1.8 2.1.4.9-1.9z" />
    </svg>
  ),
}

interface AdminSidebarProps {
  onNavigate?: () => void
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    const client = getSupabaseBrowserClient()
    if (client) await client.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex h-full flex-col border-r border-white/10 bg-[#0a0a0a]">
      <div className="border-b border-white/10 px-6 py-7">
        <Link href="/admin" onClick={onNavigate} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">
          <p className="font-serif text-xl tracking-[0.18em] text-[#F5F5F5]">
            MOUSAA<span className="text-amber-400/90">.</span>
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.42em] text-white/35">
            Architectural Studio
          </p>
        </Link>
      </div>

      <nav aria-label="Admin navigation" className="flex-1 px-3 py-6">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 border-l px-4 py-2.5 text-[12px] uppercase tracking-[0.18em] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400',
                    active
                      ? 'border-amber-400 bg-amber-400/[0.05] text-amber-200'
                      : 'border-transparent text-white/45 hover:text-white/80'
                  )}
                >
                  {ICONS[item.icon]}
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex w-full items-center gap-3 border border-white/10 px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-white/50 transition-colors duration-200 hover:border-white/25 hover:text-white/90 disabled:opacity-50"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-4 w-4" aria-hidden="true">
            <path d="M13 4a6 6 0 110 12M8 10h8M14 7l3 3-3 3" />
          </svg>
          {signingOut ? 'Signing Out…' : 'Sign Out'}
        </button>
      </div>
    </div>
  )
}
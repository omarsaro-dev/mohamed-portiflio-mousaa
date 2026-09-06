'use client'

import { useState } from 'react'
import { ToastProvider } from './toast'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { RealtimeLeadsToasts } from './RealtimeLeadsToasts'

export function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode
  userEmail?: string | null
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#080808]">
        <RealtimeLeadsToasts />

        {/* Desktop sidebar */}
        <div className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
          <AdminSidebar />
        </div>

        {/* Mobile drawer */}
        <div
          className={`fixed inset-0 z-50 lg:hidden ${drawerOpen ? '' : 'pointer-events-none'}`}
          aria-hidden={!drawerOpen}
        >
          <div
            className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
              drawerOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className={`absolute inset-y-0 left-0 w-72 transform transition-transform duration-300 ${
              drawerOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>

        <div className="lg:pl-64">
          <AdminHeader onMenuClick={() => setDrawerOpen(true)} userEmail={userEmail} />
          <main className="mx-auto w-full max-w-[1280px] px-5 py-8 lg:px-8 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
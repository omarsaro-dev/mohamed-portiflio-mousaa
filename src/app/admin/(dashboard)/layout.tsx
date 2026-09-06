import { redirect } from 'next/navigation'
import { getSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { AdminShell } from '@/components/admin/AdminShell'

export const dynamic = 'force-dynamic'
export const metadata = { robots: { index: false, follow: false } }

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isSupabaseConfigured()) redirect('/admin/login')

  const supabase = await getSupabaseServerClient()
  if (!supabase) redirect('/admin/login')

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) redirect('/admin/login')

  return <AdminShell userEmail={user.email}>{children}</AdminShell>
}
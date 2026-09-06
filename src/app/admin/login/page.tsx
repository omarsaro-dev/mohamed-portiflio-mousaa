import type { Metadata } from 'next'
import LoginForm from '@/components/admin/LoginForm'

export const metadata: Metadata = {
  title: 'Admin Login — Mousaa Studio',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 py-16">
      <LoginForm />
    </main>
  )
}
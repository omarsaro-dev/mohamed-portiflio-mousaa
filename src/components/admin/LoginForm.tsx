'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const configured = isSupabaseConfigured()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!configured) return
    setError(null)
    setLoading(true)

    const client = getSupabaseBrowserClient()
    if (!client) {
      setLoading(false)
      setError('Supabase is not configured on this deployment.')
      return
    }

    const { error: signInError } = await client.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (signInError) {
      setError(
        signInError.message === 'Invalid login credentials'
          ? 'The email or password is incorrect.'
          : 'Unable to sign in right now. Please try again.'
      )
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md border border-white/10 bg-[#0d0d0d] p-8 sm:p-10">
      <div className="mb-8 text-center">
        <p className="font-serif text-2xl tracking-[0.18em] text-[#F5F5F5]">
          MOUSAA<span className="text-amber-400/90">.</span>
        </p>
        <p className="mt-1 text-[9px] uppercase tracking-[0.42em] text-white/35">
          Architectural Studio · Admin
        </p>
      </div>

      {!configured && (
        <div className="mb-6 border border-amber-400/20 bg-amber-400/[0.04] px-4 py-3 text-xs leading-relaxed text-amber-100/80">
          <p className="font-medium text-amber-100">Supabase is not configured.</p>
          <p className="mt-1 text-amber-100/60">
            Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment variables, then restart
            the server.
          </p>
        </div>
      )}

      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-7">
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block font-mono text-[10px] uppercase tracking-[0.28em] text-white/40"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border-0 border-b border-white/15 bg-transparent py-3 text-sm text-[#F5F5F5] outline-none transition-colors focus:border-amber-400/70 placeholder:text-white/25"
            placeholder="admin@mousaa.com"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block font-mono text-[10px] uppercase tracking-[0.28em] text-white/40"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border-0 border-b border-white/15 bg-transparent py-3 text-sm text-[#F5F5F5] outline-none transition-colors focus:border-amber-400/70 placeholder:text-white/25"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p role="alert" className="text-xs leading-relaxed text-rose-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 px-6 py-3.5 text-xs uppercase tracking-widest text-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing In…' : 'Sign In'}
        </button>
      </form>

      <p className="mt-8 text-center text-[11px] text-white/30">
        Access is limited to authorised admin accounts.
      </p>
      <div className="mt-4 text-center">
        <Link
          href="/"
          className="text-[11px] uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-amber-200"
        >
          ← Back to Website
        </Link>
      </div>
    </div>
  )
}
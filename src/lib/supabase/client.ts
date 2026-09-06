import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

export type SupabaseBrowserClient = ReturnType<typeof createBrowserClient>

let browserClient: SupabaseBrowserClient | null = null

export function getSupabaseBrowserClient(): SupabaseBrowserClient | null {
  if (!isSupabaseConfigured()) return null
  if (browserClient) return browserClient
  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return browserClient
}
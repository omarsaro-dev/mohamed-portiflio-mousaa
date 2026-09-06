import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const url = request.nextUrl.clone()
  const pathname = url.pathname

  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')
  const isLoginRoute = pathname === '/admin/login'

  if (!isAdminRoute) {
    return response
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  // Nothing is publicly accessible when Supabase is not configured —
  // send everything to the login page so it can surface setup guidance.
  let user: { email?: string | null } | null = null
  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    })

    try {
      const {
        data: { user: sessionUser },
      } = await supabase.auth.getUser()
      user = sessionUser
    } catch {
      user = null
    }
  }

  if (!user && !isLoginRoute) {
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (user && isLoginRoute) {
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return response
}
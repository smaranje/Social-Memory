import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  // Skip auth checks if environment variables are missing (build time)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
    console.warn('Supabase configuration missing or using placeholders - skipping auth middleware')
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    // Use getUser instead of getSession – this validates the JWT with Supabase and
    // automatically refreshes expired tokens via the cookie helpers above.
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')

    // Allow the dedicated callback route to proceed without extra redirects
    if (req.nextUrl.pathname === '/auth/callback') {
      return response
    }

    // If the user is logged-in and tries to access any /auth* route (except callback),
    // send them to the application root instead.
    if (user && isAuthPage) {
      console.log('User already authenticated, redirecting to main app')
      return NextResponse.redirect(new URL('/', req.url))
    }

    // If there is **no** authenticated user and we're not already on an /auth route,
    // force them to the auth screen.
    if (!user && !isAuthPage) {
      console.log('No authenticated user found, redirecting to auth')
      return NextResponse.redirect(new URL('/auth', req.url))
    }
  } catch (error) {
    console.error('Middleware auth error:', error)
    // Let the request proceed on auth errors to avoid breaking the app
    // Only redirect to auth if we're on a protected route and there's an auth error
    if (!req.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
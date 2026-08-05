import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  let authUnavailable = false
  let user = null

  try {
    user = await Promise.race([
      supabase.auth.getUser().then((result) => result.data.user),
      new Promise<null>((resolve) =>
        setTimeout(() => {
          authUnavailable = true
          resolve(null)
        }, 1200)
      ),
    ])
  } catch {
    authUnavailable = true
  }

  const hasLocalSession = Boolean(request.cookies.get('gnix_demo_user')?.value)
  const isMobileAccessApi = request.nextUrl.pathname.startsWith('/mobile/access')
  const isPublicLanding = request.nextUrl.pathname.startsWith('/landing')
  const isMobileTemporaryAccess = request.nextUrl.pathname === '/mobile'
    && Boolean(request.nextUrl.searchParams.get('access'))
    && Date.parse(request.nextUrl.searchParams.get('expires') ?? '') > Date.now()

  if (isMobileTemporaryAccess) {
    const response = NextResponse.redirect(new URL('/mobile', request.url))
    response.cookies.set('gnix_demo_user', 'mobile-temporary', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    })
    return response
  }

  if (
    !user &&
    !hasLocalSession &&
    !authUnavailable &&
    !isMobileAccessApi &&
    !isPublicLanding &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/register') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

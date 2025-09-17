import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getClaims()
  const { data } = await supabase.auth.getClaims()

  const user = data?.claims
  const pathname = request.nextUrl.pathname

  // Define protected routes
  const protectedRoutes = ['/onboarding', '/chat', '/protected', '/projects' ]
  const authRoutes = ['/auth/login', '/auth/sign-up', '/auth/forgot-password']

  if (!user) {
    // User is not authenticated
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      // Redirect unauthenticated users trying to access protected routes to login
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
  } else {
    // User is authenticated, check onboarding status
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('onboarded')
        .eq('id', user.sub)
        .single()

      const isOnboarded = userData?.onboarded || false

      if (!isOnboarded) {
        // User is not onboarded
        if (pathname !== '/onboarding' && !authRoutes.some(route => pathname.startsWith(route))) {
          // Redirect to onboarding if not already there
          const url = request.nextUrl.clone()
          url.pathname = '/onboarding'
          return NextResponse.redirect(url)
        }
      } else {
        // User is onboarded
        if (pathname === '/onboarding') {
          // Redirect onboarded users away from onboarding to chat
          const url = request.nextUrl.clone()
          url.pathname = '/chat'
          return NextResponse.redirect(url)
        }
        
        // Redirect from root to chat for onboarded users
        if (pathname === '/') {
          const url = request.nextUrl.clone()
          url.pathname = '/chat'
          return NextResponse.redirect(url)
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      // On error, allow the request to continue
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}

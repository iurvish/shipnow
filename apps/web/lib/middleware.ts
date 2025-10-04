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
  // Routes that authenticated users should NOT access (will be redirected away)
  const unauthenticatedOnlyRoutes = ['/auth/login', '/auth/sign-up']
  // Routes that authenticated users CAN access for password reset/confirmation
  const authUtilityRoutes = ['/auth/forgot-password', '/auth/update-password', '/auth/confirm']

  if (!user) {
    // User is not authenticated
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      // Redirect unauthenticated users trying to access protected routes to login
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
  } else {
    // User is authenticated
    
    // Redirect authenticated users away from login/sign-up pages
    if (unauthenticatedOnlyRoutes.some(route => pathname.startsWith(route))) {
      const url = request.nextUrl.clone()
      url.pathname = '/chat'
      return NextResponse.redirect(url)
    }
    
    // Allow access to auth utility routes (password reset, confirm) regardless of onboarding status
    if (authUtilityRoutes.some(route => pathname.startsWith(route))) {
      return supabaseResponse
    }
    
    // Check onboarding status for other routes
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('onboarded')
        .eq('id', user.sub)
        .single()

      const isOnboarded = userData?.onboarded || false

      if (!isOnboarded) {
        // User is not onboarded
        if (pathname !== '/onboarding') {
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

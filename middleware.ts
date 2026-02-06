import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAllSecurityHeaders } from './lib/security/csp'

const publicPaths = ['/login', '/register', '/reset-password', '/']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Determine environment once
  const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development'
  const securityHeaders = getAllSecurityHeaders(environment)
  
  // Allow public paths
  if (publicPaths.some(p => path.startsWith(p)) || path.startsWith('/api/auth')) {
    const response = NextResponse.next()
    
    // Apply security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get('sb-rrojsddygnumolbdxesu-auth-token')
  
  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  // Apply security headers to authenticated routes
  const response = NextResponse.next()
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}

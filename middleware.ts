import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for the admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get the admin auth from cookies or headers
    const adminAuth = request.cookies.get('admin-auth')?.value

    // If no auth token or incorrect token, redirect to home
    if (!adminAuth || adminAuth !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: '/admin/:path*'
}

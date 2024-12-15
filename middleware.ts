import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_PASSWORD = "22984695"

export function middleware(request: NextRequest) {
  // Check if the request is for the admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get the admin auth from cookies or headers
    const adminAuth = request.cookies.get('admin-auth')?.value
    console.log('Middleware - Admin Auth:', adminAuth)

    // If no auth token or incorrect token, redirect to home
    if (!adminAuth) {
      console.log('Middleware - No auth token found')
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Compare the values
    if (adminAuth !== ADMIN_PASSWORD) {
      console.log('Middleware - Invalid auth token')
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: '/admin/:path*'
}

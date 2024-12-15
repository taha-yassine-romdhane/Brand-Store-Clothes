import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for the admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const hostname = request.headers.get('host') || ''
    
    // Only allow access from localhost
    if (!hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

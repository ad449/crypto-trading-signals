import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow API routes to pass through
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Serve index.html for root path
  if (pathname === '/') {
    return NextResponse.rewrite(new URL('/index.html', request.url))
  }

  // Allow static files (CSS, JS, etc.) to pass through
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

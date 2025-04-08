import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl

  // Handle subdomain logic
  if (hostname.startsWith('app.')) {
    // If request is going to `/`, rewrite to `/apps`
    if (url.pathname === '/') {
      url.pathname = '/apps'
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

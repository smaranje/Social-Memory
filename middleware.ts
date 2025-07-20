import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Temporarily disable all authentication/redirect logic to unblock local development
  return NextResponse.next();
}

// Optional: retain matcher configuration if you still need the middleware to run on every
// request, but since the function is now a no-op, it will simply let all requests through.

export const config = {
  matcher: [
    '/:path*',
  ],
};
import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenEdge } from '@/lib/edge-auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`Middleware: Processing ${pathname}`);

  // Allow access to login page and API routes
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth') || pathname.startsWith('/debug') || pathname.startsWith('/test-login')) {
    console.log(`Middleware: Allowing access to ${pathname}`);
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;
    console.log(`Middleware: Checking admin route ${pathname}, token exists: ${!!token}`);

    if (!token) {
      console.log(`Middleware: No token found, redirecting to login`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      verifyTokenEdge(token);
      console.log(`Middleware: Token verified successfully for ${pathname}`);
      return NextResponse.next();
    } catch (error) {
      console.log(`Middleware: Token verification failed, redirecting to login: ${error}`);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  console.log(`Middleware: Allowing access to ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login/:path*'],
};

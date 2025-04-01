import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Security headers configuration
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
  'X-XSS-Protection': '1; mode=block',
};

export async function middleware(request) {
  const response = NextResponse.next();
  
  // Add security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Get the pathname
  const path = request.nextUrl.pathname;

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/admin',
    '/user',
    '/api/bookmarks',
    '/api/toggleBookmark',
  ];

  // Check if the current path is protected
  const isProtectedPath = protectedRoutes.some(route => path.startsWith(route));
  const isAuthPath = path.startsWith('/auth');

  // Get the token
  const token = await getToken({ req: request });

  // Handle protected routes
  if (isProtectedPath) {
    if (!token) {
      // Redirect to login if no token
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin routes
    if (path.startsWith('/admin') && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Check user routes
    if (path.startsWith('/user') && token.id !== path.split('/')[2]) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Handle auth routes
  if (isAuthPath && token) {
    // Redirect to home if already authenticated
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow access to all other routes
  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Only run middleware on protected routes and auth routes
    '/admin/:path*',
    '/user/:path*',
    '/auth/:path*',
    '/api/bookmarks/:path*',
    '/api/toggleBookmark/:path*',
  ],
}; 
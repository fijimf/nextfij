import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenExpired } from './lib/auth/token';

export function middleware(request: NextRequest) {
  console.log('\n🟡 Middleware Processing:', request.method, request.nextUrl.pathname);
  
  const token = request.cookies.get('token');
  
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  console.log('🟡 Token status:', token ? '✅ Present' : '❌ Missing');
  console.log('🟡 Is login page:', isLoginPage);
  console.log('🟡 Is API route:', isApiRoute);
  console.log('🟡 Is admin route:', isAdminRoute);

  // Always allow access to login page and API routes
  if (isLoginPage || isApiRoute) {
    console.log('🟡 Allowing access to login/API route');
    return NextResponse.next();
  }

  // Only require authentication for admin routes
  if (isAdminRoute) {
    if (!token) {
      console.log('🟡 Admin route accessed without token, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if token is expired
    if (isTokenExpired(token.value)) {
      console.log('🟡 Admin route accessed with expired token, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('🟡 Admin route accessed with valid token, allowing access');
  } else {
    console.log('🟡 Non-admin route, allowing access without authentication');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 
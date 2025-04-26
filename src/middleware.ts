import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('\n🟡 Middleware Processing:', request.method, request.nextUrl.pathname);
  
  const token = request.cookies.get('token');
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  console.log('🟡 Token status:', token ? '✅ Present' : '❌ Missing');
  console.log('🟡 Is login page:', isLoginPage);
  console.log('🟡 Is API route:', isApiRoute);

  // Always allow access to login page and API routes
  if (isLoginPage || isApiRoute) {
    console.log('🟡 Allowing access to login/API route');
    return NextResponse.next();
  }

  // For all other routes, require authentication
  if (!token) {
    console.log('🟡 No token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('🟡 Token present, allowing access');
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 
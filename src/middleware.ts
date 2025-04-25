import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Log the request
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.nextUrl.pathname}`);
  
  const token = request.cookies.get('token');
  console.log('Token cookie:', token ? '✅ Present' : '❌ Missing');
  console.log('All cookies:', request.cookies.getAll().map(c => c.name));
  
  const isLoginPage = request.nextUrl.pathname === '/login';

  if (!token && !isLoginPage) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isLoginPage) {
    console.log('Token found, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 
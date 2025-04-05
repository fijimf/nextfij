import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  
  return NextResponse.json({
    cookies: allCookies.map(cookie => ({
      name: cookie.name,
      value: cookie.value,
      path: cookie.path,
      domain: cookie.domain,
      secure: cookie.secure,
      httpOnly: cookie.httpOnly,
      sameSite: cookie.sameSite,
    })),
    token: cookieStore.get('token')?.value,
    env: {
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
    }
  });
} 
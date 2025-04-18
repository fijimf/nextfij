import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  return NextResponse.json({
    cookies: allCookies.map(cookie => ({
      name: cookie.name,
      value: cookie.value
    })),
    token: cookieStore.get('token')?.value,
    env: {
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
    }
  });
} 
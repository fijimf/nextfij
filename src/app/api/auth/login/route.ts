import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    console.log('Authenticating...'+request.url);
    const body = await request.json();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Authentication failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Create the response
    const res = NextResponse.json(data);
    
    // Set HTTP-only cookies
    res.cookies.set('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    
    res.cookies.set('username', body.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return res;
  } catch  {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
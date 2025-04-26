import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    cookieStore.delete('username');
    
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('🔴 Logout Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
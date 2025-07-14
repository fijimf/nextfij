import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logger } from '@/lib/logger';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ teamId: string } >}
) {
  logger.info('GET /api/team/[teamId] - Processing team data request');
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  logger.debug('Token retrieved from cookies:', token ? 'Present' : 'Missing');
  if (!token) {
    return NextResponse.json(
      { message: 'Unauthorized - No token found' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year') || new Date().getFullYear().toString();
  const { teamId } = await params;
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/team/${teamId}?year=${year}`; 

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json(
        { message: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch team data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
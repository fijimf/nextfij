'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import { ApiResponseGamesByDateDTO } from '@/lib/api/types/games';
import { GamesHeader } from '@/components/games/GamesHeader';
import { GamesTable } from '@/components/games/GamesTable';

interface PageProps {
  params: Promise<{
    date: string;
  }>;
}

export default function GamesByDatePage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { date } = resolvedParams;

  // Validate date format
  const isValidDate = /^\d{8}$/.test(date);

  // Fetch games data
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['games', date],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponseGamesByDateDTO>(`/games/${date}`);
      return response.data.data;
    },
    enabled: isValidDate,
    retry: 1,
  });

  // Handle invalid date format
  useEffect(() => {
    if (!isValidDate) {
      // Redirect to today's date
      const today = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const [month, day, year] = today.split('/');
      const formattedDate = `${year}${month}${day}`;
      router.replace(`/games/${formattedDate}`);
    }
  }, [isValidDate, router]);

  const handleDateChange = (newDate: string) => {
    router.push(`/games/${newDate}`);
  };

  // Loading state
  if (isLoading || !isValidDate) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
              <div className="space-y-2 mt-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <Card>
          <CardContent className="pt-6">
            {data?.season && (
              <GamesHeader
                date={date}
                season={data.season}
                onDateChange={handleDateChange}
              />
            )}
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : 'Failed to load games for this date'}
              </p>
              <Button variant="outline" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No data
  if (!data) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <GamesHeader
              date={date}
              season={data.season}
              onDateChange={handleDateChange}
              isLoading={isLoading}
            />

            <GamesTable games={data.games} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

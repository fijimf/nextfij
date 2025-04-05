'use client';

import { useParams, useRouter } from 'next/navigation';
import { useApiQuery } from '@/lib/api/hooks';
import type { TeamPage } from '@/lib/api/types/team';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { useEffect } from 'react';
import Link from 'next/link';

export default function TeamPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId as string;
  const currentYear = new Date().getFullYear();

  const { data: teamPage, isLoading, error } = useApiQuery<TeamPage>(
    ['team', teamId],
    `/team/${teamId}`
  );

  useEffect(() => {
    console.log('Team data:', teamPage);
    console.log('Loading:', isLoading);
    console.log('Error:', error);
  }, [teamPage, isLoading, error]);

  useEffect(() => {
    if (error?.status === 401) {
      router.push('/login');
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!teamPage) return null;

  return (
    <div className="container mx-auto p-4">
      {/* Team Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            {teamPage.team.logoUrl && (
              <img
                src={teamPage.team.logoUrl}
                alt={teamPage.team.name}
                className="w-16 h-16 object-contain"
              />
            )}
            <div>
              <CardTitle>{teamPage.team.longName}</CardTitle>
              <p className="text-muted-foreground">{teamPage.team.nickname}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Season Record</h3>
              <p>
                {teamPage.records.overall.wins} - {teamPage.records.overall.losses}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Conference</h3>
              <div className="flex items-center gap-2">
                {teamPage.conference.logoUrl && (
                  <img
                    src={teamPage.conference.logoUrl}
                    alt={teamPage.conference.name}
                    className="w-6 h-6 object-contain"
                  />
                )}
                <p>{teamPage.conference.name}</p>
                <p>
                {teamPage.records.conference.wins} - {teamPage.records.conference.losses}
              </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPage.games.map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">
                    {format(new Date(game.date), 'MMM d, yyyy')}
                  </span>
                  <span>{game.atVs}</span>
                  <Link 
                    href={`/team/${game.opponent.id}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    {game.opponent.logoUrl && (
                      <img
                        src={game.opponent.logoUrl}
                        alt={game.opponent.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <span className="font-semibold">{game.opponent.name}</span>
                  </Link>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {game.score} - {game.oppScore}
                  </div>
                  {game.spread && (
                    <div className="text-sm text-muted-foreground">
                      Spread: {game.spread > 0 ? '+' : ''}{game.spread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
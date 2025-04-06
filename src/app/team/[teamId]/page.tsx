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

  // Create a CSS variable for the team's primary color with reduced opacity
  const primaryColorStyle = {
    '--team-primary-color': teamPage.team.primaryColor,
  } as React.CSSProperties;

  return (
    <div className="container mx-auto p-4" style={primaryColorStyle}>
      {/* Team Header */}
      <Card className="mb-6 border-l-4" style={{ borderLeftColor: teamPage.team.primaryColor }}>
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
              <CardTitle className="text-5xl font-bold">{teamPage.team.longName}</CardTitle>
              <p className="text-2xl">{teamPage.team.nickname}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-2">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Overall:</h3>
              <p>
                {teamPage.records.overall.wins} - {teamPage.records.overall.losses}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{teamPage.conference.name}:</h3>
              <div className="flex items-center gap-2">
                {teamPage.conference.logoUrl && (
                  <img
                    src={teamPage.conference.logoUrl}
                    alt={teamPage.conference.name}
                    className="w-4 h-4 object-contain"
                  />
                )}
                <p>
                {teamPage.records.conference.wins} - {teamPage.records.conference.losses}
              </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card className="mb-6">
        <CardHeader className="border-b" style={{ borderColor: `${teamPage.team.primaryColor}20` }}>
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: `${teamPage.team.primaryColor}20` }}>
                  <th className="text-left py-2 px-2">Date</th>
                  <th className="text-center py-2 px-2">Result</th>
                  <th className="text-left py-2 px-2">Opponent</th>
                  <th className="text-left py-2 px-2">Spread</th>
                  <th className="text-center py-2 px-2">O/U</th>
                  <th className="text-center py-2 px-2"></th>
                  <th className="text-center py-2 px-2">ML</th>
                  <th className="text-center py-2 px-2">Opp ML</th>
                </tr>
              </thead>
              <tbody>
                {teamPage.games.map((game) => (
                  <tr 
                    key={game.id}
                    className="border-b hover:bg-muted/50 transition-colors"
                    style={{ borderColor: `${teamPage.team.primaryColor}20` }}
                  >
                    <td className="py-2 px-2 text-muted-foreground">
                      {format(new Date(game.date), 'MMM d')}
                    </td>
                    <td className="py-2 px-2 text-center font-medium">
                      <span className={game.wOrL === 'W' ? 'text-green-600' : 'text-red-600'}>{game.wOrL}&nbsp;</span>
                       {game.score} - {game.oppScore}
                    </td>
                    <td className="py-2 px-2">
                      <Link 
                        href={`/team/${game.opponent.id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                         <span className="text-muted-foreground text-sm">{game.atVs}</span>
                        {game.opponent.logoUrl && (
                          <img
                            src={game.opponent.logoUrl}
                            alt={game.opponent.name}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <span className="font-medium">{game.opponent.name}</span>
                       
                      </Link>
                    </td>
                   
                    <td className="py-2 px-2 text-left">
                      {game.spreadDescription && (
                        <span className={game.spreadCovered ? 'text-green-600' : 'text-red-600'}>
                         {game.spreadDescription}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {game.overUnder && (
                        <span className="text-muted-foreground">{game.overUnder}</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {game.overOrUnder && (
                        <span className="text-muted-foreground">{game.overOrUnder}</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {game.moneyLine && (
                        <span className={game.wOrL === 'W' ? 'text-green-600' : 'text-red-600'}>
                          {game.moneyLine > 0 ? '+' : ''}{game.moneyLine}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {game.oppMoneyLine && (
                        <span className={game.wOrL === 'W' ? 'text-red-600' : 'text-green-600'}>
                          {game.oppMoneyLine > 0 ? '+' : ''}{game.oppMoneyLine}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Conference Standings */}
      <Card>
        <CardHeader className="border-b" style={{ borderColor: `${teamPage.team.primaryColor}20` }}>
          <div className="flex items-center gap-2">
            {teamPage.conference.logoUrl && (
              <img
                src={teamPage.conference.logoUrl}
                alt={teamPage.conference.name}
                className="w-16 h-16 object-contain"
              />
            )}
            <CardTitle>{teamPage.conference.name} Standings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: `${teamPage.team.primaryColor}20` }}>
                  <th className="text-left py-2 px-4">Team</th>
                  <th className="text-center py-2 px-4">Conference</th>
                  <th className="text-center py-2 px-4">Overall</th>
                </tr>
              </thead>
              <tbody>
                {teamPage.conference.standings.map((standing) => (
                  <tr 
                    key={standing.team.id} 
                    className={`border-b ${standing.team.id === teamPage.team.id ? 'bg-muted/50' : ''}`}
                    style={{ borderColor: `${teamPage.team.primaryColor}20` }}
                  >
                    <td className="py-2 px-4">
                      <Link 
                        href={`/team/${standing.team.id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        {standing.team.logoUrl && (
                          <img
                            src={standing.team.logoUrl}
                            alt={standing.team.name}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <span className="font-semibold">{standing.team.name}</span>
                      </Link>
                    </td>
                    <td className="text-center py-2 px-4">
                      {standing.conferenceRecord.wins} - {standing.conferenceRecord.losses}
                    </td>
                    <td className="text-center py-2 px-4">
                      {standing.overallRecord.wins} - {standing.overallRecord.losses}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useApiQuery } from '@/lib/api/hooks';
import type { TeamPage } from '@/lib/api/types/team';
import { teamPageSchema } from '@/lib/validation/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TeamPageSkeleton } from '@/components/ui/loading-states';
import { format } from 'date-fns';
import { useEffect } from 'react';
import Link from 'next/link';

export default function TeamSeasonPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId as string;
  const season = params.season as string;

  const { data: teamPage, isLoading, error } = useApiQuery<TeamPage>(
    ['team', teamId, season],
    `/team/${teamId}?year=${season}`,
    teamPageSchema
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
    return <TeamPageSkeleton />;
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
  const primaryColor = teamPage.team.primaryColor || '#ccc';
  const primaryColorStyle = {
    '--team-primary-color': primaryColor,
  } as React.CSSProperties;

  return (
    <div className="container mx-auto p-4" style={primaryColorStyle}>
      {/* Team Header */}
      <Card className="mb-6 border-l-4" style={{ borderLeftColor: primaryColor }}>
        <CardHeader>
          <div className="flex items-center gap-4">
            {teamPage.team.logoUrl && (
              <Image
                src={teamPage.team.logoUrl}
                alt={teamPage.team.name}
                width={64}
                height={64}
                className="object-contain"
              />
            )}
            <div>
              <CardTitle className="text-5xl font-bold">{teamPage.team.longName}</CardTitle>
              <p className="text-2xl">{teamPage.team.nickname}</p>
              <p className="text-lg text-muted-foreground">{teamPage.season} Season</p>
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
                  <Image
                    src={teamPage.conference.logoUrl}
                    alt={teamPage.conference.name}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
                <p>
                {teamPage.records.conference.wins} - {teamPage.records.conference.losses}
              </p>
              </div>
            </div>
            {teamPage.seasons && teamPage.seasons.length > 1 && (
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Seasons:</h3>
                <div className="flex flex-wrap gap-1">
                  {teamPage.seasons.map((availableSeason, index) => (
                    <span key={availableSeason}>
                      {availableSeason === teamPage.season ? (
                        <span className="text-muted-foreground">{availableSeason}</span>
                      ) : (
                        <Link
                          href={`/team/${teamId}/${availableSeason}`}
                          className="text-blue-600 hover:underline"
                        >
                          {availableSeason}
                        </Link>
                      )}
                      {index < teamPage.seasons.length - 1 && <span className="text-muted-foreground">,</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card className="mb-6">
        <CardHeader className="border-b" style={{ borderColor: `${primaryColor}20` }}>
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: `${primaryColor}20` }}>
                  <th className="text-left py-2 px-2">Date</th>
                  <th className="text-center py-2 px-2">Result</th>
                  <th className="text-left py-2 px-2">Opponent</th>
                  <th className="text-right py-2 px-2 pr-8">Spread</th>
                  <th className="text-right py-2 px-2">O/U</th>
                  <th className="text-center py-2 px-2"></th>
                  <th className="text-right py-2 px-2 pr-8">ML</th>
                  <th className="text-right py-2 px-2 pr-8">Opp ML</th>
                </tr>
              </thead>
              <tbody>
                {teamPage.games.map((game) => (
                  <tr 
                    key={game.id}
                    className="border-b hover:bg-muted/50 transition-colors"
                    style={{ borderColor: `${primaryColor}20` }}
                  >
                    <td className="py-2 px-2 text-muted-foreground">
                      {format(new Date(game.date), 'MMM d')}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {game.score !== null && game.oppScore !== null ? (
                        <>
                          <span className={game.wOrL === 'W' ? 'text-green-600' : 'text-red-600'}>{game.wOrL}&nbsp;</span>
                          {game.score} - {game.oppScore}
                        </>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      <Link 
                        href={`/team/${game.opponent.id}/${season}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                         <span className="text-muted-foreground text-sm">{game.atVs}</span>
                        {game.opponent.logoUrl && (
                          <Image
                            src={game.opponent.logoUrl}
                            alt={game.opponent.name}
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        )}
                        <span className="font-medium">{game.opponent.name}</span>
                       
                      </Link>
                    </td>
                   
                    <td className="py-2 px-2 text-right">
                      {game.spreadDescription && game.spreadDescription.trim() !== '' ? (
                        <span className='text-blue-600 flex items-center justify-end gap-1'>
                         {game.spreadDescription}
                         {game.spreadCovered ? (
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                             <polyline points="20 6 9 17 4 12"></polyline>
                           </svg>
                         ) : (
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="invisible">
                             <polyline points="20 6 9 17 4 12"></polyline>
                           </svg>
                         )}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-2 px-2 text-right">
                      {game.overUnder !== null && (
                        <span className="text-blue-600">{game.overUnder}</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-left">
                      {game.overOrUnder !== null && (
                        <span className="text-blue-600">{game.overOrUnder}</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-right">
                      {game.moneyLine !== null && (
                        <span className='text-blue-600 flex items-center justify-end gap-1'>
                          {game.moneyLine > 0 ? '+' : ''}{game.moneyLine}
                          {game.wOrL === 'W' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="invisible">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-right">
                      {game.oppMoneyLine !== null && (
                        <span className='text-blue-600 flex items-center justify-end gap-1'>
                          {game.oppMoneyLine > 0 ? '+' : ''}{game.oppMoneyLine}
                          {game.wOrL === 'L' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="invisible">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
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
        <CardHeader className="border-b" style={{ borderColor: `${primaryColor}20` }}>
          <div className="flex items-center gap-2">
            {teamPage.conference.logoUrl && (
              <Image
                src={teamPage.conference.logoUrl}
                alt={teamPage.conference.name}
                width={64}
                height={64}
                className="object-contain"
              />
            )}
            <CardTitle>{teamPage.conference.name} Standings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: `${primaryColor}20` }}>
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
                    style={{ borderColor: `${primaryColor}20` }}
                  >
                    <td className="py-2 px-4">
                      <Link 
                        href={`/team/${standing.team.id}/${season}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        {standing.team.logoUrl && (
                          <Image
                            src={standing.team.logoUrl}
                            alt={standing.team.name}
                            width={24}
                            height={24}
                            className="object-contain"
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
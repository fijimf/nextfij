'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiClient } from '@/lib/api/client';
import { TeamDTO } from '@/lib/api/types/team';

interface Game {
  id: number;
  season: number;
  date: string;
  homeTeam: TeamDTO;
  awayTeam: TeamDTO;
  homeTeamSeed?: number | null;
  awayTeamSeed?: number | null;
  homeScore: number;
  awayScore: number;
  round?: string;
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [season, setSeason] = useState<number | null>(null);

  const fetchGamesByDate = useCallback(async (date: string) => {
    try {
      setLoading(true);
      setError(null);

      // Format date as YYYYMMDD for the API
      const formattedDate = date.replace(/-/g, '');
      const endpoint = formattedDate === new Date().toISOString().split('T')[0].replace(/-/g, '')
        ? '/games'
        : `/games/${formattedDate}`;

      const response = await apiClient.get(endpoint);
      const responseData = response.data.data;
      const gamesData = responseData?.games || [];
      setGames(gamesData);

      // Extract season from response data
      if (responseData?.season) {
        setSeason(responseData.season);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
      setError('Failed to fetch games for selected date');
      setGames([]);
      setSeason(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGamesByDate(selectedDate);
  }, [selectedDate, fetchGamesByDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleTodayClick = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  const getSeason = () => {
    if (season) return season;
    // Fallback: determine season based on date
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0-indexed to 1-indexed
    // Basketball season typically runs from November to March of next year
    return month >= 11 ? year + 1 : year;
  };

  const TeamLink = ({ team, children, className = '' }: { team: TeamDTO; children: React.ReactNode; className?: string }) => (
    <Link
      href={`/team/${team.id}`}
      className={`hover:text-primary transition-colors ${className}`}
    >
      {children}
    </Link>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <Card>
          <CardHeader>
            <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded animate-pulse mb-1"></div>
                          <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
                        </div>
                        <div className="w-6 h-4 bg-muted rounded animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded animate-pulse mb-1"></div>
                          <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
                        </div>
                        <div className="w-6 h-4 bg-muted rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl sm:text-3xl">Games by Date</CardTitle>
              <p className="text-muted-foreground mt-1">
                {formatDate(selectedDate)} • {getSeason()-1}-{getSeason().toString().slice(-2)} Season
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <Button
                variant="outline"
                onClick={handleTodayClick}
                className="whitespace-nowrap"
              >
                Today
              </Button>
              <Input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => fetchGamesByDate(selectedDate)}
              >
                Try Again
              </Button>
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No games scheduled for {formatDate(selectedDate)}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Away Team</TableHead>
                    <TableHead className="text-center w-16">Score</TableHead>
                    <TableHead>Home Team</TableHead>
                    <TableHead className="text-center w-16">Score</TableHead>
                    <TableHead className="text-center w-20">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {games.map((game) => {
                    const isGameFinished = (game.homeScore > 0 || game.awayScore > 0);
                    const isHomeWinner = game.homeScore > game.awayScore;
                    const isAwayWinner = game.awayScore > game.homeScore;

                    return (
                      <TableRow key={game.id} className="hover:bg-muted/50">
                        {/* Away Team */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {game.awayTeamSeed && (
                              <span className="text-xs font-bold text-muted-foreground w-6 text-center">
                                {game.awayTeamSeed}
                              </span>
                            )}
                            {game.awayTeam.logoUrl && (
                              <Image
                                src={game.awayTeam.logoUrl}
                                alt={game.awayTeam.name}
                                width={24}
                                height={24}
                                className="object-contain flex-shrink-0"
                              />
                            )}
                            <TeamLink
                              team={game.awayTeam}
                              className={`text-sm font-medium ${
                                isGameFinished && isAwayWinner ? 'font-bold text-green-700 dark:text-green-300' : ''
                              }`}
                            >
                              {game.awayTeam.name}
                            </TeamLink>
                          </div>
                        </TableCell>

                        {/* Away Score */}
                        <TableCell className="text-center">
                          <span className={`text-lg ${
                            isGameFinished && isAwayWinner ? 'font-bold text-green-700 dark:text-green-300' : 'font-medium'
                          }`}>
                            {isGameFinished ? game.awayScore : '-'}
                          </span>
                        </TableCell>

                        {/* Home Team */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {game.homeTeamSeed && (
                              <span className="text-xs font-bold text-muted-foreground w-6 text-center">
                                {game.homeTeamSeed}
                              </span>
                            )}
                            {game.homeTeam.logoUrl && (
                              <Image
                                src={game.homeTeam.logoUrl}
                                alt={game.homeTeam.name}
                                width={24}
                                height={24}
                                className="object-contain flex-shrink-0"
                              />
                            )}
                            <TeamLink
                              team={game.homeTeam}
                              className={`text-sm font-medium ${
                                isGameFinished && isHomeWinner ? 'font-bold text-green-700 dark:text-green-300' : ''
                              }`}
                            >
                              {game.homeTeam.name}
                            </TeamLink>
                          </div>
                        </TableCell>

                        {/* Home Score */}
                        <TableCell className="text-center">
                          <span className={`text-lg ${
                            isGameFinished && isHomeWinner ? 'font-bold text-green-700 dark:text-green-300' : 'font-medium'
                          }`}>
                            {isGameFinished ? game.homeScore : '-'}
                          </span>
                        </TableCell>

                        {/* Result */}
                        <TableCell className="text-center">
                          {isGameFinished ? (
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-950 px-2 py-1 rounded">
                              FINAL
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              SCHEDULED
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Games Summary */}
      {games.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{games.length}</div>
              <div className="text-sm text-muted-foreground">Total Games</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {games.filter(g => g.homeScore > 0 || g.awayScore > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {games.filter(g => g.homeScore === 0 && g.awayScore === 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Upcoming</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
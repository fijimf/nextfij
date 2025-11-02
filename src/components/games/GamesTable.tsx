'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { GameDetailDTO } from '@/lib/api/types/games';
import { cn } from '@/lib/utils';

interface GamesTableProps {
  games: GameDetailDTO[];
}

export function GamesTable({ games }: GamesTableProps) {
  const [filter, setFilter] = useState('');

  // Filter games by team name
  const filteredGames = useMemo(() => {
    if (!filter.trim()) return games;

    const lowerFilter = filter.toLowerCase();
    return games.filter((game) =>
      game.homeTeam.name.toLowerCase().includes(lowerFilter) ||
      game.awayTeam.name.toLowerCase().includes(lowerFilter) ||
      game.homeTeam.longName.toLowerCase().includes(lowerFilter) ||
      game.awayTeam.longName.toLowerCase().includes(lowerFilter)
    );
  }, [games, filter]);

  const isWinner = (score: number | null, oppScore: number | null) => {
    return score !== null && oppScore !== null && score > oppScore;
  };

  const isGameComplete = (game: GameDetailDTO) => {
    return game.homeScore !== null && game.awayScore !== null;
  };

  return (
    <div className="space-y-4">
      {/* Filter Input */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Filter by team name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        {filter && (
          <span className="text-sm text-muted-foreground">
            {filteredGames.length} of {games.length} games
          </span>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Away Team</TableHead>
              <TableHead className="text-center w-16">Score</TableHead>
              <TableHead className="w-[250px]">Home Team</TableHead>
              <TableHead className="text-center w-16">Score</TableHead>
              <TableHead className="text-center w-12">Site</TableHead>
              <TableHead className="text-center w-16">Conf</TableHead>
              <TableHead className="w-[100px]">Spread</TableHead>
              <TableHead className="text-center w-20">O/U</TableHead>
              <TableHead className="w-[120px]">Money Lines</TableHead>
              <TableHead className="text-center w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGames.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  {filter ? 'No games match your filter' : 'No games scheduled for this date'}
                </TableCell>
              </TableRow>
            ) : (
              filteredGames.map((game) => {
                const isComplete = isGameComplete(game);
                const homeWins = isWinner(game.homeScore, game.awayScore);
                const awayWins = isWinner(game.awayScore, game.homeScore);

                return (
                  <TableRow
                    key={game.id}
                    className={cn(
                      'hover:bg-muted/50',
                      isComplete && (homeWins || awayWins) && 'bg-green-50/30 dark:bg-green-950/10'
                    )}
                  >
                    {/* Away Team */}
                    <TableCell>
                      <Link
                        href={`/team/${game.awayTeam.id}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        {game.awayTeam.logoUrl && (
                          <Image
                            src={game.awayTeam.logoUrl}
                            alt={game.awayTeam.name}
                            width={24}
                            height={24}
                            className="object-contain flex-shrink-0"
                          />
                        )}
                        <span className={cn(
                          'text-sm',
                          awayWins && 'font-bold'
                        )}>
                          {game.awayTeam.name}
                        </span>
                      </Link>
                    </TableCell>

                    {/* Away Score */}
                    <TableCell className="text-center">
                      <span className={cn(
                        'text-base',
                        awayWins && 'font-bold'
                      )}>
                        {game.awayScore ?? '--'}
                      </span>
                    </TableCell>

                    {/* Home Team */}
                    <TableCell>
                      <Link
                        href={`/team/${game.homeTeam.id}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        {game.homeTeam.logoUrl && (
                          <Image
                            src={game.homeTeam.logoUrl}
                            alt={game.homeTeam.name}
                            width={24}
                            height={24}
                            className="object-contain flex-shrink-0"
                          />
                        )}
                        <span className={cn(
                          'text-sm',
                          homeWins && 'font-bold'
                        )}>
                          {game.homeTeam.name}
                        </span>
                      </Link>
                    </TableCell>

                    {/* Home Score */}
                    <TableCell className="text-center">
                      <span className={cn(
                        'text-base',
                        homeWins && 'font-bold'
                      )}>
                        {game.homeScore ?? '--'}
                      </span>
                    </TableCell>

                    {/* Venue Indicator */}
                    <TableCell className="text-center">
                      {game.isNeutral && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          N
                        </span>
                      )}
                    </TableCell>

                    {/* Conference */}
                    <TableCell className="text-center">
                      {game.conferenceGame && game.conferenceGame.logoUrl ? (
                        <Image
                          src={game.conferenceGame.logoUrl}
                          alt={game.conferenceGame.shortName}
                          width={24}
                          height={24}
                          className="object-contain mx-auto"
                          title={game.conferenceGame.name}
                        />
                      ) : game.conferenceGame ? (
                        <span className="text-xs text-muted-foreground" title={game.conferenceGame.name}>
                          {game.conferenceGame.shortName}
                        </span>
                      ) : null}
                    </TableCell>

                    {/* Spread */}
                    <TableCell>
                      {game.spread && (
                        <span className="text-xs">
                          {game.spread}
                        </span>
                      )}
                    </TableCell>

                    {/* Over/Under */}
                    <TableCell className="text-center">
                      {game.overUnder && (
                        <span className="text-xs">
                          {game.overUnder}
                        </span>
                      )}
                    </TableCell>

                    {/* Money Lines */}
                    <TableCell>
                      {(game.homeMoneyLine || game.awayMoneyLine) && (
                        <div className="text-xs space-y-0.5">
                          {game.homeMoneyLine && (
                            <div className={cn(
                              homeWins && isComplete && 'font-bold text-green-700 dark:text-green-400'
                            )}>
                              H: {game.homeMoneyLine > 0 ? '+' : ''}{game.homeMoneyLine}
                            </div>
                          )}
                          {game.awayMoneyLine && (
                            <div className={cn(
                              awayWins && isComplete && 'font-bold text-green-700 dark:text-green-400'
                            )}>
                              A: {game.awayMoneyLine > 0 ? '+' : ''}{game.awayMoneyLine}
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-center">
                      <Link
                        href={`/games/${game.id}`}
                        className="inline-flex items-center justify-center hover:text-primary transition-colors"
                        aria-label="View game details"
                      >
                        <Info className="h-4 w-4" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredGames.length === 0 ? (
          <Card className="p-8">
            <p className="text-center text-muted-foreground">
              {filter ? 'No games match your filter' : 'No games scheduled for this date'}
            </p>
          </Card>
        ) : (
          filteredGames.map((game) => {
            const isComplete = isGameComplete(game);
            const homeWins = isWinner(game.homeScore, game.awayScore);
            const awayWins = isWinner(game.awayScore, game.homeScore);

            return (
              <Card
                key={game.id}
                className={cn(
                  'p-4',
                  isComplete && (homeWins || awayWins) && 'bg-green-50/30 dark:bg-green-950/10'
                )}
              >
                <div className="space-y-3">
                  {/* Conference & Neutral Site Indicators */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {game.conferenceGame && (
                        <div className="flex items-center gap-1">
                          {game.conferenceGame.logoUrl ? (
                            <Image
                              src={game.conferenceGame.logoUrl}
                              alt={game.conferenceGame.shortName}
                              width={16}
                              height={16}
                              className="object-contain"
                            />
                          ) : (
                            <span>{game.conferenceGame.shortName}</span>
                          )}
                        </div>
                      )}
                      {game.isNeutral && (
                        <span className="bg-muted px-2 py-0.5 rounded">Neutral</span>
                      )}
                    </div>
                    <Link
                      href={`/games/${game.id}`}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      <Info className="h-3 w-3" />
                      <span>Details</span>
                    </Link>
                  </div>

                  {/* Away Team */}
                  <Link
                    href={`/team/${game.awayTeam.id}`}
                    className="flex items-center justify-between hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {game.awayTeam.logoUrl && (
                        <Image
                          src={game.awayTeam.logoUrl}
                          alt={game.awayTeam.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      )}
                      <span className={cn(
                        'font-medium',
                        awayWins && 'font-bold'
                      )}>
                        {game.awayTeam.name}
                      </span>
                    </div>
                    <span className={cn(
                      'text-xl',
                      awayWins && 'font-bold'
                    )}>
                      {game.awayScore ?? '--'}
                    </span>
                  </Link>

                  {/* Home Team */}
                  <Link
                    href={`/team/${game.homeTeam.id}`}
                    className="flex items-center justify-between hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {game.homeTeam.logoUrl && (
                        <Image
                          src={game.homeTeam.logoUrl}
                          alt={game.homeTeam.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      )}
                      <span className={cn(
                        'font-medium',
                        homeWins && 'font-bold'
                      )}>
                        {game.homeTeam.name}
                      </span>
                    </div>
                    <span className={cn(
                      'text-xl',
                      homeWins && 'font-bold'
                    )}>
                      {game.homeScore ?? '--'}
                    </span>
                  </Link>

                  {/* Betting Lines */}
                  {(game.spread || game.overUnder || game.homeMoneyLine || game.awayMoneyLine) && (
                    <div className="pt-2 border-t text-xs space-y-1">
                      {game.spread && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Spread:</span>
                          <span>{game.spread}</span>
                        </div>
                      )}
                      {game.overUnder && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">O/U:</span>
                          <span>{game.overUnder}</span>
                        </div>
                      )}
                      {(game.homeMoneyLine || game.awayMoneyLine) && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ML:</span>
                          <span>
                            {game.awayMoneyLine && <span className={cn(awayWins && isComplete && 'font-bold text-green-700 dark:text-green-400')}>{game.awayMoneyLine > 0 ? '+' : ''}{game.awayMoneyLine}</span>}
                            {game.awayMoneyLine && game.homeMoneyLine && ' / '}
                            {game.homeMoneyLine && <span className={cn(homeWins && isComplete && 'font-bold text-green-700 dark:text-green-400')}>{game.homeMoneyLine > 0 ? '+' : ''}{game.homeMoneyLine}</span>}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

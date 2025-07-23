'use client';

import { useState, useEffect, useRef, ReactElement } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from '@/lib/api/client';

interface Team {
  id: number;
  name: string;
  longName: string;
  nickname: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  slug: string;
}

interface Game {
  id: number;
  season: number;
  date: string;
  homeTeam: Team;
  awayTeam: Team;
  homeTeamSeed?: number;
  awayTeamSeed?: number;
  homeScore: number;
  awayScore: number;
  round?: string;
  venue?: string;
  gameTime?: string;
  status?: 'scheduled' | 'live' | 'final';
}

interface GameNode {
  game: Game;
  homeSource: GameNode | null;
  awaySource: GameNode | null;
}

interface TournamentData {
  roots: GameNode[];
  tournament?: {
    name: string;
    year: number;
    currentRound?: string;
  };
}

interface GameColumn {
  date: string;
  games: GameNode[];
}

interface GamePosition {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isWinner: boolean;
}

export default function TournamentPage() {
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [gamePositions, setGamePositions] = useState<GamePosition[]>([]);
  const [hoveredGameId, setHoveredGameId] = useState<number | null>(null);
  const [selectedGamePath, setSelectedGamePath] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const response = await apiClient.get('/tournament');
        setTournamentData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch tournament data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, []);

  const renderGame = (gameNode: GameNode, onRef: (el: HTMLDivElement | null) => void) => {
    const { game } = gameNode;
    const isHomeWinner = game.homeScore > game.awayScore;
    const gameFinished = game.status === 'final' || (game.homeScore > 0 || game.awayScore > 0);

    return (
      <div 
        key={game.id} 
        className="w-full min-w-[180px] max-w-[220px] sm:min-w-[200px] cursor-pointer transition-all duration-200 hover:scale-105"
        ref={onRef}
        onMouseEnter={() => setHoveredGameId(game.id)}
        onMouseLeave={() => setHoveredGameId(null)}
        onClick={() => {
          // Toggle path highlighting
          if (selectedGamePath.includes(game.id)) {
            setSelectedGamePath([]);
          } else {
            const path = getGamePath(game.id);
            setSelectedGamePath(path);
          }
          // TODO: Navigate to game details
          console.log('Navigate to game:', game.id);
        }}
      >
        <div className="flex flex-col gap-1 p-3 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
          {/* Game Info Header */}
          {game.gameTime && (
            <div className="text-xs text-muted-foreground text-center mb-1">
              {game.gameTime} {game.venue && `• ${game.venue}`}
            </div>
          )}
          
          {/* Home Team */}
          <div className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
            gameFinished && isHomeWinner 
              ? 'bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800' 
              : gameFinished && !isHomeWinner
              ? 'bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800'
              : 'hover:bg-muted/50'
          }`}>
            {game.homeTeamSeed && (
              <span className="text-xs font-bold text-muted-foreground w-6 text-center">
                {game.homeTeamSeed}
              </span>
            )}
            <Image 
              src={game.homeTeam.logoUrl} 
              alt={game.homeTeam.name}
              width={24}
              height={24}
              className="object-contain flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className={`text-sm ${gameFinished && isHomeWinner ? 'font-bold' : 'font-medium'} truncate`}>
                {game.homeTeam.name}
              </div>
            </div>
            <div className={`text-sm ${gameFinished && isHomeWinner ? 'font-bold text-green-700 dark:text-green-300' : 'font-medium'}`}>
              {gameFinished ? game.homeScore : '-'}
            </div>
          </div>
          
          {/* Away Team */}
          <div className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
            gameFinished && !isHomeWinner 
              ? 'bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800' 
              : gameFinished && isHomeWinner
              ? 'bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800'
              : 'hover:bg-muted/50'
          }`}>
            {game.awayTeamSeed && (
              <span className="text-xs font-bold text-muted-foreground w-6 text-center">
                {game.awayTeamSeed}
              </span>
            )}
            <Image 
              src={game.awayTeam.logoUrl} 
              alt={game.awayTeam.name}
              width={24}
              height={24}
              className="object-contain flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className={`text-sm ${gameFinished && !isHomeWinner ? 'font-bold' : 'font-medium'} truncate`}>
                {game.awayTeam.name}
              </div>
            </div>
            <div className={`text-sm ${gameFinished && !isHomeWinner ? 'font-bold text-green-700 dark:text-green-300' : 'font-medium'}`}>
              {gameFinished ? game.awayScore : '-'}
            </div>
          </div>

          {/* Game Status */}
          {game.status === 'live' && (
            <div className="text-xs text-center text-red-600 dark:text-red-400 font-medium animate-pulse">
              LIVE
            </div>
          )}
        </div>
      </div>
    );
  };

  const collectGamesByDate = (node: GameNode, gamesByDate: Map<string, GameNode[]>) => {
    if (!node) return;
    
    const date = node.game.date;
    if (!gamesByDate.has(date)) {
      gamesByDate.set(date, []);
    }
    gamesByDate.get(date)!.push(node);

    if (node.homeSource) collectGamesByDate(node.homeSource, gamesByDate);
    if (node.awaySource) collectGamesByDate(node.awaySource, gamesByDate);
  };

  const getGamePath = (gameId: number): number[] => {
    if (!tournamentData) return [];
    
    const path: number[] = [];
    const visited = new Set<number>();
    
    const findPath = (node: GameNode): boolean => {
      if (!node || visited.has(node.game.id)) return false;
      visited.add(node.game.id);
      
      if (node.game.id === gameId) {
        path.push(node.game.id);
        return true;
      }
      
      if (node.homeSource && findPath(node.homeSource)) {
        path.push(node.game.id);
        return true;
      }
      
      if (node.awaySource && findPath(node.awaySource)) {
        path.push(node.game.id);
        return true;
      }
      
      return false;
    };
    
    for (const root of tournamentData.roots) {
      if (findPath(root)) break;
    }
    
    return path.reverse();
  };

  const getRoundName = (date: string, index: number, total: number): string => {
    // Mock round names based on position - this can be enhanced with API data
    const roundNames = [
      'First Four', 'First Four', 'Round of 64','Round of 64', 'Round of 32','Round of 32', 'Sweet 16','Sweet 16',
      'Elite Eight','Elite Eight', 'Final Four', 'Championship'
    ];
    
    if (total <= roundNames.length) {
      return roundNames[index] || `Round ${index + 1}`;
    }
    
    // Fallback to generic naming for longer tournaments
    return `Round ${index + 1}`;
  };

  const getGameColumns = (): GameColumn[] => {
    if (!tournamentData) return [];

    const gamesByDate = new Map<string, GameNode[]>();
    tournamentData.roots.forEach(root => collectGamesByDate(root, gamesByDate));

    return Array.from(gamesByDate.entries())
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .map(([date, games]) => ({
        date,
        games
      }));
  };

  const updateGamePositions = () => {
    if (!containerRef.current) return;

    const positions: GamePosition[] = [];
    const gameElements = containerRef.current.getElementsByClassName('game-card');
    
    Array.from(gameElements).forEach((el) => {
      const rect = el.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();
      
      positions.push({
        id: parseInt(el.getAttribute('data-game-id') || '0'),
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height,
        isWinner: el.getAttribute('data-is-winner') === 'true'
      });
    });

    setGamePositions(positions);
  };

  useEffect(() => {
    if (!loading && tournamentData) {
      // Wait for the DOM to update
      setTimeout(updateGamePositions, 0);
    }
  }, [loading, tournamentData]);

  const renderConnectingLines = () => {
    if (!tournamentData || gamePositions.length === 0) return null;

    const lines: ReactElement[] = [];
    const drawLine = (start: GamePosition, end: GamePosition, isHighlighted: boolean = false, isHovered: boolean = false) => {
      const startX = start.x + start.width; // Right side of earlier game
      const startY = start.y + (start.height / 2);
      const endX = end.x; // Left side of later game
      const endY = end.y + (end.height / 2);
      const controlX = (startX + endX) / 2;

      let strokeColor = 'text-muted-foreground/30';
      let strokeWidth = '2';
      
      if (isHighlighted) {
        strokeColor = 'text-primary';
        strokeWidth = '3';
      } else if (isHovered) {
        strokeColor = 'text-muted-foreground/60';
        strokeWidth = '2.5';
      }

      return (
        <path
          key={`${start.id}-${end.id}`}
          d={`M ${startX} ${startY} C ${controlX} ${startY}, ${controlX} ${endY}, ${endX} ${endY}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={`${strokeColor} transition-all duration-200`}
          style={{
            filter: isHighlighted ? 'drop-shadow(0 0 3px currentColor)' : undefined
          }}
        />
      );
    };

    const processNode = (node: GameNode) => {
      if (!node) return;

      const currentPos = gamePositions.find(p => p.id === node.game.id);
      if (!currentPos) return;

      if (node.homeSource) {
        const homePos = gamePositions.find(p => p.id === node.homeSource!.game.id);
        if (homePos) {
          const isHighlighted = selectedGamePath.includes(node.game.id) && selectedGamePath.includes(node.homeSource.game.id);
          const isHovered = hoveredGameId === node.game.id || hoveredGameId === node.homeSource.game.id;
          lines.push(drawLine(homePos, currentPos, isHighlighted, isHovered));
        }
        processNode(node.homeSource);
      }

      if (node.awaySource) {
        const awayPos = gamePositions.find(p => p.id === node.awaySource!.game.id);
        if (awayPos) {
          const isHighlighted = selectedGamePath.includes(node.game.id) && selectedGamePath.includes(node.awaySource.game.id);
          const isHovered = hoveredGameId === node.game.id || hoveredGameId === node.awaySource.game.id;
          lines.push(drawLine(awayPos, currentPos, isHighlighted, isHovered));
        }
        processNode(node.awaySource);
      }
    };

    tournamentData.roots.forEach(processNode);

    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {lines}
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        {/* Tournament Header Skeleton */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <div className="h-8 bg-muted rounded-lg w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
            </div>
            <div className="flex gap-4">
              <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-18 animate-pulse"></div>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-4">
              {/* Skeleton for multiple rounds */}
              {[...Array(6)].map((_, roundIndex) => (
                <div key={roundIndex} className="flex flex-col gap-4 sm:gap-6 lg:gap-8 flex-shrink-0">
                  {/* Round Header Skeleton */}
                  <div className="text-center">
                    <div className="h-6 bg-muted rounded w-24 mx-auto mb-1 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-16 mx-auto animate-pulse"></div>
                  </div>
                  
                  {/* Games Skeleton */}
                  <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                    {[...Array(Math.max(1, 4 - roundIndex))].map((_, gameIndex) => (
                      <div key={gameIndex} className="w-[200px]">
                        <div className="flex flex-col gap-1 p-3 rounded-lg border bg-card">
                          {/* Home Team Skeleton */}
                          <div className="flex items-center gap-2 p-2 rounded-md">
                            <div className="w-6 h-6 bg-muted rounded animate-pulse"></div>
                            <div className="w-6 h-4 bg-muted rounded animate-pulse"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-muted rounded animate-pulse"></div>
                            </div>
                            <div className="w-6 h-4 bg-muted rounded animate-pulse"></div>
                          </div>
                          
                          {/* Away Team Skeleton */}
                          <div className="flex items-center gap-2 p-2 rounded-md">
                            <div className="w-6 h-6 bg-muted rounded animate-pulse"></div>
                            <div className="w-6 h-4 bg-muted rounded animate-pulse"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-muted rounded animate-pulse"></div>
                            </div>
                            <div className="w-6 h-4 bg-muted rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Skeleton */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="p-4">
              <div className="text-center">
                <div className="h-8 bg-muted rounded w-8 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-16 mx-auto animate-pulse"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!tournamentData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-muted-foreground">Failed to load tournament data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gameColumns = getGameColumns();

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Tournament Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {tournamentData?.tournament?.name || 'NCAA Tournament'} Bracket
            </h1>
            {tournamentData?.tournament?.year && (
              <p className="text-muted-foreground">
                {tournamentData.tournament.year} Season
                {tournamentData.tournament.currentRound && 
                  ` • Current: ${tournamentData.tournament.currentRound}`
                }
              </p>
            )}
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-200 border border-green-300 rounded"></div>
              <span>Winner</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
              <span>Eliminated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted border rounded"></div>
              <span>Upcoming</span>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          {/* Mobile warning */}
          <div className="lg:hidden mb-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              💡 Scroll horizontally to view the full bracket
            </p>
          </div>

          <div 
            ref={containerRef}
            className="relative flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-4 min-h-[400px]"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {renderConnectingLines()}
            {gameColumns.map((column, columnIndex) => (
              <div 
                key={column.date} 
                className="flex flex-col gap-4 sm:gap-6 lg:gap-8 flex-shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Round Header */}
                <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 pb-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">
                      {getRoundName(column.date, columnIndex, gameColumns.length)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(column.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Games */}
                <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                  {column.games.map((gameNode) => renderGame(
                    gameNode,
                    (el) => {
                      if (el) {
                        el.setAttribute('data-game-id', gameNode.game.id.toString());
                        el.setAttribute(
                          'data-is-winner',
                          (gameNode.game.homeScore > gameNode.game.awayScore).toString()
                        );
                        el.classList.add('game-card');
                      }
                    }
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tournament Stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{gameColumns.length}</div>
            <div className="text-sm text-muted-foreground">Rounds</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {gameColumns.reduce((acc, col) => acc + col.games.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Games</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {gameColumns.reduce((acc, col) => 
                acc + col.games.filter(g => 
                  g.game.status === 'final' || (g.game.homeScore > 0 || g.game.awayScore > 0)
                ).length, 0
              )}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {gameColumns.reduce((acc, col) => 
                acc + col.games.filter(g => g.game.status === 'live').length, 0
              )}
            </div>
            <div className="text-sm text-muted-foreground">Live</div>
          </div>
        </Card>
      </div>
    </div>
  );
} 
'use client';

import { useState, useEffect, useRef, ReactElement } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  homeScore: number;
  awayScore: number;
}

interface GameNode {
  game: Game;
  homeSource: GameNode | null;
  awaySource: GameNode | null;
}

interface TournamentData {
  roots: GameNode[];
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

    return (
      <div 
        key={game.id} 
        className="min-w-[200px]"
        ref={onRef}
      >
        <div className="flex flex-col gap-1 p-2 rounded-lg border bg-card">
          {/* Home Team */}
          <div className={`flex items-center gap-2 p-1 rounded ${isHomeWinner ? 'bg-primary/10' : ''}`}>
            <img 
              src={game.homeTeam.logoUrl} 
              alt={game.homeTeam.name}
              className="w-6 h-6 object-contain"
            />
            <div className="flex-1">
              <div className="font-medium">{game.homeTeam.name}</div>
            </div>
            <div className="font-medium">{game.homeScore}</div>
          </div>
          
          {/* Away Team */}
          <div className={`flex items-center gap-2 p-1 rounded ${!isHomeWinner ? 'bg-primary/10' : ''}`}>
            <img 
              src={game.awayTeam.logoUrl} 
              alt={game.awayTeam.name}
              className="w-6 h-6 object-contain"
            />
            <div className="flex-1">
              <div className="font-medium">{game.awayTeam.name}</div>
            </div>
            <div className="font-medium">{game.awayScore}</div>
          </div>
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
    const drawLine = (start: GamePosition, end: GamePosition) => {
      const startX = start.x;
      const startY = start.y + (start.height / 2);
      const endX = end.x + end.width;
      const endY = end.y + (end.height / 2);
      const controlX = (startX + endX) / 2;

      return (
        <path
          key={`${start.id}-${end.id}`}
          d={`M ${startX} ${startY} C ${controlX} ${startY}, ${controlX} ${endY}, ${endX} ${endY}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/50"
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
          lines.push(drawLine(currentPos, homePos));
        }
        processNode(node.homeSource);
      }

      if (node.awaySource) {
        const awayPos = gamePositions.find(p => p.id === node.awaySource!.game.id);
        if (awayPos) {
          lines.push(drawLine(currentPos, awayPos));
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
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
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
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>NCAA Tournament Bracket</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={containerRef}
            className="relative flex gap-8 overflow-x-auto pb-4"
          >
            {renderConnectingLines()}
            {gameColumns.map((column) => (
              <div key={column.date} className="flex flex-col gap-8">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {new Date(column.date).toLocaleDateString()}
                </div>
                <div className="flex flex-col gap-8">
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
    </div>
  );
} 
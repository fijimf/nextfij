'use client';

import { useState, useEffect } from 'react';
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

export default function TournamentPage() {
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const response = await apiClient.get('/tournament');
        setTournamentData(response.data);
      } catch (error) {
        console.error('Failed to fetch tournament data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, []);

  const renderGame = (gameNode: GameNode) => {
    const { game } = gameNode;
    const isHomeWinner = game.homeScore > game.awayScore;

    return (
      <div key={game.id} className="min-w-[200px]">
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
          <div className="flex gap-8 overflow-x-auto pb-4">
            {gameColumns.map((column) => (
              <div key={column.date} className="flex flex-col gap-8">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {new Date(column.date).toLocaleDateString()}
                </div>
                <div className="flex flex-col gap-8">
                  {column.games.map((gameNode) => renderGame(gameNode))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
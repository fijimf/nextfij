'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/lib/api/client';

interface TeamRecord {
  name: string | null;
  wins: number;
  losses: number;
}

interface Team {
  id: number;
  name: string;
  nickname: string;
  logoUrl: string;
  conference: string;
  conferenceLogoUrl: string | null;
  conferenceId: number;
  record: TeamRecord;
}

interface TeamsResponse {
  teams: Team[];
}

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConference, setSelectedConference] = useState('all');
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await apiClient.get<TeamsResponse>('/teams');
        setTeams(response.data.teams);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load teams. Please try again later.');
        setIsLoading(false);
        console.error('Error fetching teams:', err);
      }
    };

    fetchTeams();
  }, []);

  // Filter teams based on search term and conference
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConference = selectedConference === 'all' || team.conference === selectedConference;
    return matchesSearch && matchesConference;
  });

  // Get unique conferences and ensure 'all' is first
  const conferences = ['all', ...Array.from(new Set(teams.map(team => team.conference))).sort()];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Teams</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Select value={selectedConference} onValueChange={setSelectedConference}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by conference" />
            </SelectTrigger>
            <SelectContent position="popper">
              {conferences.map((conference) => (
                <SelectItem 
                  key={conference} 
                  value={conference}
                >
                  {conference === 'all' ? 'All Conferences' : conference}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTeams.map((team) => (
          <div 
            key={team.id} 
            className="flex items-center p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {/* Handle team click */}}
          >
            <div className="flex-shrink-0 w-12 h-12 mr-4 bg-muted rounded-full flex items-center justify-center">
              <Image
                src={team.logoUrl}
                alt={`${team.name} ${team.nickname}`}
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate">{team.name}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {team.nickname}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {team.conferenceLogoUrl && (
                  <Image
                    src={team.conferenceLogoUrl}
                    alt={team.conference}
                    width={16}
                    height={16}
                    className="rounded-sm"
                  />
                )}
                <span className="text-xs text-muted-foreground truncate">
                  {team.conference}
                </span>
              </div>
            </div>
            <div className="ml-4 text-sm font-medium">
              {team.record.wins}-{team.record.losses}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
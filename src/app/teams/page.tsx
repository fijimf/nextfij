'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApiQuery } from '@/lib/api/hooks';
import { teamsResponseSchema } from '@/lib/validation/schemas';
import { TeamsPageSkeleton } from '@/components/ui/loading-states';

interface TeamRecord {
  name: string | null;
  wins: number;
  losses: number;
}

interface Team {
  id: number;
  name: string;
  nickname: string;
  logoUrl: string | null;
  conference: string | null;
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
  
  const { data: teamsResponse, isLoading, error } = useApiQuery<TeamsResponse>(
    ['teams'],
    '/teams',
    teamsResponseSchema
  );

  const teams = teamsResponse?.teams || [];

  // Filter teams based on search term and conference
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) || team.nickname.toLowerCase().includes(searchTerm.toLowerCase())  ;
    const matchesConference = selectedConference === 'all' || team.conference === selectedConference;
    return matchesSearch && matchesConference;
  });

  // Get unique conferences and ensure 'all' is first
  const conferences = ['all', ...Array.from(new Set(teams.map(team => team.conference).filter(conf => conf !== null))).sort()];

  if (isLoading) {
    return <TeamsPageSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>{error.message || 'Failed to load teams. Please try again later.'}</p>
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
          <Link 
            key={team.id} 
            href={`/team/${team.id}`}
            className="block"
          >
            <div className="flex items-center p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 mr-4  rounded-full flex items-center justify-center">
                {team.logoUrl ? (
                  <Image
                    src={team.logoUrl}
                    alt={`${team.name} ${team.nickname}`}
                    width={32}
                    height={32}
                    className=""
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-xs">{team.name.charAt(0)}</span>
                  </div>
                )}
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
                      alt={team.conference || 'Conference'}
                      width={16}
                      height={16}
                      className="rounded-sm"
                    />
                  )}
                  <span className="text-xs text-muted-foreground truncate">
                    {team.conference || 'No Conference'}
                  </span>
                </div>
              </div>
              <div className="ml-4 text-sm font-medium">
                {team.record.wins}-{team.record.losses}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 
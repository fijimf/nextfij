'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useApiQuery } from '@/lib/api/hooks';
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
  overallRecord: TeamRecord;
  conferenceRecord: TeamRecord;
}

interface Conference {
  name: string;
  logoUrl: string | null;
  teams: Team[];
}

interface ConferencesResponse {
  conferences: Conference[];
}

export default function ConferencesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: conferencesResponse, isLoading, error } = useApiQuery<ConferencesResponse>(
    ['teams-by-conference'],
    '/teams-by-conference'
  );

  const conferences = conferencesResponse?.conferences || [];

  // Filter conferences based on search term
  const filteredConferences = conferences.filter(conference => 
    conference.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conference.teams.some(team => 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      team.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ).map(conference => ({
    ...conference,
    teams: conference.teams.filter(team =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      team.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conference.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  if (isLoading) {
    return <TeamsPageSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>{error.message || 'Failed to load conferences. Please try again later.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Conferences</h1>
        <Input
          placeholder="Search conferences or teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredConferences.map((conference) => (
          <div key={conference.name} className="border rounded-lg p-6">
            <div className="flex items-center mb-6">
              {conference.logoUrl && (
                <Image
                  src={conference.logoUrl}
                  alt={conference.name}
                  width={48}
                  height={48}
                  className="mr-4"
                />
              )}
              <h2 className="text-xl font-semibold">{conference.name}</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2 font-medium">Team</th>
                    <th className="text-right pb-2 font-medium">Overall</th>
                    <th className="text-right pb-2 font-medium">Conference</th>
                  </tr>
                </thead>
                <tbody>
                  {conference.teams.map((team) => (
                    <tr key={team.id} className="border-b last:border-b-0 hover:bg-muted/50">
                      <td className="py-2">
                        <Link 
                          href={`/team/${team.id}`}
                          className="flex items-center hover:text-primary"
                        >
                          <div className="flex-shrink-0 w-8 h-8 mr-3 flex items-center justify-center">
                            {team.logoUrl ? (
                              <Image
                                src={team.logoUrl}
                                alt={`${team.name} ${team.nickname}`}
                                width={24}
                                height={24}
                                className=""
                              />
                            ) : (
                              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-500 text-xs">{team.name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{team.name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {team.nickname}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="text-right py-2 font-medium">
                        {team.overallRecord.wins}-{team.overallRecord.losses}
                      </td>
                      <td className="text-right py-2 font-medium">
                        {team.conferenceRecord.wins}-{team.conferenceRecord.losses}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
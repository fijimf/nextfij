'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH1 } from "@/components/ui/typography";
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

interface SummaryStub {
  date: string;
  n: number;
  min: number;
  q1: number;
  med: number;
  q3: number;
  max: number;
  mean: number;
  stdDev: number;
  percentile95: number;
  percentile99: number;
  skewness: number;
  kurtosis: number;
}

interface StatSummary {
  key: string;
  name: string;
  description: string;
  seasonYear: number;
  asOf: string;
  isHigherBetter: boolean;
  decimalPlaces: number;
  asOfSummary: SummaryStub;
  summaryStubs: SummaryStub[];
  statistics: {
    rank: number;
    rankTieBest: number;
    rankTieAvg: number;
    team: Team;
    statisticValue: number;
    date: string;
  }[];
}

export default function StatisticsPage() {
  const [availableStats, setAvailableStats] = useState<string[]>([]);
  const [statSummaries, setStatSummaries] = useState<Record<string, StatSummary>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // First get the list of available statistics
        const statsResponse = await apiClient.get('/stats');
        const stats = statsResponse.data.data;
        setAvailableStats(stats);

        // Then fetch summary data for each statistic
        const summaries: Record<string, StatSummary> = {};
        await Promise.all(
          stats.map(async (statKey: string) => {
            try {
              const summaryResponse = await apiClient.get(`/stats/${statKey}/summary`);
              summaries[statKey] = summaryResponse.data.data;
            } catch (error) {
              console.error(`Failed to fetch summary for ${statKey}:`, error);
            }
          })
        );
        
        setStatSummaries(summaries);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <TypographyH1 className="mb-4">Basketball Statistics</TypographyH1>
        <p className="text-muted-foreground">
          Comprehensive statistical analysis for all teams in the latest season. 
          Click on any statistic name to view detailed analysis and trends.
        </p>
      </div>

      <div className="grid gap-6">
        {availableStats.map((statKey) => {
          const summary = statSummaries[statKey];
          if (!summary) return null;

          const topTenTeams = summary.statistics.slice(0, 10);

          return (
            <Card key={statKey} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>
                  <Link 
                    href={`/stats/${statKey}/summary`}
                    className="hover:text-primary transition-colors"
                  >
                    {summary.name}
                  </Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {summary.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Descriptive Statistics */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-sm">Descriptive Statistics</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    <div>
                      <span className="font-medium">Min:</span>{' '}
                      {summary.asOfSummary.min.toFixed(summary.decimalPlaces)}
                    </div>
                    <div>
                      <span className="font-medium">Median:</span>{' '}
                      {summary.asOfSummary.med.toFixed(summary.decimalPlaces)}
                    </div>
                    <div>
                      <span className="font-medium">Max:</span>{' '}
                      {summary.asOfSummary.max.toFixed(summary.decimalPlaces)}
                    </div>
                    <div>
                      <span className="font-medium">Mean:</span>{' '}
                      {summary.asOfSummary.mean.toFixed(3)}
                    </div>
                    <div>
                      <span className="font-medium">Std Dev:</span>{' '}
                      {summary.asOfSummary.stdDev.toFixed(3)}
                    </div>
                  </div>
                </div>

                {/* Top Ten Teams */}
                <div>
                  <h4 className="font-medium mb-3 text-sm">Top 10 Teams</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                    {topTenTeams.map((stat) => (
                      <div 
                        key={stat.team.id} 
                        className="flex items-center gap-2 p-2 bg-muted/20 rounded text-xs"
                      >
                        <span className="font-medium text-primary min-w-[1.5rem]">
                          {stat.rankTieBest}.
                        </span>
                        <Image
                          src={stat.team.logoUrl}
                          alt={stat.team.name}
                          width={16}
                          height={16}
                          className="object-contain flex-shrink-0"
                        />
                        <span className="truncate flex-1">
                          {stat.team.name}
                        </span>
                        <span className="font-medium">
                          {stat.statisticValue.toFixed(summary.decimalPlaces)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
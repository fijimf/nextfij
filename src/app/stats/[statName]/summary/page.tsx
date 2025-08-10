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

interface StatSummary {
  key: string;
  name: string;
  description: string;
  seasonYear: number;
  asOf: string;
  isHigherBetter: boolean;
  decimalPlaces: number;
  asOfSummary: {
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
  };
  statistics: {
    rank: number;
    rankTieBest: number;
    rankTieAvg: number;
    team: Team;
    statisticValue: number;
    date: string;
  }[];
}

export default function StatSummaryPage({ params }: { params: Promise<{ statName: string }> }) {
  const [statSummary, setStatSummary] = useState<StatSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatSummary = async () => {
      try {
        const resolvedParams = await params;
        const response = await apiClient.get(`/stats/${resolvedParams.statName}/summary`);
        setStatSummary(response.data.data);
      } catch (error) {
        console.error('Failed to fetch stat summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatSummary();
  }, [params]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (!statSummary) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-muted-foreground">Failed to load statistics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header Panel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{statSummary.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            {statSummary.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium">Season:</span>
              <span>{statSummary.seasonYear}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">As of:</span>
              <span>{formatDate(statSummary.asOf)}</span>
            </div>
          </div>
          <div className="space-y-2 pt-2 text-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-1">
              <div><span className="font-medium">Count:</span> {statSummary.asOfSummary.n}</div>
              <div><span className="font-medium">Mean:</span> {statSummary.asOfSummary.mean.toFixed(3)}</div>
              <div><span className="font-medium">Std Deviation:</span> {statSummary.asOfSummary.stdDev.toFixed(3)}</div>
              <div><span className="font-medium">Skewness:</span> {statSummary.asOfSummary.skewness.toFixed(3)}</div>
              <div><span className="font-medium">Kurtosis:</span> {statSummary.asOfSummary.kurtosis.toFixed(3)}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-1">
              <div><span className="font-medium">Min:</span> {statSummary.asOfSummary.min.toFixed(statSummary.decimalPlaces)}</div>
              <div><span className="font-medium">Q1:</span> {statSummary.asOfSummary.q1.toFixed(statSummary.decimalPlaces)}</div>
              <div><span className="font-medium">Median:</span> {statSummary.asOfSummary.med.toFixed(statSummary.decimalPlaces)}</div>
              <div><span className="font-medium">Q3:</span> {statSummary.asOfSummary.q3.toFixed(statSummary.decimalPlaces)}</div>
              <div><span className="font-medium">P95:</span> {statSummary.asOfSummary.percentile95.toFixed(statSummary.decimalPlaces)}</div>
              <div><span className="font-medium">P99:</span> {statSummary.asOfSummary.percentile99.toFixed(statSummary.decimalPlaces)}</div>
              <div><span className="font-medium">Max:</span> {statSummary.asOfSummary.max.toFixed(statSummary.decimalPlaces)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for future content */}
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <p className="text-muted-foreground">Additional content will be added here</p>
        </CardContent>
      </Card>
    </div>
  );
}
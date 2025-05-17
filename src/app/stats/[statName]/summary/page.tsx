'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from '@/lib/api/client';
import * as d3 from 'd3';

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
  name: string;
  description: string;
  higherIsBetter: boolean;
  decimalPlaces: number;
  season: number;
  statistics: {
    rank: number;
    team: Team;
    statisticValue: number;
    date: string;
  }[];
  summaries: {
    date: string;
    count: number;
    minimum: number;
    firstQuartile: number;
    median: number;
    thirdQuartile: number;
    maximum: number;
    mean: number;
    standardDeviation: number;
  }[];
}

export default function StatSummaryPage({ params }: { params: { statName: string } }) {
  const [statSummary, setStatSummary] = useState<StatSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatSummary = async () => {
      try {
        const response = await apiClient.get(`/stats/${params.statName}/summary`);
        setStatSummary(response.data);
      } catch (error) {
        console.error('Failed to fetch stat summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatSummary();
  }, [params.statName]);

  // D3 graph initialization
  useEffect(() => {
    if (!statSummary) return;

    // Clear any existing SVG
    d3.select('#stat-graph').selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select('#stat-graph')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse dates
    const parseDate = d3.timeParse('%Y-%m-%d');
    const data = statSummary.summaries.map(d => ({
      ...d,
      date: parseDate(d.date)!
    }));

    // Create scales
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.maximum)!])
      .range([height, 0]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Add mean line
    const line = d3.line<typeof data[0]>()
      .x(d => x(d.date))
      .y(d => y(d.mean));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add area for quartiles
    const area = d3.area<typeof data[0]>()
      .x(d => x(d.date))
      .y0(d => y(d.firstQuartile))
      .y1(d => y(d.thirdQuartile));

    svg.append('path')
      .datum(data)
      .attr('fill', '#2563eb')
      .attr('fill-opacity', 0.1)
      .attr('d', area);

  }, [statSummary]);

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
      {/* Header Box */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{statSummary.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{statSummary.description}</p>
          <p className="text-sm text-muted-foreground mt-2">Season: {statSummary.season}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* Team List Panel */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Team Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {statSummary.statistics.map((stat) => (
                <div key={stat.team.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stat.rank}.</span>
                    <img 
                      src={stat.team.logoUrl} 
                      alt={stat.team.name}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-sm">{stat.team.name}</span>
                  </div>
                  <span className="text-sm font-medium">{stat.statisticValue.toFixed(statSummary.decimalPlaces)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Graph Panel */}
        <Card className="col-span-9">
          <CardHeader>
            <CardTitle>Season Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div id="stat-graph" className="w-full h-[400px]"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
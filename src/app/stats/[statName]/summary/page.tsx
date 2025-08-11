'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function StatSummaryPage({ params }: { params: Promise<{ statName: string }> }) {
  const [statSummary, setStatSummary] = useState<StatSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeSeriesMode, setTimeSeriesMode] = useState<'median' | 'mean'>('median');

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

  const getTimeSeriesOption = () => {
    if (!statSummary || !statSummary.summaryStubs) return {};

    const historicalData = statSummary.summaryStubs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const dates = historicalData.map(d => d.date);

    return {
      title: {
        text: `${statSummary.name} Over Time`,
        left: 'center',
        textStyle: { fontSize: 16 }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any) => {
          const date = new Date(params[0].axisValue).toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric' 
          });
          let tooltip = `<strong>${date}</strong><br/>`;
          params.forEach((param: any) => {
            if (param.seriesName && param.value !== undefined && !param.seriesName.includes('Range')) {
              const value = Array.isArray(param.value) ? param.value[1] : param.value;
              if (typeof value === 'number') {
                // Match formatting from summary panel: Mean uses 3 decimals, others use statSummary.decimalPlaces
                let decimals = statSummary.decimalPlaces;
                if (param.seriesName === 'Mean' || (timeSeriesMode === 'mean' && param.seriesName.includes('Std Dev'))) {
                  decimals = 3;
                }
                tooltip += `${param.marker}${param.seriesName}: ${value.toFixed(decimals)}<br/>`;
              }
            }
          });
          return tooltip;
        }
      },
      legend: {
        data: [
          timeSeriesMode === 'median' ? 'Median' : 'Mean',
          timeSeriesMode === 'median' ? 'IQR Range' : '±1 Std Dev',
          'Minimum',
          'Maximum'
        ],
        top: 30
      },
      toolbox: {
        right: 20,
        feature: {
          dataZoom: { yAxisIndex: 'none' },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          formatter: (value: string) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }
      },
      yAxis: {
        type: 'value',
        name: statSummary.name
      },
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        { start: 0, end: 100, height: 30, bottom: 10 }
      ],
      series: [
        {
          name: timeSeriesMode === 'median' ? 'IQR Range' : '±1 Std Dev',
          type: 'line',
          data: historicalData.map(d => [d.date, timeSeriesMode === 'median' ? d.q1 : d.mean - d.stdDev]),
          stack: 'range',
          areaStyle: { color: 'rgba(37, 99, 235, 0.2)' },
          lineStyle: { opacity: 0 },
          symbol: 'none',
          silent: true
        },
        {
          name: timeSeriesMode === 'median' ? 'IQR Range' : '±1 Std Dev',
          type: 'line',
          data: historicalData.map(d => {
            const lower = timeSeriesMode === 'median' ? d.q1 : d.mean - d.stdDev;
            const upper = timeSeriesMode === 'median' ? d.q3 : d.mean + d.stdDev;
            return [d.date, upper - lower];
          }),
          stack: 'range',
          areaStyle: { color: 'rgba(37, 99, 235, 0.2)' },
          lineStyle: { opacity: 0 },
          symbol: 'none',
          silent: true
        },
        {
          name: timeSeriesMode === 'median' ? 'Median' : 'Mean',
          type: 'line',
          data: historicalData.map(d => [d.date, timeSeriesMode === 'median' ? d.med : d.mean]),
          lineStyle: { color: '#2563eb', width: 2 },
          symbol: 'circle',
          symbolSize: 4
        },
        {
          name: 'Maximum',
          type: 'line',
          data: historicalData.map(d => [d.date, d.max]),
          lineStyle: { color: '#dc2626', type: 'dashed', width: 1 },
          symbol: 'none'
        },
        {
          name: 'Minimum',
          type: 'line',
          data: historicalData.map(d => [d.date, d.min]),
          lineStyle: { color: '#dc2626', type: 'dashed', width: 1 },
          symbol: 'none'
        }
      ]
    };
  };

  const getHistogramOption = () => {
    if (!statSummary) return {};

    // Create histogram from current statistics
    const values = statSummary.statistics.map(s => s.statisticValue);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binCount = Math.ceil(Math.sqrt(values.length));
    const binWidth = (max - min) / binCount;
    
    const bins = [];
    const binLabels = [];
    
    for (let i = 0; i < binCount; i++) {
      const binStart = min + i * binWidth;
      const binEnd = min + (i + 1) * binWidth;
      const count = values.filter(v => v >= binStart && (i === binCount - 1 ? v <= binEnd : v < binEnd)).length;
      
      bins.push(count);
      binLabels.push(`${binStart.toFixed(statSummary.decimalPlaces)}-${binEnd.toFixed(statSummary.decimalPlaces)}`);
    }

    return {
      title: {
        text: `${statSummary.name} Distribution`,
        left: 'center',
        textStyle: { fontSize: 16 }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>Teams: ${data.value}`;
        }
      },
      xAxis: {
        type: 'category',
        data: binLabels,
        axisLabel: {
          rotate: binLabels.length > 8 ? 45 : 0,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        name: 'Number of Teams'
      },
      series: [{
        name: 'Teams',
        type: 'bar',
        data: bins,
        itemStyle: {
          color: '#2563eb',
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: '#1d4ed8'
          }
        }
      }]
    };
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
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-1">
              <div><span className="font-medium">Count:</span> {statSummary.asOfSummary.n}</div>
              <div><span className="font-medium">Mean:</span> {statSummary.asOfSummary.mean.toFixed(3)}</div>
              <div><span className="font-medium">Std Deviation:</span> {statSummary.asOfSummary.stdDev.toFixed(3)}</div>
              <div><span className="font-medium">Skewness:</span> {statSummary.asOfSummary.skewness.toFixed(3)}</div>
              <div><span className="font-medium">Kurtosis:</span> {statSummary.asOfSummary.kurtosis.toFixed(3)}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-1">
              <div><span className="font-medium">Min:</span> {statSummary.asOfSummary.min.toFixed(statSummary.decimalPlaces)}</div>
              <div><span className="font-medium">Q1:</span> {statSummary.asOfSummary.q1.toFixed(Math.max(2, statSummary.decimalPlaces))}</div>
              <div><span className="font-medium">Median:</span> {statSummary.asOfSummary.med.toFixed(Math.max(2, statSummary.decimalPlaces))}</div>
              <div><span className="font-medium">Q3:</span> {statSummary.asOfSummary.q3.toFixed(Math.max(2, statSummary.decimalPlaces))}</div>
              <div><span className="font-medium">P95:</span> {statSummary.asOfSummary.percentile95.toFixed(Math.max(2, statSummary.decimalPlaces))}</div>
              <div><span className="font-medium">P99:</span> {statSummary.asOfSummary.percentile99.toFixed(Math.max(2, statSummary.decimalPlaces))}</div>
              <div><span className="font-medium">Max:</span> {statSummary.asOfSummary.max.toFixed(statSummary.decimalPlaces)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Team Rankings List - Left Side (1/4) */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Team Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2">
              {statSummary.statistics.map((stat) => (
                <div key={stat.team.id} className="flex items-center justify-between py-1 px-2 hover:bg-muted/50 rounded-sm">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-sm font-medium min-w-[2rem]">
                      {stat.rankTieBest}.
                    </span>
                    <Image 
                      src={stat.team.logoUrl} 
                      alt={stat.team.name}
                      width={24}
                      height={24}
                      className="object-contain flex-shrink-0"
                    />
                    <span className="text-sm truncate">
                      {stat.team.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium ml-2">
                    {stat.statisticValue.toFixed(statSummary.decimalPlaces)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Area - Right Side (3/4) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Time Series Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Trend Over Time</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={timeSeriesMode === 'median' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeSeriesMode('median')}
                >
                  Median/IQR
                </Button>
                <Button
                  variant={timeSeriesMode === 'mean' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeSeriesMode('mean')}
                >
                  Mean/±1σ
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ReactECharts
                option={getTimeSeriesOption()}
                style={{ height: '400px', width: '100%' }}
                notMerge={true}
                lazyUpdate={true}
              />
            </CardContent>
          </Card>

          {/* Histogram Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactECharts
                option={getHistogramOption()}
                style={{ height: '350px', width: '100%' }}
                notMerge={true}
                lazyUpdate={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
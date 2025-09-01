'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [availableStats, setAvailableStats] = useState<string[]>([]);
  const [selectedComparisonStat, setSelectedComparisonStat] = useState<string>('');
  const [comparisonData, setComparisonData] = useState<StatSummary | null>(null);

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

  useEffect(() => {
    const fetchAvailableStats = async () => {
      try {
        const response = await apiClient.get('/stats');
        const stats = response.data.data.filter((stat: string) => {
          // Filter out the current stat from the dropdown
          return stat !== (statSummary?.key || '');
        });
        setAvailableStats(stats);
        // Set default comparison stat if not already set
        if (!selectedComparisonStat && stats.length > 0) {
          setSelectedComparisonStat(stats[0]);
        }
      } catch (error) {
        console.error('Failed to fetch available stats:', error);
      }
    };

    if (statSummary) {
      fetchAvailableStats();
    }
  }, [statSummary, selectedComparisonStat]);

  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!selectedComparisonStat) return;
      
      try {
        const response = await apiClient.get(`/stats/${selectedComparisonStat}/summary`);
        setComparisonData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch comparison data:', error);
      }
    };

    fetchComparisonData();
  }, [selectedComparisonStat]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate Pearson correlation coefficient
  const calculatePearsonCorrelation = (x: number[], y: number[]) => {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  };

  // Calculate Spearman rank correlation coefficient
  const calculateSpearmanCorrelation = (x: number[], y: number[]) => {
    if (x.length !== y.length || x.length === 0) return 0;
    
    // Convert values to ranks
    const rankX = getRanks(x);
    const rankY = getRanks(y);
    
    return calculatePearsonCorrelation(rankX, rankY);
  };

  const getRanks = (arr: number[]) => {
    const sorted = arr.map((value, index) => ({ value, index })).sort((a, b) => b.value - a.value);
    const ranks = new Array(arr.length);
    
    for (let i = 0; i < sorted.length; i++) {
      ranks[sorted[i].index] = i + 1;
    }
    
    return ranks;
  };

  const getTimeSeriesOption = () => {
    if (!statSummary || !statSummary.summaryStubs) return {};

    const historicalData = statSummary.summaryStubs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const dates = historicalData.map(d => d.date);

    // Calculate the actual data range across all series
    const allValues = historicalData.flatMap(d => [
      d.min, d.max, d.med, d.mean, d.q1, d.q3, 
      d.mean - d.stdDev, d.mean + d.stdDev
    ]);
    const dataMin = Math.min(...allValues);
    const dataMax = Math.max(...allValues);
    const range = dataMax - dataMin;
    const padding = range * 0.05; // 5% padding

    return {
      title: {
        text: `${statSummary.name} Over Time`,
        left: 'center',
        textStyle: { fontSize: 16 }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const date = new Date(params[0].axisValue).toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric' 
          });
          let tooltip = `<strong>${date}</strong><br/>`;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          params.forEach((param: any) => {
            if (param.seriesName && param.value !== undefined && !param.seriesName.includes('IQR') && !param.seriesName.includes('±1 Std Dev')) {
              const value = Array.isArray(param.value) ? param.value[1] : param.value;
              if (typeof value === 'number') {
                // Match formatting from summary panel
                let decimals = statSummary.decimalPlaces;
                if (param.seriesName === 'Mean') {
                  decimals = 3;
                } else if (param.seriesName === 'Q1' || param.seriesName === 'Q3') {
                  decimals = Math.max(2, statSummary.decimalPlaces);
                } else if (param.seriesName === 'Mean - 1σ' || param.seriesName === 'Mean + 1σ') {
                  decimals = 3; // Since these are derived from mean ± std dev, use 3 decimals
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
          timeSeriesMode === 'median' ? 'IQR' : '±1 Std Dev',
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
        name: statSummary.name,
        min: dataMin - padding,
        max: dataMax + padding,
        axisLabel: {
          formatter: (value: number) => value.toFixed(Math.max(2, statSummary.decimalPlaces))
        }
      },
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        { start: 0, end: 100, height: 30, bottom: 10 }
      ],
      series: [
        {
          name: timeSeriesMode === 'median' ? 'IQR' : '±1 Std Dev',
          type: 'custom',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          renderItem: (params: any, api: any) => {
            const categoryIndex = params.dataIndex;
            const dateValue = historicalData[categoryIndex].date;
            const lower = timeSeriesMode === 'median' 
              ? historicalData[categoryIndex].q1 
              : historicalData[categoryIndex].mean - historicalData[categoryIndex].stdDev;
            const upper = timeSeriesMode === 'median' 
              ? historicalData[categoryIndex].q3 
              : historicalData[categoryIndex].mean + historicalData[categoryIndex].stdDev;
            
            const currentPoint = api.coord([dateValue, lower]);
            const upperPoint = api.coord([dateValue, upper]);
            
            if (categoryIndex === 0) {
              return {
                type: 'rect',
                shape: {
                  x: currentPoint[0] - 10,
                  y: upperPoint[1],
                  width: 20,
                  height: currentPoint[1] - upperPoint[1]
                },
                style: {
                  fill: 'rgba(37, 99, 235, 0.2)',
                  stroke: 'transparent'
                },
                silent: true
              };
            }
            
            // Connect to previous point to create continuous band
            const prevDateValue = historicalData[categoryIndex - 1].date;
            const prevLower = timeSeriesMode === 'median' 
              ? historicalData[categoryIndex - 1].q1 
              : historicalData[categoryIndex - 1].mean - historicalData[categoryIndex - 1].stdDev;
            const prevUpper = timeSeriesMode === 'median' 
              ? historicalData[categoryIndex - 1].q3 
              : historicalData[categoryIndex - 1].mean + historicalData[categoryIndex - 1].stdDev;
            
            const prevLowerPoint = api.coord([prevDateValue, prevLower]);
            const prevUpperPoint = api.coord([prevDateValue, prevUpper]);
            
            return {
              type: 'polygon',
              shape: {
                points: [
                  [prevLowerPoint[0], prevLowerPoint[1]],
                  [prevUpperPoint[0], prevUpperPoint[1]],
                  [upperPoint[0], upperPoint[1]],
                  [currentPoint[0], currentPoint[1]]
                ]
              },
              style: {
                fill: 'rgba(37, 99, 235, 0.2)',
                stroke: 'transparent'
              },
              silent: true
            };
          },
          data: historicalData.map((_, index) => index),
          z: 1
        },
        {
          name: timeSeriesMode === 'median' ? 'Median' : 'Mean',
          type: 'line',
          data: historicalData.map(d => [d.date, timeSeriesMode === 'median' ? d.med : d.mean]),
          lineStyle: { color: '#2563eb', width: 2 },
          symbol: 'circle',
          symbolSize: 4,
          z: 3
        },
        ...(timeSeriesMode === 'median' ? [
          {
            name: 'Q1',
            type: 'line',
            data: historicalData.map(d => [d.date, d.q1]),
            lineStyle: { opacity: 0 },
            symbol: 'none',
            silent: true,
            showInLegend: false,
            z: 2
          },
          {
            name: 'Q3',
            type: 'line',
            data: historicalData.map(d => [d.date, d.q3]),
            lineStyle: { opacity: 0 },
            symbol: 'none',
            silent: true,
            showInLegend: false,
            z: 2
          }
        ] : [
          {
            name: 'Mean - 1σ',
            type: 'line',
            data: historicalData.map(d => [d.date, d.mean - d.stdDev]),
            lineStyle: { opacity: 0 },
            symbol: 'none',
            silent: true,
            showInLegend: false,
            z: 2
          },
          {
            name: 'Mean + 1σ',
            type: 'line',
            data: historicalData.map(d => [d.date, d.mean + d.stdDev]),
            lineStyle: { opacity: 0 },
            symbol: 'none',
            silent: true,
            showInLegend: false,
            z: 2
          }
        ]),
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const getValueScatterOption = () => {
    if (!statSummary || !comparisonData) return {};

    // Create data points with team colors
    const scatterData = statSummary.statistics.map(stat1 => {
      const stat2 = comparisonData.statistics.find(s => s.team.id === stat1.team.id);
      if (!stat2) return null;
      
      return {
        value: [stat1.statisticValue, stat2.statisticValue],
        itemStyle: {
          color: stat1.team.primaryColor,
          borderColor: stat1.team.secondaryColor || '#ffffff',
          borderWidth: 1
        },
        team: stat1.team,
        stat1Value: stat1.statisticValue,
        stat2Value: stat2.statisticValue
      };
    }).filter(Boolean);

    // Calculate Pearson correlation
    const xValues = scatterData.map(d => d!.value[0]);
    const yValues = scatterData.map(d => d!.value[1]);
    const correlation = calculatePearsonCorrelation(xValues, yValues);

    return {
      title: {
        text: `${statSummary.name} vs ${comparisonData.name} (Values)`,
        subtext: `Pearson Correlation: ${correlation.toFixed(3)}`,
        left: 'center',
        textStyle: { fontSize: 16 },
        subtextStyle: { fontSize: 14, color: '#666' }
      },
      tooltip: {
        trigger: 'item',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const data = params.data;
          return `<strong>${data.team.name}</strong><br/>
                  ${statSummary.name}: ${data.stat1Value.toFixed(statSummary.decimalPlaces)}<br/>
                  ${comparisonData.name}: ${data.stat2Value.toFixed(comparisonData.decimalPlaces)}`;
        }
      },
      xAxis: {
        type: 'value',
        name: statSummary.name,
        nameLocation: 'center',
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        name: comparisonData.name,
        nameLocation: 'center',
        nameGap: 40
      },
      series: [{
        type: 'scatter',
        data: scatterData,
        symbolSize: 8,
        emphasis: {
          focus: 'self',
          itemStyle: {
            borderWidth: 2
          }
        }
      }]
    };
  };

  const getRankScatterOption = () => {
    if (!statSummary || !comparisonData) return {};

    // Create data points with ranks
    const scatterData = statSummary.statistics.map(stat1 => {
      const stat2 = comparisonData.statistics.find(s => s.team.id === stat1.team.id);
      if (!stat2) return null;
      
      return {
        value: [stat1.rankTieAvg, stat2.rankTieAvg],
        itemStyle: {
          color: stat1.team.primaryColor,
          borderColor: stat1.team.secondaryColor || '#ffffff',
          borderWidth: 1
        },
        team: stat1.team,
        stat1Rank: stat1.rankTieAvg,
        stat2Rank: stat2.rankTieAvg
      };
    }).filter(Boolean);

    // Calculate Spearman correlation using ranks
    const xRanks = scatterData.map(d => d!.value[0]);
    const yRanks = scatterData.map(d => d!.value[1]);
    const spearmanCorr = calculateSpearmanCorrelation(xRanks, yRanks);

    return {
      title: {
        text: `${statSummary.name} vs ${comparisonData.name} (Ranks)`,
        subtext: `Spearman Correlation: ${spearmanCorr.toFixed(3)}`,
        left: 'center',
        textStyle: { fontSize: 16 },
        subtextStyle: { fontSize: 14, color: '#666' }
      },
      tooltip: {
        trigger: 'item',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const data = params.data;
          return `<strong>${data.team.name}</strong><br/>
                  ${statSummary.name} Rank: ${data.stat1Rank}<br/>
                  ${comparisonData.name} Rank: ${data.stat2Rank}`;
        }
      },
      xAxis: {
        type: 'value',
        name: `${statSummary.name} Rank`,
        nameLocation: 'center',
        nameGap: 30,
        inverse: true // Lower rank (better performance) on the right
      },
      yAxis: {
        type: 'value',
        name: `${comparisonData.name} Rank`,
        nameLocation: 'center',
        nameGap: 40,
        inverse: true // Lower rank (better performance) at the top
      },
      series: [{
        type: 'scatter',
        data: scatterData,
        symbolSize: 8,
        emphasis: {
          focus: 'self',
          itemStyle: {
            borderWidth: 2
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

      {/* Correlation Analysis Section */}
      {comparisonData && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex flex-row items-center justify-between">
              <CardTitle>Correlation Analysis</CardTitle>
              <Select value={selectedComparisonStat} onValueChange={setSelectedComparisonStat}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select statistic to compare" />
                </SelectTrigger>
                <SelectContent>
                  {availableStats.map((stat) => (
                    <SelectItem key={stat} value={stat}>
                      {stat.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Value Correlation Scatter Plot */}
              <div>
                <ReactECharts
                  option={getValueScatterOption()}
                  style={{ height: '400px', width: '100%' }}
                  notMerge={true}
                  lazyUpdate={true}
                />
              </div>

              {/* Rank Correlation Scatter Plot */}
              <div>
                <ReactECharts
                  option={getRankScatterOption()}
                  style={{ height: '400px', width: '100%' }}
                  notMerge={true}
                  lazyUpdate={true}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
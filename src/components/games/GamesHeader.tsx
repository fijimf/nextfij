'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface GamesHeaderProps {
  date: string; // yyyymmdd format
  season: number;
  onDateChange: (newDate: string) => void;
  isLoading?: boolean;
}

export function GamesHeader({ date, season, onDateChange, isLoading }: GamesHeaderProps) {
  // Convert yyyymmdd to yyyy-mm-dd for input
  const formatForInput = (dateStr: string) => {
    if (dateStr.length !== 8) return '';
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}-${month}-${day}`;
  };

  // Convert yyyy-mm-dd to yyyymmdd
  const formatForApi = (dateStr: string) => {
    return dateStr.replace(/-/g, '');
  };

  // Format for display
  const formatForDisplay = (dateStr: string) => {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const dateObj = new Date(`${year}-${month}-${day}`);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format season display
  const formatSeason = (seasonYear: number) => {
    const prevYear = seasonYear - 1;
    const currentYearShort = seasonYear.toString().slice(-2);
    return `${prevYear}-${currentYearShort} Season`;
  };

  const handlePreviousDay = () => {
    const year = parseInt(date.substring(0, 4));
    const month = parseInt(date.substring(4, 6)) - 1; // JS months are 0-indexed
    const day = parseInt(date.substring(6, 8));
    const dateObj = new Date(year, month, day);
    dateObj.setDate(dateObj.getDate() - 1);

    const newDate = formatForApi(dateObj.toISOString().split('T')[0]);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const year = parseInt(date.substring(0, 4));
    const month = parseInt(date.substring(4, 6)) - 1;
    const day = parseInt(date.substring(6, 8));
    const dateObj = new Date(year, month, day);
    dateObj.setDate(dateObj.getDate() + 1);

    const newDate = formatForApi(dateObj.toISOString().split('T')[0]);
    onDateChange(newDate);
  };

  const handleToday = () => {
    const today = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const [month, day, year] = today.split('/');
    const formattedDate = `${year}${month}${day}`;
    onDateChange(formattedDate);
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = formatForApi(e.target.value);
    onDateChange(newDate);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {formatForDisplay(date)}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {formatSeason(season)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousDay}
            disabled={isLoading}
            aria-label="Previous day"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            onClick={handleToday}
            disabled={isLoading}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Today
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextDay}
            disabled={isLoading}
            aria-label="Next day"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Input
            type="date"
            value={formatForInput(date)}
            onChange={handleDateInputChange}
            disabled={isLoading}
            className="w-auto"
          />
        </div>
      </div>
    </div>
  );
}

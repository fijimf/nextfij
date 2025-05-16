'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiClient } from '@/lib/api/client';

interface ScheduleStatus {
  numberOfTeams: number;
  numberOfConferences: number;
  seasons: SeasonStatus[];
}

interface SeasonStatus {
  year: number;
  numberOfTeams: number;
  numberOfConferences: number;
  numberOfGames: number;
  firstGameDate: string;
  lastGameDate: string;
  lastCompleteGameDate: string;
}

export default function AdminPage() {
  const [seasonYear, setSeasonYear] = useState<string>('');
  const [loadingTeams, setLoadingTeams] = useState<boolean>(false);
  const [loadingConferences, setLoadingConferences] = useState<boolean>(false);
  const [loadingSeason, setLoadingSeason] = useState<boolean>(false);
  const [loadingGames, setLoadingGames] = useState<boolean>(false);
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchScheduleStatus();
  }, []);

  const fetchScheduleStatus = async () => {
    setStatusLoading(true);
    try {
      const response = await apiClient.get('/schedule/admin/status');
      setScheduleStatus(response.data);
    } catch (error) {
      toast.error('Failed to fetch schedule status');
      console.error(error);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleLoadTeams = async () => {
    setLoadingTeams(true);
    try {
      const response = await apiClient.get('/schedule/admin/loadTeams');
      toast.success(`Loaded ${response.data.length} teams`);
    } catch (error) {
      toast.error('Failed to load teams');
      console.error(error);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleLoadSeason = async () => {
    if (!seasonYear) {
      toast.error('Please enter a season year');
      return;
    }
    setLoadingSeason(true);
    try {
      const response = await apiClient.get(`/schedule/admin/loadSeason?seasonYear=${seasonYear}`);
      setScheduleStatus(response.data);
      toast.success('Season loaded successfully');
    } catch (error) {
      toast.error('Failed to load season');
      console.error(error);
    } finally {
      setLoadingSeason(false);
    }
  };

  const handleLoadGames = async (seasonYear: number) => {
    if (!seasonYear ) {
      toast.error('Please select both season year');
      return;
    }
    setLoadingGames(true);
    try {
      const response = await apiClient.get(`/schedule/admin/loadGames?seasonYear=${seasonYear}`);
      toast.success(`Loaded ${response.data.length} games`);
    } catch (error) {
      toast.error('Failed to load games');
      console.error(error);
    } finally {
      setLoadingGames(false);
    }
  };

  const handleLoadConferences = async () => {
    setLoadingConferences(true);
    try {
      const response = await apiClient.get('/schedule/admin/loadConferences');
      toast.success(`Loaded ${response.data.length} conferences`);
    } catch (error) {
      toast.error('Failed to load conferences');
      console.error(error);
    } finally {
      setLoadingConferences(false);
    }
  };

  const handleDropTeams = async () => {
    setLoadingTeams(true);
    try {
      await apiClient.post('/schedule/admin/dropTeams');
      toast.success('All teams dropped successfully');
      fetchScheduleStatus();
    } catch (error) {
      toast.error('Failed to drop teams');
      console.error(error);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleDropConferences = async () => {
    setLoadingConferences(true);
    try {
      await apiClient.post('/schedule/admin/dropConferences');
      toast.success('All conferences dropped successfully');
      fetchScheduleStatus();
    } catch (error) {
      toast.error('Failed to drop conferences');
      console.error(error);
    } finally {
      setLoadingConferences(false);
    }
  };

  const handleDropSeason = async (seasonYear: number) => {
    setLoadingGames(true);
    try {
      await apiClient.post(`/schedule/admin/dropSeason?seasonYear=${seasonYear}`);
      toast.success(`Season ${seasonYear} dropped successfully`);
      fetchScheduleStatus();
    } catch (error) {
      toast.error(`Failed to drop season ${seasonYear}`);
      console.error(error);
    } finally {
      setLoadingGames(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Schedule Admin Control Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statusLoading ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="flex items-center justify-center p-6">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        ) : scheduleStatus ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Teams</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Number of Teams</p>
                    <p className="font-medium">{scheduleStatus.numberOfTeams}</p>
                  </div>
              </CardContent>
              <CardFooter className="pt-4 flex gap-2">
                <Button
                  onClick={handleLoadTeams}
                  disabled={loadingTeams || statusLoading}
                  variant="outline"
                  size="sm"
                >
                  {loadingTeams ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                      Loading...
                    </>
                  ) : (
                    'Refresh Teams'
                  )}
                </Button>
                <Button
                  onClick={handleDropTeams}
                  disabled={loadingTeams || statusLoading || scheduleStatus.seasons.length > 0}
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive hover:bg-destructive/10"
                >
                  {loadingTeams ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                      Dropping...
                    </>
                  ) : (
                    'Drop Teams'
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Conferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Number of Conferences</p>
                <p className="font-medium">{scheduleStatus.numberOfConferences}</p>
              </div>
              </CardContent>
              <CardFooter className="pt-4 flex gap-2">
                <Button
                  onClick={handleLoadConferences}
                  disabled={loadingConferences || statusLoading}
                  variant="outline"
                  size="sm"
                >
                  {loadingConferences ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                      Loading...
                    </>
                  ) : (
                    'Refresh Conferences'
                  )}
                </Button>
                <Button
                  onClick={handleDropConferences}
                  disabled={loadingConferences || statusLoading || scheduleStatus.seasons.length > 0}
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive hover:bg-destructive/10"
                >
                  {loadingConferences ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                      Dropping...
                    </>
                  ) : (
                    'Drop Conferences'
                  )}
                </Button>
              </CardFooter>
            </Card>

            {scheduleStatus.seasons.map((season) => (
              <Card key={season.year}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-medium">Season {season.year}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Games</p>
                    <p className="font-medium">{season.numberOfGames}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Last Complete</p>
                    <p className="font-medium">{new Date(season.lastCompleteGameDate).toLocaleDateString()}</p>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 flex gap-2">
                  <Button 
                    onClick={() => handleLoadGames(season.year)} 
                    disabled={loadingGames || statusLoading}
                    variant="outline"
                    size="sm"
                  >
                    {loadingGames ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                        Loading...
                      </>
                    ) : (
                      'Refresh Games'
                    )}
                  </Button>
                  <Button 
                    onClick={() => handleDropSeason(season.year)} 
                    disabled={loadingGames || statusLoading}
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive hover:bg-destructive/10"
                  >
                    {loadingGames ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                        Dropping...
                      </>
                    ) : (
                      'Drop Season'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </>
        ) : (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="flex items-center justify-center p-6">
              <p className="text-muted-foreground">No schedule status available. Click refresh above.</p>
            </CardContent>
          </Card>
        )}

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Add Season</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="seasonYearLoad" className="mb-2">Season Year</Label>
                <Input
                  id="seasonYearLoad"
                  type="number"
                  value={seasonYear}
                  onChange={(e) => setSeasonYear(e.target.value)}
                  placeholder="Enter season year (e.g., 2023)"
                />
              </div>
            
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleLoadSeason}
                  disabled={loadingSeason}
                  variant="outline"
                  className="w-full"
                >
                  {loadingSeason ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                      Adding Season...
                    </>
                  ) : (
                    'Add Season'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [loading, setLoading] = useState<boolean>(false);
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
    } finally {
      setStatusLoading(false);
    }
  };

  const handleRunModel = async () => {
    if (!seasonYear || !selectedModel) {
      toast.error('Please select both season year and model');
      return;
    }
    setLoading(true);
    try {
      await apiClient.get(`/schedule/admin/runModel?seasonYear=${seasonYear}&model=${selectedModel}`);
      toast.success('Model run successfully');
    } catch (error) {
      toast.error('Failed to run model');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadTeams = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/schedule/admin/loadTeams');
      toast.success(`Loaded ${response.data.length} teams`);
    } catch (error) {
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSeason = async () => {
    if (!seasonYear) {
      toast.error('Please enter a season year');
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.get(`/schedule/admin/loadSeason?seasonYear=${seasonYear}`);
      setScheduleStatus(response.data);
      toast.success('Season loaded successfully');
    } catch (error) {
      toast.error('Failed to load season');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadGames = async () => {
    if (!seasonYear || !selectedDate) {
      toast.error('Please select both season year and date');
      return;
    }
    setLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await apiClient.get(`/schedule/admin/loadGames?seasonYear=${seasonYear}&date=${formattedDate}`);
      toast.success(`Loaded ${response.data.length} games`);
    } catch (error) {
      toast.error('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadConferences = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/schedule/admin/loadConferences');
      toast.success(`Loaded ${response.data.length} conferences`);
    } catch (error) {
      toast.error('Failed to load conferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Control Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statusLoading ? (
          <Card className="md:col-span-2">
            <CardContent className="flex items-center justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        ) : scheduleStatus ? (
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Schedule Status</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchScheduleStatus}
                disabled={statusLoading}
              >
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Teams</p>
                    <p className="text-2xl font-bold">{scheduleStatus.numberOfTeams}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Conferences</p>
                    <p className="text-2xl font-bold">{scheduleStatus.numberOfConferences}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Seasons</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scheduleStatus.seasons.map((season) => (
                      <Card key={season.year}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Season {season.year}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Teams</p>
                              <p className="font-medium">{season.numberOfTeams}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Conferences</p>
                              <p className="font-medium">{season.numberOfConferences}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Games</p>
                              <p className="font-medium">{season.numberOfGames}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Last Complete</p>
                              <p className="font-medium">{new Date(season.lastCompleteGameDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="md:col-span-2">
            <CardContent className="flex items-center justify-center p-6">
              <p className="text-muted-foreground">No schedule status available</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Run Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="seasonYear">Season Year</Label>
                <Input
                  id="seasonYear"
                  type="number"
                  value={seasonYear}
                  onChange={(e) => setSeasonYear(e.target.value)}
                  placeholder="Enter season year"
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="model1">Model 1</SelectItem>
                    <SelectItem value="model2">Model 2</SelectItem>
                    <SelectItem value="model3">Model 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleRunModel} 
                disabled={loading}
                className="w-full"
              >
                Run Model
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Load Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={handleLoadTeams} 
                  disabled={loading}
                  variant="outline"
                >
                  Load Teams
                </Button>
                <Button 
                  onClick={handleLoadConferences} 
                  disabled={loading}
                  variant="outline"
                >
                  Load Conferences
                </Button>
                <Button 
                  onClick={handleLoadSeason} 
                  disabled={loading}
                  variant="outline"
                >
                  Load Season
                </Button>
                <Button 
                  onClick={handleLoadGames} 
                  disabled={loading}
                  variant="outline"
                >
                  Load Games
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
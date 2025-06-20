'use client';

import { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  UsersIcon, 
  ChartBarIcon, 
  BellIcon,
  CogIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PresentationChartLineIcon,
  ArrowPathIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface TeamStatus {
  numberOfTeams: number;
  teamStatus: string;
}

interface ConferenceStatus {
  numberOfConferences: number;
  conferenceStatus: string;
}

interface Season {
  year: number;
  numberOfTeams: number;
  numberOfConferences: number;
  numberOfGames: number;
  firstGameDate: string;
  lastGameDate: string;
  lastCompleteGameDate: string;
  lastUpdated: string;
}

interface ScheduleData {
  teamStatus: TeamStatus;
  conferenceStatus: ConferenceStatus;
  seasons: Season[];
}

interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newSeasonYear, setNewSeasonYear] = useState('');
  const [showDropConfirmation, setShowDropConfirmation] = useState(false);
  const [dropConfirmationType, setDropConfirmationType] = useState<'teams' | 'conferences' | 'season'>('teams');
  const [dropSeasonYear, setDropSeasonYear] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/admin/schedule/', {
        headers: {
          'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || ''}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch schedule data');
      }
      const data = await response.json();
      setScheduleData(data);
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/admin/schedule/team/load', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || ''}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server error (${response.status})`);
        } else {
          const errorText = await response.text();
          throw new Error(`Server error (${response.status}): ${errorText || response.statusText}`);
        }
      }
      
      const teamStatus: TeamStatus = await response.json();
      
      // Update the schedule data with the new team status
      setScheduleData(prev => prev ? {
        ...prev,
        teamStatus: teamStatus
      } : null);
      
      addToast('success', `Successfully loaded ${teamStatus.numberOfTeams} teams`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load teams';
      addToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDropTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/admin/schedule/team/drop', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || ''}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server error (${response.status})`);
        } else {
          const errorText = await response.text();
          throw new Error(`Server error (${response.status}): ${errorText || response.statusText}`);
        }
      }
      
      const teamStatus: TeamStatus = await response.json();
      
      // Update the schedule data with the new team status
      setScheduleData(prev => prev ? {
        ...prev,
        teamStatus: teamStatus
      } : null);
      
      addToast('success', 'Teams dropped successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to drop teams';
      addToast('error', errorMessage);
    } finally {
      setLoading(false);
      setShowDropConfirmation(false);
    }
  };

  const handleLoadConferences = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/admin/schedule/conference/load', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || ''}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server error (${response.status})`);
        } else {
          const errorText = await response.text();
          throw new Error(`Server error (${response.status}): ${errorText || response.statusText}`);
        }
      }
      
      const conferenceStatus: ConferenceStatus = await response.json();
      
      // Update the schedule data with the new conference status
      setScheduleData(prev => prev ? {
        ...prev,
        conferenceStatus: conferenceStatus
      } : null);
      
      addToast('success', `Successfully loaded ${conferenceStatus.numberOfConferences} conferences`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conferences';
      addToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDropConferences = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/admin/schedule/conference/drop', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || ''}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server error (${response.status})`);
        } else {
          const errorText = await response.text();
          throw new Error(`Server error (${response.status}): ${errorText || response.statusText}`);
        }
      }
      
      const conferenceStatus: ConferenceStatus = await response.json();
      
      // Update the schedule data with the new conference status
      setScheduleData(prev => prev ? {
        ...prev,
        conferenceStatus: conferenceStatus
      } : null);
      
      addToast('success', 'Conferences dropped successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to drop conferences';
      addToast('error', errorMessage);
    } finally {
      setLoading(false);
      setShowDropConfirmation(false);
    }
  };

  const handleCreateSeason = async () => {
    if (newSeasonYear) {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/admin/schedule/season/new?seasonYear=${newSeasonYear}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || ''}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error (${response.status})`);
          } else {
            const errorText = await response.text();
            throw new Error(`Server error (${response.status}): ${errorText || response.statusText}`);
          }
        }
        
        const scheduleData: ScheduleData = await response.json();
        setScheduleData(scheduleData);
        
        addToast('success', `Successfully created season ${newSeasonYear}`);
        setNewSeasonYear('');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create season';
        addToast('error', errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSeasonAction = async (action: 'reload' | 'refresh' | 'drop', year: number) => {
    if (action === 'drop') {
      setDropConfirmationType('season');
      setDropSeasonYear(year);
      setShowDropConfirmation(true);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/admin/schedule/season/refresh/${year}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || ''}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server error (${response.status})`);
        } else {
          const errorText = await response.text();
          throw new Error(`Server error (${response.status}): ${errorText || response.statusText}`);
        }
      }
      
      const scheduleData: ScheduleData = await response.json();
      setScheduleData(scheduleData);
      
      addToast('success', `Successfully refreshed season ${year}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to refresh season ${year}`;
      addToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDropSeason = async () => {
    if (!dropSeasonYear) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/admin/schedule/season/drop/${dropSeasonYear}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || ''}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server error (${response.status})`);
        } else {
          const errorText = await response.text();
          throw new Error(`Server error (${response.status}): ${errorText || response.statusText}`);
        }
      }
      
      const scheduleData: ScheduleData = await response.json();
      setScheduleData(scheduleData);
      
      addToast('success', `Successfully dropped season ${dropSeasonYear}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to drop season ${dropSeasonYear}`;
      addToast('error', errorMessage);
    } finally {
      setLoading(false);
      setShowDropConfirmation(false);
      setDropSeasonYear(null);
    }
  };

  const handleDropFromConfirmation = async () => {
    if (dropConfirmationType === 'teams') {
      await handleDropTeams();
    } else if (dropConfirmationType === 'conferences') {
      await handleDropConferences();
    } else if (dropConfirmationType === 'season') {
      await handleDropSeason();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const stats = [
    { name: 'Total Users', value: '2,543', icon: UsersIcon, change: '+12%' },
    { name: 'Active Models', value: '156', icon: DocumentTextIcon, change: '+8%' },
    { name: 'Scheduled Events', value: '89', icon: CalendarIcon, change: '+23%' },
    { name: 'Model Accuracy', value: '94.2%', icon: PresentationChartLineIcon, change: '+4%' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'schedule':
        return (
          <div className="space-y-6">
            {/* Toast Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className={`flex items-center p-4 rounded-md shadow-lg max-w-sm ${
                    toast.type === 'success' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {toast.type === 'success' ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-400" />
                    ) : (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      toast.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {toast.message}
                    </p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => removeToast(toast.id)}
                      className={`inline-flex rounded-md p-1.5 ${
                        toast.type === 'success' 
                          ? 'bg-green-50 text-green-500 hover:bg-green-100' 
                          : 'bg-red-50 text-red-500 hover:bg-red-100'
                      }`}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Teams Section */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Teams</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {scheduleData?.teamStatus.numberOfTeams || 0} teams loaded
                  </p>
                  {scheduleData?.teamStatus.teamStatus && (
                    <p className="mt-1 text-sm text-amber-600">
                      {scheduleData.teamStatus.teamStatus}
                    </p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleLoadTeams}
                    disabled={loading}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                  >
                    <ArrowPathIcon className="mr-2 h-4 w-4" />
                    {scheduleData?.teamStatus.numberOfTeams === 0 ? 'Load' : 'Reload'}
                  </button>
                  <button
                    onClick={() => {
                      setDropConfirmationType('teams');
                      setShowDropConfirmation(true);
                    }}
                    disabled={loading}
                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Drop
                  </button>
                </div>
              </div>
            </div>

            {/* Drop Confirmation Modal */}
            {showDropConfirmation && (
              <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <div className="mt-3 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mt-4">
                      Confirm Drop {dropConfirmationType === 'teams' ? 'Teams' : dropConfirmationType === 'conferences' ? 'Conferences' : `Season ${dropSeasonYear}`}
                    </h3>
                    <div className="mt-2 px-7 py-3">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to drop all {dropConfirmationType === 'teams' ? 'teams' : dropConfirmationType === 'conferences' ? 'conferences' : `season ${dropSeasonYear}`}? This action cannot be undone.
                      </p>
                    </div>
                    <div className="items-center px-4 py-3">
                      <button
                        onClick={handleDropFromConfirmation}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-700 disabled:opacity-50"
                      >
                        {loading ? 'Dropping...' : 'Drop'}
                      </button>
                      <button
                        onClick={() => setShowDropConfirmation(false)}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-24 hover:bg-gray-400 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conferences Section */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Conferences</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {scheduleData?.conferenceStatus.numberOfConferences || 0} conferences loaded
                  </p>
                  {scheduleData?.conferenceStatus.conferenceStatus && (
                    <p className="mt-1 text-sm text-amber-600">
                      {scheduleData.conferenceStatus.conferenceStatus}
                    </p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleLoadConferences}
                    disabled={loading}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                  >
                    <ArrowPathIcon className="mr-2 h-4 w-4" />
                    {scheduleData?.conferenceStatus.numberOfConferences === 0 ? 'Load' : 'Reload'}
                  </button>
                  <button
                    onClick={() => {
                      setDropConfirmationType('conferences');
                      setShowDropConfirmation(true);
                    }}
                    disabled={loading}
                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Drop
                  </button>
                </div>
              </div>
            </div>

            {/* Seasons Section */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900">Seasons</h2>
                <div className="mt-4 flex items-center space-x-4">
                  <input
                    type="number"
                    value={newSeasonYear}
                    onChange={(e) => setNewSeasonYear(e.target.value)}
                    placeholder="Enter year"
                    className="block w-32 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    onClick={handleCreateSeason}
                    disabled={loading}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create New Season
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <div className="flow-root">
                  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Year</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Teams</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Conferences</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Games</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">First Game</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Game</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {scheduleData?.seasons.map((season) => (
                            <tr key={season.year}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{season.year}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{season.numberOfTeams}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{season.numberOfConferences}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{season.numberOfGames}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{season.firstGameDate}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{season.lastGameDate}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(season.lastUpdated)}</td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleSeasonAction('reload', season.year)}
                                    disabled={loading}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                                  >
                                    <ArrowPathIcon className="mr-1 h-4 w-4" />
                                    Reload
                                  </button>
                                  <button
                                    onClick={() => handleSeasonAction('refresh', season.year)}
                                    disabled={loading}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                                  >
                                    <ArrowPathIcon className="mr-1 h-4 w-4" />
                                    Refresh
                                  </button>
                                  <button
                                    onClick={() => handleSeasonAction('drop', season.year)}
                                    disabled={loading}
                                    className="inline-flex items-center rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
                                  >
                                    <TrashIcon className="mr-1 h-4 w-4" />
                                    Drop
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'statistics':
        return (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Statistics & Analytics</h2>
            <p className="mt-2 text-sm text-gray-500">
              View detailed analytics, performance metrics, and system statistics.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium text-gray-900">Performance Metrics</h3>
                <p className="mt-1 text-sm text-gray-500">View system performance and resource utilization</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium text-gray-900">Usage Analytics</h3>
                <p className="mt-1 text-sm text-gray-500">Track user engagement and system usage patterns</p>
              </div>
            </div>
          </div>
        );
      case 'models':
        return (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Model Management</h2>
            <p className="mt-2 text-sm text-gray-500">
              Manage AI models, view training status, and monitor model performance.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium text-gray-900">Active Models</h3>
                <p className="mt-1 text-sm text-gray-500">View and manage currently deployed models</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium text-gray-900">Training Queue</h3>
                <p className="mt-1 text-sm text-gray-500">Monitor model training progress</p>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">User Management</h2>
            <p className="mt-2 text-sm text-gray-500">
              Manage user accounts, permissions, and access levels.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium text-gray-900">User Directory</h3>
                <p className="mt-1 text-sm text-gray-500">View and manage user accounts</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium text-gray-900">Access Control</h3>
                <p className="mt-1 text-sm text-gray-500">Manage user permissions and roles</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500">
                <BellIcon className="h-6 w-6" />
              </button>
              <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500">
                <CogIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  {stat.change}
                </p>
              </dd>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {['schedule', 'statistics', 'models', 'users'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
                    ${activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
} 
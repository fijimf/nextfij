'use client';

import { useState } from 'react';
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
  PlusIcon
} from '@heroicons/react/24/outline';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [teamsCount, setTeamsCount] = useState(0);
  const [conferencesCount, setConferencesCount] = useState(0);
  const [seasons, setSeasons] = useState([
    { year: 2024, teams: 130, conferences: 10, games: 780, lastUpdated: '2024-03-14 15:30:00' },
    { year: 2023, teams: 130, conferences: 10, games: 780, lastUpdated: '2023-12-01 14:20:00' },
  ]);
  const [newSeasonYear, setNewSeasonYear] = useState('');

  const handleLoadTeams = () => {
    // TODO: Implement team loading logic
    setTeamsCount(prev => prev === 0 ? 130 : prev);
  };

  const handleDropTeams = () => {
    // TODO: Implement team dropping logic
    setTeamsCount(0);
  };

  const handleLoadConferences = () => {
    // TODO: Implement conference loading logic
    setConferencesCount(prev => prev === 0 ? 10 : prev);
  };

  const handleDropConferences = () => {
    // TODO: Implement conference dropping logic
    setConferencesCount(0);
  };

  const handleCreateSeason = () => {
    if (newSeasonYear) {
      const newSeason = {
        year: parseInt(newSeasonYear),
        teams: 0,
        conferences: 0,
        games: 0,
        lastUpdated: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      setSeasons(prev => [newSeason, ...prev]);
      setNewSeasonYear('');
    }
  };

  const handleSeasonAction = (action: 'reload' | 'refresh' | 'drop', year: number) => {
    // TODO: Implement season action logic
    console.log(`Season ${year} ${action} action triggered`);
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
            {/* Teams Section */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Teams</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {teamsCount} teams loaded
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleLoadTeams}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    <ArrowPathIcon className="mr-2 h-4 w-4" />
                    {teamsCount === 0 ? 'Load' : 'Reload'}
                  </button>
                  <button
                    onClick={handleDropTeams}
                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Drop
                  </button>
                </div>
              </div>
            </div>

            {/* Conferences Section */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Conferences</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {conferencesCount} conferences loaded
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleLoadConferences}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    <ArrowPathIcon className="mr-2 h-4 w-4" />
                    {conferencesCount === 0 ? 'Load' : 'Reload'}
                  </button>
                  <button
                    onClick={handleDropConferences}
                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
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
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
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
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {seasons.map((season) => (
                            <tr key={season.year}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{season.year}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{season.teams}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{season.conferences}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{season.games}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{season.lastUpdated}</td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleSeasonAction('reload', season.year)}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                  >
                                    <ArrowPathIcon className="mr-1 h-4 w-4" />
                                    Reload
                                  </button>
                                  <button
                                    onClick={() => handleSeasonAction('refresh', season.year)}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                  >
                                    <ArrowPathIcon className="mr-1 h-4 w-4" />
                                    Refresh
                                  </button>
                                  <button
                                    onClick={() => handleSeasonAction('drop', season.year)}
                                    className="inline-flex items-center rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
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
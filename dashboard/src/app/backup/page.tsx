'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ServerStackIcon,
  ClockIcon,
  PlayIcon,
  StopIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

const backupSchedules = [
  {
    id: 'daily_full',
    name: 'Daily Full Backup',
    type: 'full',
    cronExpression: '0 2 * * *',
    enabled: true,
    lastRun: '2024-01-15T02:00:00Z',
    nextRun: '2024-01-16T02:00:00Z',
    status: 'completed',
  },
  {
    id: 'hourly_incremental',
    name: 'Hourly Incremental',
    type: 'incremental',
    cronExpression: '0 * * * *',
    enabled: true,
    lastRun: '2024-01-15T10:00:00Z',
    nextRun: '2024-01-15T11:00:00Z',
    status: 'completed',
  },
  {
    id: 'weekly_files',
    name: 'Weekly File Backup',
    type: 'files',
    cronExpression: '0 3 * * 0',
    enabled: false,
    lastRun: '2024-01-14T03:00:00Z',
    nextRun: '2024-01-21T03:00:00Z',
    status: 'completed',
  },
]

const recentBackups = [
  {
    id: 'backup_123',
    type: 'full',
    size: 256000000,
    status: 'completed',
    createdAt: '2024-01-15T02:00:00Z',
    duration: 180,
    path: '/backups/database/backup_123.sql',
  },
  {
    id: 'backup_122',
    type: 'incremental',
    size: 12000000,
    status: 'completed',
    createdAt: '2024-01-15T10:00:00Z',
    duration: 45,
    path: '/backups/database/backup_122.sql',
  },
  {
    id: 'backup_121',
    type: 'files',
    size: 89000000,
    status: 'failed',
    createdAt: '2024-01-15T08:30:00Z',
    duration: 120,
    path: '/backups/files/files_backup_121.tar.gz',
    error: 'Storage space insufficient',
  },
]

export default function BackupPage() {
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'schedules' | 'history' | 'settings'>('dashboard')
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      case 'running':
        return <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'failed':
        return 'text-red-600 dark:text-red-400'
      case 'running':
        return 'text-blue-600 dark:text-blue-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Backup & Recovery
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Automated backup system với point-in-time recovery
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: ServerStackIcon },
            { id: 'schedules', name: 'Schedules', icon: ClockIcon },
            { id: 'history', name: 'History', icon: ArrowDownTrayIcon },
            { id: 'settings', name: 'Settings', icon: ServerStackIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                selectedTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {selectedTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setIsCreatingBackup(true)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <ServerStackIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Create Full Backup
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Complete database backup
                  </p>
                </div>
              </div>
            </button>

            <button className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Incremental Backup
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Changes since last backup
                  </p>
                </div>
              </div>
            </button>

            <button className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <ArrowDownTrayIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Point-in-Time Recovery
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Restore to specific time
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Backup Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Backups
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    1,247
                  </p>
                </div>
                <ServerStackIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Storage Used
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    2.4 GB
                  </p>
                </div>
                <ServerStackIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    99.2%
                  </p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Last Backup
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    2h ago
                  </p>
                </div>
                <ClockIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* Recent Backups */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Recent Backups
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentBackups.map((backup) => (
                <div key={backup.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(backup.status)}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {backup.id} ({backup.type})
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(backup.size)} • {formatDuration(backup.duration)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm font-medium ${getStatusColor(backup.status)}`}>
                        {backup.status}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(backup.createdAt).toLocaleString('vi-VN')}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  {backup.error && (
                    <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Error: {backup.error}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Schedules Tab */}
      {selectedTab === 'schedules' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Backup Schedules
            </h2>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              <PlayIcon className="h-4 w-4 mr-2" />
              Add Schedule
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-6 gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                <span>Name</span>
                <span>Type</span>
                <span>Schedule</span>
                <span>Last Run</span>
                <span>Next Run</span>
                <span>Status</span>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {backupSchedules.map((schedule) => (
                <div key={schedule.id} className="px-6 py-4">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {schedule.name}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        schedule.type === 'full'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : schedule.type === 'incremental'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                      }`}>
                        {schedule.type}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {schedule.cronExpression}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(schedule.lastRun).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(schedule.nextRun).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className={`p-1 rounded-full ${
                          schedule.enabled
                            ? 'text-green-600 hover:text-green-800'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {schedule.enabled ? <PlayIcon className="h-4 w-4" /> : <StopIcon className="h-4 w-4" />}
                      </button>
                      <span className={`text-sm font-medium ${
                        schedule.status === 'completed'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {schedule.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {selectedTab === 'history' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Backup History
            </h2>
            <div className="flex space-x-2">
              <select className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm">
                <option>All Types</option>
                <option>Full</option>
                <option>Incremental</option>
                <option>Files</option>
              </select>
              <select className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm">
                <option>All Status</option>
                <option>Completed</option>
                <option>Failed</option>
                <option>Running</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Backup ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentBackups.map((backup) => (
                    <tr key={backup.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {backup.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          backup.type === 'full'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : backup.type === 'incremental'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                        }`}>
                          {backup.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(backup.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDuration(backup.duration)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(backup.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                          {getStatusIcon(backup.status)}
                          <span className="ml-1">{backup.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                          Download
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {selectedTab === 'settings' && (
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Backup Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                Storage Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Backup Directory
                  </label>
                  <input
                    type="text"
                    defaultValue="/backups"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Retention Period (days)
                  </label>
                  <input
                    type="number"
                    defaultValue="30"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Backup Size (GB)
                  </label>
                  <input
                    type="number"
                    defaultValue="10"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                Backup Options
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="compression"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="compression" className="ml-2 block text-sm text-gray-900 dark:text-white">
                    Enable Compression
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="encryption"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="encryption" className="ml-2 block text-sm text-gray-900 dark:text-white">
                    Enable Encryption
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="verification"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="verification" className="ml-2 block text-sm text-gray-900 dark:text-white">
                    Verify Backups After Creation
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="notifications"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900 dark:text-white">
                    Send Email Notifications
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Save Settings
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CogIcon,
  ServerIcon,
  DatabaseIcon,
  CpuChipIcon,
  MemoryIcon,
  HardDriveIcon,
  NetworkIcon,
  GlobeAltIcon,
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

const systemInfo = {
  hostname: 'audiotailoc-prod-01',
  os: 'Ubuntu 22.04.3 LTS',
  kernel: '5.15.0-91-generic',
  uptime: '7 days, 14 hours, 32 minutes',
  loadAverage: [1.25, 1.18, 1.05],
}

const services = [
  {
    name: 'nginx',
    status: 'running',
    description: 'Web Server',
    port: 80,
    uptime: '7 days',
    memory: '45MB',
    cpu: '0.5%',
  },
  {
    name: 'postgresql',
    status: 'running',
    description: 'Database Server',
    port: 5432,
    uptime: '7 days',
    memory: '128MB',
    cpu: '2.1%',
  },
  {
    name: 'redis',
    status: 'running',
    description: 'Cache Server',
    port: 6379,
    uptime: '7 days',
    memory: '23MB',
    cpu: '0.8%',
  },
  {
    name: 'node',
    status: 'running',
    description: 'Application Server',
    port: 3001,
    uptime: '7 days',
    memory: '256MB',
    cpu: '15.2%',
  },
  {
    name: 'docker',
    status: 'running',
    description: 'Container Runtime',
    port: null,
    uptime: '7 days',
    memory: '89MB',
    cpu: '1.2%',
  },
]

const systemMetrics = {
  cpuUsage: 42,
  memoryUsage: 63,
  diskUsage: 28,
  networkIn: 1250,
  networkOut: 890,
  temperature: 58,
}

export default function SystemPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'metrics' | 'logs'>('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-600 dark:text-green-400'
      case 'stopped':
        return 'text-red-600 dark:text-red-400'
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'stopped':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <CogIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const tabs = [
    { id: 'overview', name: 'Tổng quan', icon: ServerIcon },
    { id: 'services', name: 'Dịch vụ', icon: CogIcon },
    { id: 'metrics', name: 'Metrics', icon: CpuChipIcon },
    { id: 'logs', name: 'Logs', icon: DatabaseIcon },
  ]

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
          Quản lý hệ thống
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Giám sát và quản lý hệ thống, dịch vụ và tài nguyên
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Thông tin hệ thống
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Hostname</label>
                <p className="text-sm text-gray-900 dark:text-white">{systemInfo.hostname}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Operating System</label>
                <p className="text-sm text-gray-900 dark:text-white">{systemInfo.os}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Kernel</label>
                <p className="text-sm text-gray-900 dark:text-white">{systemInfo.kernel}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</label>
                <p className="text-sm text-gray-900 dark:text-white">{systemInfo.uptime}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Load Average</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {systemInfo.loadAverage.join(', ')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 dark:text-green-400">Healthy</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CPU Usage</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {systemMetrics.cpuUsage}%
                  </p>
                </div>
                <CpuChipIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemMetrics.cpuUsage}%` }}
                ></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Memory Usage</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {systemMetrics.memoryUsage}%
                  </p>
                </div>
                <MemoryIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemMetrics.memoryUsage}%` }}
                ></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Disk Usage</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {systemMetrics.diskUsage}%
                  </p>
                </div>
                <HardDriveIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemMetrics.diskUsage}%` }}
                ></div>
              </div>
            </motion.div>
          </div>

          {/* Network Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Network Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <NetworkIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatBytes(systemMetrics.networkIn * 1024)}/s
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Network In</div>
              </div>
              <div className="text-center">
                <NetworkIcon className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatBytes(systemMetrics.networkOut * 1024)}/s
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Network Out</div>
              </div>
              <div className="text-center">
                <GlobeAltIcon className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {systemMetrics.temperature}°C
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">System Temp</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              System Services
            </h2>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh Status
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Port
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Uptime
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Memory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      CPU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {services.map((service) => (
                    <tr key={service.name} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {service.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {service.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(service.status)}
                          <span className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {service.port || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {service.uptime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {service.memory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {service.cpu}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                            <PlayIcon className="h-5 w-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            <StopIcon className="h-5 w-5" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            <ArrowPathIcon className="h-5 w-5" />
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
      )}

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Detailed System Metrics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                CPU Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Model</span>
                  <span className="text-sm text-gray-900 dark:text-white">Intel Xeon E5-2680 v4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cores</span>
                  <span className="text-sm text-gray-900 dark:text-white">8 cores / 16 threads</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Frequency</span>
                  <span className="text-sm text-gray-900 dark:text-white">2.40 GHz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cache</span>
                  <span className="text-sm text-gray-900 dark:text-white">L1: 512KB, L2: 2MB, L3: 20MB</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                Memory Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                  <span className="text-sm text-gray-900 dark:text-white">32 GB DDR4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Used</span>
                  <span className="text-sm text-gray-900 dark:text-white">20.2 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                  <span className="text-sm text-gray-900 dark:text-white">11.8 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Speed</span>
                  <span className="text-sm text-gray-900 dark:text-white">2133 MHz</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                Storage Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                  <span className="text-sm text-gray-900 dark:text-white">1 TB SSD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Used</span>
                  <span className="text-sm text-gray-900 dark:text-white">280 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                  <span className="text-sm text-gray-900 dark:text-white">720 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Read Speed</span>
                  <span className="text-sm text-gray-900 dark:text-white">560 MB/s</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                Network Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Interface</span>
                  <span className="text-sm text-gray-900 dark:text-white">eth0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">IP Address</span>
                  <span className="text-sm text-gray-900 dark:text-white">192.168.1.100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Gateway</span>
                  <span className="text-sm text-gray-900 dark:text-white">192.168.1.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">DNS</span>
                  <span className="text-sm text-gray-900 dark:text-white">8.8.8.8, 8.8.4.4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            System Logs
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white">
                Recent System Logs
              </h3>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1">
                  <option>All Levels</option>
                  <option>ERROR</option>
                  <option>WARN</option>
                  <option>INFO</option>
                  <option>DEBUG</option>
                </select>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1">
                  <option>All Services</option>
                  <option>nginx</option>
                  <option>postgresql</option>
                  <option>redis</option>
                  <option>node</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-green-400 whitespace-pre-wrap">
{`[2024-01-15 14:30:15] INFO  nginx: 192.168.1.100 - GET /api/v2/products HTTP/1.1 200
[2024-01-15 14:30:12] INFO  node: Application started successfully on port 3001
[2024-01-15 14:30:10] INFO  postgresql: database system is ready to accept connections
[2024-01-15 14:30:08] INFO  redis: Server started, Redis version 7.2.1
[2024-01-15 14:30:05] INFO  nginx: nginx/1.24.0 started
[2024-01-15 14:29:58] WARN  node: High memory usage detected: 78%
[2024-01-15 14:29:45] INFO  node: Database connection established
[2024-01-15 14:29:42] INFO  node: Redis connection established
[2024-01-15 14:29:38] INFO  node: Environment: production
[2024-01-15 14:29:35] INFO  node: Starting Audio Tài Lộc API v2.0.0`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

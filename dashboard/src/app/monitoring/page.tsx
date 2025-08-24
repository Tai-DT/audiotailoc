'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  ChartBarIcon,
  CpuChipIcon,
  ServerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import PerformanceChart from '@/components/dashboard/PerformanceChart'
import SystemHealth from '@/components/dashboard/SystemHealth'

export default function MonitoringPage() {
  const [activeTab, setActiveTab] = useState<'performance' | 'health' | 'metrics' | 'realtime'>('performance')

  const tabs = [
    { id: 'performance', name: 'Performance', icon: ChartBarIcon },
    { id: 'health', name: 'Health Checks', icon: CheckCircleIcon },
    { id: 'metrics', name: 'Metrics', icon: CpuChipIcon },
    { id: 'realtime', name: 'Real-time', icon: ServerIcon },
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
          System Monitoring
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Real-time system performance and health monitoring
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

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                System Performance
              </h3>
              <PerformanceChart />
            </div>

            <div className="space-y-6">
              <SystemHealth />

              {/* Current Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Current Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">45%</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">CPU Usage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">62%</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Memory Usage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">145ms</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">89</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Active Connections</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Checks Tab */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Database</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PostgreSQL</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  Healthy
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Uptime</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Redis</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cache & Session</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  Healthy
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">99.7%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Uptime</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">API</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Main Services</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  Healthy
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">99.5%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Uptime</div>
              </div>
            </div>
          </div>

          {/* Health History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Health Check History
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { service: 'Database', status: 'healthy', time: '2024-01-15T10:30:00Z' },
                  { service: 'Redis', status: 'healthy', time: '2024-01-15T10:29:00Z' },
                  { service: 'API', status: 'healthy', time: '2024-01-15T10:28:00Z' },
                  { service: 'Backup', status: 'warning', time: '2024-01-15T10:27:00Z', message: 'High disk usage' },
                ].map((check, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      {check.status === 'healthy' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{check.service}</p>
                        {check.message && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{check.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(check.time).toLocaleString('vi-VN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">+12% from last hour</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">145ms</p>
                </div>
                <ClockIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="mt-2 text-sm text-red-600 dark:text-red-400">+5ms from last hour</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Error Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0.2%</p>
                </div>
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">-0.1% from last hour</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sessions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
                </div>
                <ServerIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">+8 from last hour</div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Detailed Metrics
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">HTTP Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">GET Requests</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">892</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">POST Requests</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">245</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">PUT Requests</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">67</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">DELETE Requests</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">43</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Response Codes</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600 dark:text-green-400">200 OK</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">1,189</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-600 dark:text-blue-400">201 Created</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-600 dark:text-yellow-400">400 Bad Request</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-red-600 dark:text-red-400">500 Internal Error</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Tab */}
      {activeTab === 'realtime' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Real-time Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-900 dark:text-white">API Request: GET /api/v2/products</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">2 seconds ago</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-900 dark:text-white">User Login: admin@audiotailoc.com</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">5 seconds ago</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-900 dark:text-white">Database Query: SELECT * FROM orders</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">8 seconds ago</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-900 dark:text-white">Cache Hit: products:list</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">12 seconds ago</span>
              </div>
            </div>
          </div>

          {/* WebSocket Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">WebSocket Status</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">Connected</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Connections</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">15</p>
                </div>
                <ServerIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Messages/Second</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">23.4</p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

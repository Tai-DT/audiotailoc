'use client'

import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ServerIcon,
  DatabaseIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline'
import { useDashboard } from '@/contexts/DashboardContext'

export default function SystemHealth() {
  const { systemHealth } = useDashboard()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 dark:text-green-400'
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getServiceStatusColor = (status: 'up' | 'down' | 'degraded') => {
    switch (status) {
      case 'up':
        return 'text-green-600 dark:text-green-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      case 'degraded':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getServiceStatusIcon = (status: 'up' | 'down' | 'degraded') => {
    switch (status) {
      case 'up':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'down':
        return <XCircleIcon className="h-4 w-4 text-red-500" />
      case 'degraded':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  const services = [
    {
      name: 'Database',
      status: systemHealth.services.database,
      icon: DatabaseIcon,
      description: 'PostgreSQL database connection',
    },
    {
      name: 'Redis',
      status: systemHealth.services.redis,
      icon: ServerIcon,
      description: 'Redis cache and session store',
    },
    {
      name: 'API',
      status: systemHealth.services.api,
      icon: CpuChipIcon,
      description: 'Main API services',
    },
    {
      name: 'Backup',
      status: systemHealth.services.backup,
      icon: ServerIcon,
      description: 'Automated backup system',
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            System Health
          </h3>
          <div className="flex items-center space-x-2">
            {getStatusIcon(systemHealth.status)}
            <span className={`text-sm font-medium ${getStatusColor(systemHealth.status)}`}>
              {systemHealth.status === 'healthy' ? 'Tất cả ổn' :
               systemHealth.status === 'warning' ? 'Cần chú ý' :
               'Có vấn đề'}
            </span>
          </div>
        </div>

        {/* Overall Status */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
              <ClockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {formatUptime(systemHealth.uptime)}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Last Check</span>
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-sm text-gray-900 dark:text-white mt-2">
              {new Date(systemHealth.lastHealthCheck).toLocaleString('vi-VN')}
            </div>
          </div>
        </div>

        {/* Services Status */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Service Status
          </h4>
          <div className="space-y-3">
            {services.map((service) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <service.icon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {service.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {getServiceStatusIcon(service.status)}
                  <span className={`text-sm font-medium ${getServiceStatusColor(service.status)}`}>
                    {service.status === 'up' ? 'Online' :
                     service.status === 'down' ? 'Offline' :
                     'Degraded'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Issues Section */}
        {systemHealth.issues.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Current Issues
            </h4>
            <div className="space-y-2">
              {systemHealth.issues.map((issue, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                >
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-yellow-800 dark:text-yellow-200">
                    {issue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1.5 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors">
              Run Health Check
            </button>
            <button className="px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
              View Logs
            </button>
            <button className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
              Restart Services
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

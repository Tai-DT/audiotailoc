'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSystemHealth, useSystemMetrics, useDashboardStats } from '@/src/hooks/useApi'
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  BeakerIcon,
  ServerIcon,
  CpuChipIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<any[]>([])

  // Test API endpoints
  const healthQuery = useSystemHealth()
  const metricsQuery = useSystemMetrics()
  const statsQuery = useDashboardStats()

  const runApiTest = async () => {
    const results = []

    // Test 1: System Health
    try {
      const healthResponse = await fetch('/api/v2/shutdown/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      results.push({
        test: 'System Health Check',
        endpoint: '/api/v2/shutdown/health',
        status: healthResponse.ok ? 'success' : 'error',
        statusCode: healthResponse.status,
        response: healthResponse.ok ? await healthResponse.json() : await healthResponse.text(),
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      results.push({
        test: 'System Health Check',
        endpoint: '/api/v2/shutdown/health',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }

    // Test 2: System Metrics
    try {
      const metricsResponse = await fetch('/api/v2/monitoring/metrics', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      results.push({
        test: 'System Metrics',
        endpoint: '/api/v2/monitoring/metrics',
        status: metricsResponse.ok ? 'success' : 'error',
        statusCode: metricsResponse.status,
        response: metricsResponse.ok ? await metricsResponse.json() : await metricsResponse.text(),
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      results.push({
        test: 'System Metrics',
        endpoint: '/api/v2/monitoring/metrics',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }

    // Test 3: API Documentation
    try {
      const docsResponse = await fetch('/api/v2/docs', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      results.push({
        test: 'API Documentation',
        endpoint: '/api/v2/docs',
        status: docsResponse.ok ? 'success' : 'error',
        statusCode: docsResponse.status,
        response: docsResponse.ok ? 'API docs available' : await docsResponse.text(),
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      results.push({
        test: 'API Documentation',
        endpoint: '/api/v2/docs',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }

    setTestResults(results)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ArrowPathIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
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
          API Integration Test
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Test connectivity giữa Dashboard và Backend API
        </p>
      </div>

      {/* API Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Health</p>
              <p className={`text-lg font-semibold ${healthQuery.isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {healthQuery.isLoading ? 'Loading...' : healthQuery.isSuccess ? 'Healthy' : 'Error'}
              </p>
            </div>
            <ServerIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Metrics</p>
              <p className={`text-lg font-semibold ${metricsQuery.isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {metricsQuery.isLoading ? 'Loading...' : metricsQuery.isSuccess ? 'Available' : 'Error'}
              </p>
            </div>
            <CpuChipIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dashboard Stats</p>
              <p className={`text-lg font-semibold ${statsQuery.isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {statsQuery.isLoading ? 'Loading...' : statsQuery.isSuccess ? 'Ready' : 'Error'}
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* Test Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            API Connectivity Test
          </h2>
          <button
            onClick={runApiTest}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <BeakerIcon className="h-4 w-4 mr-2" />
            Run Tests
          </button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-white">
              Test Results
            </h3>

            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {result.test}
                        </h4>
                        <span className={`text-xs font-medium ${getStatusColor(result.status)}`}>
                          {result.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {result.endpoint}
                      </p>

                      {result.statusCode && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Status Code: {result.statusCode}
                        </p>
                      )}

                      {result.error && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                          Error: {result.error}
                        </p>
                      )}

                      {result.response && (
                        <pre className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded mt-2 overflow-x-auto">
                          {typeof result.response === 'string'
                            ? result.response
                            : JSON.stringify(result.response, null, 2)
                          }
                        </pre>
                      )}

                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(result.timestamp).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {testResults.length === 0 && (
          <div className="text-center py-8">
            <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Chưa có kết quả test
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Nhấn &quot;Run Tests&quot; để kiểm tra kết nối API
            </p>
          </div>
        )}
      </div>

      {/* API Endpoints Reference */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          API Endpoints Reference
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              System APIs
            </h3>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>GET /api/v2/shutdown/health - System health</li>
              <li>GET /api/v2/monitoring/metrics - System metrics</li>
              <li>GET /api/v2/logs - System logs</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Management APIs
            </h3>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>GET /api/v2/users - User management</li>
              <li>GET /api/v2/products - Product management</li>
              <li>GET /api/v2/orders - Order management</li>
              <li>GET /api/v2/backup/info - Backup management</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Configuration Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="font-medium text-gray-900 dark:text-white">API Base URL</label>
            <p className="text-gray-600 dark:text-gray-400">
              {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v2'}
            </p>
          </div>

          <div>
            <label className="font-medium text-gray-900 dark:text-white">Environment</label>
            <p className="text-gray-600 dark:text-gray-400">
              {process.env.NEXT_PUBLIC_NODE_ENV || 'development'}
            </p>
          </div>

          <div>
            <label className="font-medium text-gray-900 dark:text-white">Real-time Updates</label>
            <p className="text-gray-600 dark:text-gray-400">
              {process.env.NEXT_PUBLIC_ENABLE_REALTIME !== 'false' ? 'Enabled' : 'Disabled'}
            </p>
          </div>

          <div>
            <label className="font-medium text-gray-900 dark:text-white">WebSocket URL</label>
            <p className="text-gray-600 dark:text-gray-400">
              {process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

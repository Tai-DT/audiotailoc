'use client'

import { useState, useEffect } from 'react'

interface TestResult {
  test: string
  endpoint: string
  status: 'success' | 'error' | 'pending'
  statusCode?: number
  response?: any
  error?: string
  timestamp: string
  duration?: number
}

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [systemHealth, setSystemHealth] = useState<any>(null)

  // Load initial health check
  useEffect(() => {
    checkSystemHealth()
  }, [])

  const checkSystemHealth = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shutdown/health`)
      if (response.ok) {
        const data = await response.json()
        setSystemHealth(data.data)
      }
    } catch (error) {
      console.error('Health check failed:', error)
    }
  }

  const runApiTests = async () => {
    setIsRunning(true)
    setTestResults([])
    
    const tests = [
      {
        name: 'System Health Check',
        endpoint: '/shutdown/health',
        method: 'GET'
      },
      {
        name: 'System Metrics',
        endpoint: '/monitoring/metrics',
        method: 'GET'
      },
      {
        name: 'Dashboard Statistics',
        endpoint: '/dashboard/stats',
        method: 'GET'
      },
      {
        name: 'Users List',
        endpoint: '/users',
        method: 'GET'
      },
      {
        name: 'Products List',
        endpoint: '/catalog/products',
        method: 'GET'
      },
      {
        name: 'Orders List',
        endpoint: '/orders',
        method: 'GET'
      },
      {
        name: 'Security Stats',
        endpoint: '/security/stats',
        method: 'GET'
      },
      {
        name: 'Backup Info',
        endpoint: '/backup/info',
        method: 'GET'
      },
      {
        name: 'System Logs',
        endpoint: '/logs',
        method: 'GET'
      },
      {
        name: 'API Documentation',
        endpoint: '/docs',
        method: 'GET'
      }
    ]

    for (const test of tests) {
      const startTime = Date.now()
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${test.endpoint}`, {
          method: test.method,
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const duration = Date.now() - startTime
        const responseData = response.ok ? await response.json() : await response.text()

        const result: TestResult = {
          test: test.name,
          endpoint: test.endpoint,
          status: response.ok ? 'success' : 'error',
          statusCode: response.status,
          response: responseData,
          timestamp: new Date().toISOString(),
          duration
        }

        setTestResults(prev => [...prev, result])
      } catch (error) {
        const duration = Date.now() - startTime
        
        const result: TestResult = {
          test: test.name,
          endpoint: test.endpoint,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
          duration
        }

        setTestResults(prev => [...prev, result])
      }

      // Add small delay between tests
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    setIsRunning(false)
    checkSystemHealth() // Refresh health after tests
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'error': return 'text-red-600 bg-red-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatResponse = (response: any) => {
    if (typeof response === 'object') {
      return JSON.stringify(response, null, 2)
    }
    return String(response)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🧪 API Integration Testing
          </h1>
          <p className="text-gray-600">
            Test connectivity between Dashboard and Backend API - Real Data Integration
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Status:</strong> Dashboard integrated with backend API at {process.env.NEXT_PUBLIC_API_BASE_URL}
            </p>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className={`text-lg font-semibold ${systemHealth?.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                  {systemHealth?.status || 'Unknown'}
                </p>
              </div>
              <div className={`p-2 rounded-full ${systemHealth?.status === 'healthy' ? 'bg-green-100' : 'bg-red-100'}`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Base URL</p>
                <p className="text-sm text-gray-900 font-mono break-all">
                  {process.env.NEXT_PUBLIC_API_BASE_URL}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-lg font-semibold text-gray-900">
                  {systemHealth?.uptime ? Math.floor(systemHealth.uptime / 3600) + 'h' : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">🔍 API Endpoint Tests</h2>
              <p className="text-sm text-gray-600">Run comprehensive tests on all backend API endpoints with real data</p>
            </div>
            <button
              onClick={runApiTests}
              disabled={isRunning}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isRunning
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRunning ? '⏳ Running Tests...' : '▶️ Run Tests'}
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">📊 Test Results</h2>
          
          {testResults.length > 0 ? (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}>
                        {result.status === 'success' ? '✅' : '❌'} {result.status.toUpperCase()}
                      </span>
                      <h3 className="font-medium text-gray-900">{result.test}</h3>
                    </div>
                    <div className="text-sm text-gray-500">
                      {result.statusCode && `${result.statusCode} • `}
                      {result.duration}ms
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">{result.endpoint}</span>
                  </p>
                  
                  {result.error && (
                    <div className="bg-red-50 border border-red-200 rounded p-2 mb-2">
                      <p className="text-sm text-red-800">❌ {result.error}</p>
                    </div>
                  )}
                  
                  {result.response && (
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                        📄 View Response Data
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto max-h-40 border">
                        {formatResponse(result.response)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🧪</div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No test results yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Click "Run Tests" to start comprehensive API testing with real backend data
              </p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-medium text-green-900 mb-2">🎯 Integration Features Tested</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Real-time API connectivity between Dashboard and Backend</li>
            <li>• Live data fetching from backend database</li>
            <li>• System health monitoring and metrics</li>
            <li>• User, Product, and Order management APIs</li>
            <li>• Security monitoring and backup status</li>
            <li>• System logs and documentation access</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
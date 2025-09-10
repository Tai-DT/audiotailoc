"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useHealth } from "@/hooks/use-api"
import { apiClient } from "@/lib/api-client"
import { useState } from "react"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Play,
  Database,
  Users,
  ShoppingCart,
  Package
} from "lucide-react"

export default function ApiTestPage() {
  const { data: healthData, loading: healthLoading, error: healthError } = useHealth()
  const [testResults, setTestResults] = useState<Record<string, { status: 'idle' | 'loading' | 'success' | 'error', data?: unknown, error?: string }>>({})

  const testEndpoint = async (name: string, endpoint: () => Promise<unknown>) => {
    setTestResults(prev => ({ ...prev, [name]: { status: 'loading' } }))

    try {
      const result = await endpoint()
      setTestResults(prev => ({
        ...prev,
        [name]: { status: 'success', data: result }
      }))
    } catch (error: unknown) {
      setTestResults(prev => ({
        ...prev,
        [name]: {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }))
    }
  }

  const endpoints = [
    {
      name: 'Health Check',
      description: 'Test API health endpoint',
      icon: CheckCircle,
      action: () => apiClient.health(),
      requiresAuth: false
    },
    {
      name: 'Users',
      description: 'Test users endpoint (requires auth)',
      icon: Users,
      action: () => apiClient.getUsers({ limit: 5 }),
      requiresAuth: true
    },
    {
      name: 'Orders',
      description: 'Test orders endpoint (requires auth)',
      icon: ShoppingCart,
      action: () => apiClient.getOrders({ limit: 5 }),
      requiresAuth: true
    },
    {
      name: 'Products',
      description: 'Test products endpoint (requires auth)',
      icon: Package,
      action: () => apiClient.getProducts({ limit: 5 }),
      requiresAuth: true
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      case 'loading':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">API Integration Test</h2>
            <p className="text-muted-foreground">
              Test connection with Audio Tài Lộc Backend API
            </p>
          </div>
          <Badge variant="secondary">Bước 4: API Integration</Badge>
        </div>

        {/* API Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              API Connection Status
            </CardTitle>
            <CardDescription>
              Current status of backend API connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Base URL</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Health Check</span>
                  {healthLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  ) : healthError ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Authentication</span>
                  <Badge variant="outline">Not Required</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Response Format</span>
                  <Badge variant="outline">JSON</Badge>
                </div>
              </div>
            </div>

            {healthData && (
              <>
                <Separator className="my-4" />
                <div className="text-sm text-muted-foreground">
                  <p>Last health check: {new Date(healthData.timestamp).toLocaleString('vi-VN')}</p>
                  <p>Status: {healthData.status}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Endpoint Tests */}
        <div className="grid gap-4">
          {endpoints.map((endpoint) => {
            const result = testResults[endpoint.name]
            return (
              <Card key={endpoint.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <endpoint.icon className="h-5 w-5" />
                      <div>
                        <CardTitle className="text-lg">{endpoint.name}</CardTitle>
                        <CardDescription>{endpoint.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {endpoint.requiresAuth && (
                        <Badge variant="destructive" className="text-xs">
                          Auth Required
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        onClick={() => testEndpoint(endpoint.name, endpoint.action)}
                        disabled={result?.status === 'loading'}
                      >
                        {result?.status === 'loading' ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        Test
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {result && (
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                          {result.status === 'loading' ? 'Testing...' :
                           result.status === 'success' ? 'Success' :
                           result.status === 'error' ? 'Error' : 'Not tested'}
                        </span>
                      </div>

                      {result.status === 'success' && (result.data as object) && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Response Data:</h4>
                          <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                            {JSON.stringify(result.data as object, null, 2)}
                          </pre>
                        </div>
                      )}

                      {result.status === 'error' && result.error && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2 text-red-600">Error:</h4>
                          <p className="text-sm text-red-600 bg-red-50 p-3 rounded">
                            {result.error}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Authentication Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Setup</CardTitle>
            <CardDescription>
              Configure authentication for protected endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input placeholder="admin@audiotailoc.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input type="password" placeholder="Enter password" />
                </div>
              </div>
              <Button className="w-full md:w-auto">
                Login & Test Protected Endpoints
              </Button>
              <p className="text-sm text-muted-foreground">
                Note: Authentication setup will be implemented in the next step
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

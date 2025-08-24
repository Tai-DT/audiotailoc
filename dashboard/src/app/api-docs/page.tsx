'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DocumentIcon,
  ServerIcon,
  CodeBracketIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

const apiVersions = [
  {
    id: 'v1',
    name: 'API v1 (Legacy)',
    description: 'Legacy API version - Deprecated',
    status: 'deprecated',
    swaggerUrl: '/docs/v1',
    jsonUrl: '/api/v1/docs',
    deprecated: true,
  },
  {
    id: 'v1.1',
    name: 'API v1.1 (Enhanced)',
    description: 'Enhanced API with AI features - Deprecated',
    status: 'deprecated',
    swaggerUrl: '/docs/v1.1',
    jsonUrl: '/api/v1.1/docs',
    deprecated: true,
  },
  {
    id: 'v2',
    name: 'API v2 (Latest)',
    description: 'Latest API with advanced security and monitoring',
    status: 'active',
    swaggerUrl: '/docs/v2',
    jsonUrl: '/api/v2/docs',
    deprecated: false,
  },
]

export default function ApiDocsPage() {
  const [selectedVersion, setSelectedVersion] = useState('v2')
  const [viewMode, setViewMode] = useState<'swagger' | 'json'>('swagger')

  const currentVersion = apiVersions.find(v => v.id === selectedVersion)

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
          API Documentation
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Interactive API documentation và testing tools
        </p>
      </div>

      {/* Version Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            API Versions
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('swagger')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === 'swagger'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <EyeIcon className="h-4 w-4 inline mr-1" />
              Swagger UI
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === 'json'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <CodeBracketIcon className="h-4 w-4 inline mr-1" />
              JSON Spec
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {apiVersions.map((version) => (
            <motion.div
              key={version.id}
              whileHover={{ scale: 1.02 }}
              className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                selectedVersion === version.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              } ${version.deprecated ? 'opacity-75' : ''}`}
              onClick={() => setSelectedVersion(version.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {version.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {version.description}
                  </p>
                </div>
                {version.deprecated && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                    Deprecated
                  </span>
                )}
                {!version.deprecated && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                    Active
                  </span>
                )}
              </div>

              {selectedVersion === version.id && (
                <div className="absolute -top-2 -right-2">
                  <div className="h-4 w-4 bg-indigo-500 rounded-full"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {currentVersion && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Selected: {currentVersion.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {currentVersion.description}
                </p>
              </div>
              <div className="flex space-x-2">
                <a
                  href={currentVersion.swaggerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <DocumentIcon className="h-4 w-4 mr-1" />
                  Open Swagger
                </a>
                <a
                  href={currentVersion.jsonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                  Download JSON
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* API Documentation Viewer */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {viewMode === 'swagger' ? 'Interactive API Documentation' : 'API Specification'}
            </h2>
            <div className="flex items-center space-x-2">
              <ServerIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentVersion?.id.toUpperCase()} - {currentVersion?.status}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          {viewMode === 'swagger' ? (
            <div className="h-[800px]">
              <iframe
                src={currentVersion?.swaggerUrl}
                className="w-full h-full border-0"
                title={`API Documentation ${currentVersion?.id}`}
              />
            </div>
          ) : (
            <div className="p-6">
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-green-400">
                  <code>
{`{
  "openapi": "3.0.3",
  "info": {
    "title": "${currentVersion?.name}",
    "description": "${currentVersion?.description}",
    "version": "${currentVersion?.id}"
  },
  "servers": [
    {
      "url": "https://api.audiotailoc.com/api/${currentVersion?.id}",
      "description": "Production server"
    },
    {
      "url": "http://localhost:3000/api/${currentVersion?.id}",
      "description": "Development server"
    }
  ],
  "security": [
    {
      "${currentVersion?.id === 'v1' ? 'api-key' : 'access-token'}": []
    }
  ],
  "paths": {
    "/health": {
      "get": {
        "summary": "Health Check",
        "responses": {
          "200": {
            "description": "API is healthy"
          }
        }
      }
    }
  }
}`}
                  </code>
                </pre>
              </div>

              <div className="mt-4 flex justify-end">
                <a
                  href={currentVersion?.jsonUrl}
                  download={`api-${currentVersion?.id}-spec.json`}
                  className="inline-flex items-center px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Download Full Specification
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <DocumentIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Endpoints
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                45+
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <ServerIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                API Uptime
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                99.9%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <CodeBracketIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                SDK Languages
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                4
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Quick Start Guide
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                1. Authentication
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <pre className="text-sm text-gray-600 dark:text-gray-300 overflow-x-auto">
{`# Login to get access token
curl -X POST /api/${currentVersion?.id}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "...", "password": "..."}'

# Use token in requests
curl -H "Authorization: Bearer TOKEN" \\
     /api/${currentVersion?.id}/users/profile`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                2. Common Endpoints
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Health Check</span>
                  <code className="text-xs text-gray-500 dark:text-gray-400">GET /health</code>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">List Products</span>
                  <code className="text-xs text-gray-500 dark:text-gray-400">GET /products</code>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">User Profile</span>
                  <code className="text-xs text-gray-500 dark:text-gray-400">GET /users/profile</code>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Create Order</span>
                  <code className="text-xs text-gray-500 dark:text-gray-400">POST /orders</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

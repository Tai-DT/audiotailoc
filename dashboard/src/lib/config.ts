// Configuration file for dashboard
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    docsUrl: process.env.NEXT_PUBLIC_API_DOCS_URL || 'http://localhost:8000/docs',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000',
  },

  // Features
  features: {
    enableRealtime: process.env.NEXT_PUBLIC_ENABLE_REALTIME !== 'false',
    enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
    enableCharts: process.env.NEXT_PUBLIC_ENABLE_CHARTS !== 'false',
    chartUpdateInterval: parseInt(process.env.NEXT_PUBLIC_CHART_UPDATE_INTERVAL || '5000'),
  },

  // Security
  security: {
    nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV || 'development',
  },

  // UI Configuration
  ui: {
    itemsPerPage: 20,
    maxRetries: 3,
    loadingTimeout: 10000,
  },

  // Analytics
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
}

// Helper function to get API URL
export function getApiUrl(endpoint: string): string {
  return `${config.api.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
}

// Helper function to get docs URL
export function getDocsUrl(version: string = 'v2'): string {
  return `${config.api.docsUrl}`
}

// Environment validation
export function validateConfig() {
  const required = ['api.baseUrl']

  for (const key of required) {
    const value = key.split('.').reduce((obj, k) => obj?.[k], config)
    if (!value) {
      console.warn(`Warning: Missing required configuration: ${key}`)
    }
  }

  if (config.security.nodeEnv === 'development') {
    console.log('Dashboard running in development mode')
    console.log('API URL:', config.api.baseUrl)
    console.log('Docs URL:', config.api.docsUrl)
  }
}

// Validate config on import
validateConfig()

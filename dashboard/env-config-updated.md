# Dashboard Environment Configuration - Updated

Copy these environment variables to your `.env.local` file in the dashboard directory:

```bash
# Dashboard Environment Configuration - Audio Tài Lộc
# Updated to connect to Backend running on port 3010

# API Configuration - UPDATED FOR BACKEND INTEGRATION
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
NEXT_PUBLIC_API_DOCS_URL=http://localhost:3010/docs
NEXT_PUBLIC_WS_URL=ws://localhost:3010

# Features
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_CHARTS=true
NEXT_PUBLIC_CHART_UPDATE_INTERVAL=5000

# Security
NEXT_PUBLIC_NODE_ENV=development

# Application
NEXT_PUBLIC_APP_NAME=Audio Tài Lộc Dashboard
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Commands to apply:
```bash
cd dashboard
cp env-config-updated.md .env.local
```

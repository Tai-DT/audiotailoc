# API Integration Guide - Dashboard

Hướng dẫn tích hợp Dashboard với Backend API cho Audio Tài Lộc

## 📋 Tổng quan

Dashboard đã được cấu hình để tương tác với Backend API thông qua:
- **API Client**: Centralized HTTP client với error handling
- **React Hooks**: TanStack Query hooks cho data fetching
- **Real-time Updates**: WebSocket integration cho live data
- **Type Safety**: TypeScript interfaces cho API responses

## 🏗️ Kiến trúc Integration

### 1. API Client Layer
```typescript
// src/lib/api-client.ts
export class ApiClient {
  private baseUrl: string
  private headers: Record<string, string>

  // Methods: get, post, put, delete
  // Auto error handling và response parsing
}
```

### 2. Hooks Layer
```typescript
// src/hooks/useApi.ts
export function useUsers(params) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => apiClient.getUsers(params),
    staleTime: 30000, // 30 seconds cache
  })
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (data) => apiClient.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created!')
    }
  })
}
```

### 3. Component Layer
```typescript
// src/app/users/page.tsx
const { data: users, isLoading, error } = useUsers(params)
const createUser = useCreateUser()

// Component sử dụng data từ API
```

## ⚙️ Cấu hình Environment

### File .env.local
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v2
NEXT_PUBLIC_API_DOCS_URL=http://localhost:3001/docs/v2
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Features
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_CHARTS=true
NEXT_PUBLIC_CHART_UPDATE_INTERVAL=5000

# Security
NEXT_PUBLIC_NODE_ENV=development
```

### Configuration Object
```typescript
// src/lib/config.ts
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    docsUrl: process.env.NEXT_PUBLIC_API_DOCS_URL,
    wsUrl: process.env.NEXT_PUBLIC_WS_URL,
  },
  features: {
    enableRealtime: process.env.NEXT_PUBLIC_ENABLE_REALTIME !== 'false',
    enableNotifications: true,
    enableCharts: true,
  }
}
```

## 🔌 API Endpoints Mapping

### User Management
```typescript
// GET /api/v2/users
useUsers({ page: 1, limit: 20, search: '', role: '', status: '' })

// GET /api/v2/users/:id
useUser(userId)

// POST /api/v2/users
useCreateUser()

// PUT /api/v2/users/:id
useUpdateUser()

// DELETE /api/v2/users/:id
useDeleteUser()
```

### Product Management
```typescript
// GET /api/v2/products
useProducts({ page: 1, limit: 20, search: '', category: '', status: '' })

// GET /api/v2/products/:id
useProduct(productId)

// POST /api/v2/products
useCreateProduct()

// PUT /api/v2/products/:id
useUpdateProduct()

// DELETE /api/v2/products/:id
useDeleteProduct()
```

### Order Management
```typescript
// GET /api/v2/orders
useOrders({ page: 1, limit: 20, status: '', paymentStatus: '' })

// GET /api/v2/orders/:id
useOrder(orderId)

// PUT /api/v2/orders/:id/status
useUpdateOrderStatus()
```

### System Monitoring
```typescript
// GET /api/v2/monitoring/metrics
useSystemMetrics()

// GET /api/v2/shutdown/health
useSystemHealth()
```

### Backup Management
```typescript
// GET /api/v2/backup/info
useBackupInfo()

// GET /api/v2/backup/history
useBackupHistory()

// POST /api/v2/backup/create
useCreateBackup()

// POST /api/v2/backup/restore
useRestoreBackup()
```

## 📊 Data Fetching Patterns

### 1. Basic Query with Parameters
```typescript
const { data, isLoading, error } = useUsers({
  page: 1,
  limit: 20,
  search: searchTerm,
  role: roleFilter,
  status: statusFilter
})

// Usage in component
if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />

return <UsersTable users={data?.data || []} />
```

### 2. Mutation with Optimistic Updates
```typescript
const createUser = useCreateUser()

const handleCreateUser = async (userData) => {
  try {
    await createUser.mutateAsync(userData)
    // Success toast shown automatically
    closeModal()
  } catch (error) {
    // Error handled automatically
    console.error('Failed to create user:', error)
  }
}
```

### 3. Real-time Data with Polling
```typescript
const { data: metrics } = useSystemMetrics()
// Auto-refetches every 30 seconds
// Shows loading states during refetch
```

### 4. Dependent Queries
```typescript
const { data: user } = useUser(userId)
const { data: userOrders } = useOrders({
  userId: user?.id
}, {
  enabled: !!user?.id // Only fetch when user is loaded
})
```

## 🔄 Error Handling

### Global Error Handling
```typescript
// src/lib/api-client.ts
export class ApiError extends Error {
  public status: number
  public data?: any

  constructor(status: number, message: string, data?: any) {
    super(message)
    this.status = status
    this.data = data
  }
}
```

### Component Error Boundaries
```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends Component {
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    console.error('Dashboard Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

## 🔐 Authentication & Security

### JWT Token Management
```typescript
// src/lib/api-client.ts
export class ApiClient {
  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`
  }

  clearAuthToken() {
    delete this.headers['Authorization']
  }
}

// Usage
apiClient.setAuthToken(localStorage.getItem('token'))
```

### Protected Routes
```typescript
// src/components/ProtectedRoute.tsx
const ProtectedRoute = ({ children }) => {
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading) return <LoadingSpinner />
  if (!user) return <Navigate to="/login" />

  return children
}
```

## 📡 WebSocket Integration

### Real-time Updates
```typescript
// src/hooks/useWebSocket.ts
import { io } from 'socket.io-client'

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = io(config.api.wsUrl)

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    socket.on('system-metrics', (data) => {
      // Update dashboard with real-time data
      queryClient.setQueryData(['system-metrics'], data)
    })

    return () => socket.disconnect()
  }, [])

  return { isConnected }
}
```

### Live Notifications
```typescript
socket.on('notification', (notification) => {
  // Show toast notification
  toast(notification.message, {
    type: notification.type,
    duration: 5000
  })

  // Add to notifications list
  addNotification(notification)
})
```

## 🧪 Testing Integration

### Unit Tests for Hooks
```typescript
// src/hooks/useApi.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useUsers } from './useApi'

test('useUsers fetches users successfully', async () => {
  const { result } = renderHook(() => useUsers({ page: 1 }))

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toBeDefined()
  })
})
```

### Mock API for Testing
```typescript
// src/__mocks__/api-client.ts
export const mockApiClient = {
  getUsers: jest.fn().mockResolvedValue(mockUsersResponse),
  createUser: jest.fn().mockResolvedValue(mockUser),
}
```

## 🚀 Performance Optimization

### Query Caching Strategy
```typescript
// Cache for 5 minutes, refetch in background
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
})
```

### Optimistic Updates
```typescript
const createUser = useMutation({
  mutationFn: createUserAPI,
  onMutate: async (newUser) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['users'] })

    // Snapshot previous value
    const previousUsers = queryClient.getQueryData(['users'])

    // Optimistically update
    queryClient.setQueryData(['users'], (old) => [...old, newUser])

    return { previousUsers }
  },
  onError: (err, newUser, context) => {
    // Revert on error
    queryClient.setQueryData(['users'], context.previousUsers)
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})
```

### Pagination with Infinite Scroll
```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['users', 'infinite'],
  queryFn: ({ pageParam = 1 }) => fetchUsers({ page: pageParam }),
  getNextPageParam: (lastPage) => lastPage.nextPage,
})
```

## 🔧 Development Tools

### React Query DevTools
```typescript
// src/providers/QueryProvider.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### API Request Logging
```typescript
// src/lib/api-client.ts
private async request(endpoint: string, options: RequestInit) {
  console.log(`API Request: ${options.method} ${endpoint}`)

  const response = await fetch(`${this.baseUrl}${endpoint}`, {
    ...options,
    headers: this.headers,
  })

  console.log(`API Response: ${response.status} ${endpoint}`)

  return response
}
```

## 📈 Monitoring & Analytics

### Performance Monitoring
```typescript
// src/hooks/usePerformance.ts
export function usePerformance() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Monitor Core Web Vitals
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log)
        getFID(console.log)
        getFCP(console.log)
        getLCP(console.log)
        getTTFB(console.log)
      })
    }
  }, [])
}
```

### Error Tracking
```typescript
// src/lib/error-tracking.ts
import * as Sentry from '@sentry/react'

if (config.analytics.sentryDsn) {
  Sentry.init({
    dsn: config.analytics.sentryDsn,
    environment: config.security.nodeEnv,
  })
}

// Usage in components
Sentry.captureException(error)
```

## 🎯 Best Practices

### 1. Error Handling
- Always handle loading and error states
- Show user-friendly error messages
- Log errors for debugging
- Use error boundaries for critical sections

### 2. Data Management
- Use React Query for server state
- Implement proper caching strategies
- Handle loading states gracefully
- Optimize re-renders with memoization

### 3. Security
- Validate all API responses
- Sanitize user inputs
- Use HTTPS in production
- Implement proper authentication

### 4. Performance
- Implement code splitting
- Use lazy loading for components
- Optimize images and assets
- Monitor bundle size

### 5. Testing
- Write unit tests for hooks
- Test error scenarios
- Mock API responses
- Test user interactions

## 🚀 Deployment

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://api.audiotailoc.com/api/v2
NEXT_PUBLIC_API_DOCS_URL=https://api.audiotailoc.com/docs/v2
NEXT_PUBLIC_WS_URL=wss://api.audiotailoc.com
NEXT_PUBLIC_NODE_ENV=production
NEXT_PUBLIC_ENABLE_REALTIME=true
```

### Build Optimization
```typescript
// next.config.js
module.exports = {
  // Enable SWC minifier for better performance
  swcMinify: true,

  // Optimize images
  images: {
    domains: ['api.audiotailoc.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Bundle analyzer (optional)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.chunks = 'all'
    }
    return config
  },
}
```

---

## 🎉 Kết luận

Dashboard đã được tích hợp hoàn chỉnh với Backend API và sẵn sàng cho production với:

✅ **Real API Integration** - Tất cả endpoints đều hoạt động
✅ **Error Handling** - Comprehensive error management
✅ **Loading States** - User-friendly loading indicators
✅ **Caching Strategy** - Optimized data fetching
✅ **Real-time Updates** - WebSocket integration
✅ **Type Safety** - Full TypeScript support
✅ **Testing Ready** - Unit tests và integration tests
✅ **Production Ready** - Optimized build và deployment

**🎵 Dashboard đã sẵn sàng cho việc quản lý Audio Tài Lộc platform! 🎵**

# Advanced Features Integration Guide

## Overview

This guide covers the integration of three advanced modules into the AudioTaiLoc backend:

1. **Search Module** - Full-text search with advanced filtering
2. **Real-time Module** - WebSocket-based real-time updates
3. **AI Module** - AI-powered recommendations and chatbot

## Quick Start

### 1. Enable Modules in App Module

Edit `/src/modules/app.module.ts`:

```typescript
import { SearchModule } from './search/search.module';
import { RealtimeModule } from './realtime/realtime.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    // ... existing imports
    SearchModule,
    RealtimeModule,
    AiModule,
  ],
})
export class AppModule {}
```

### 2. Configure Environment Variables

Add to `.env`:

```env
# AI Module - Google Gemini API
GOOGLE_GEMINI_API_KEY=your_api_key_here

# Real-time (Optional)
WEBSOCKET_CORS_ORIGIN=http://localhost:3000,https://yourdomain.com

# Search (Optional)
SEARCH_MAX_RESULTS=100
SEARCH_DEFAULT_PAGE_SIZE=20
```

### 3. Start the Application

```bash
npm run start:dev
```

## Module Details

### Search Module

**Location**: `/src/modules/search/`

**Files**:
- `search.service.ts` - Core search logic
- `search.controller.ts` - API endpoints
- `search.module.ts` - Module definition

**Key Features**:
- Unified search across products, services, blog, and KB
- Advanced filtering (price, category, brand, rating)
- Faceted search for navigation
- Search analytics and suggestions

**Endpoints**:
- `GET /api/v1/search` - Main search
- `GET /api/v1/search/:type` - Type-specific search
- `GET /api/v1/search/suggestions` - Autocomplete
- `GET /api/v1/search/popular` - Trending searches
- `POST /api/v1/search/advanced` - Advanced search (admin)

**Usage**:
```typescript
import { SearchService } from './modules/search/search.service';

@Injectable()
export class MyService {
  constructor(private searchService: SearchService) {}

  async search(query: string) {
    return this.searchService.search(query, {
      type: 'product',
      sortBy: 'relevance',
      pageSize: 20,
    });
  }
}
```

### Real-time Module

**Location**: `/src/modules/realtime/`

**Files**:
- `realtime.gateway.ts` - WebSocket gateway
- `realtime.service.ts` - Real-time event management
- `realtime.module.ts` - Module definition

**Key Features**:
- Order status updates
- Booking notifications
- Live chat messaging
- Inventory alerts
- User presence tracking

**WebSocket Events**:
- `order:subscribe/updated`
- `booking:subscribe/updated`
- `chat:subscribe/message`
- `notification:message/event`
- `user:online/offline`

**Usage**:
```typescript
import { RealtimeService } from './modules/realtime/realtime.service';

@Injectable()
export class OrderService {
  constructor(private realtimeService: RealtimeService) {}

  async updateOrder(orderId: string, status: string) {
    // Update order
    const order = await this.prisma.order.update({...});

    // Notify subscribers
    await this.realtimeService.notifyOrderStatusChange(
      orderId,
      status,
      userId
    );
  }
}
```

### AI Module

**Location**: `/src/modules/ai/`

**Files**:
- `ai.service.ts` - Core AI logic with Gemini integration
- `ai.controller.ts` - API endpoints
- `ai.module.ts` - Module definition

**Key Features**:
- Product recommendations with scoring
- AI-powered search suggestions
- Intelligent chatbot with multi-turn conversations
- Message sentiment analysis
- Intent recognition

**Endpoints**:
- `GET /api/v1/ai/recommendations` - Product recommendations
- `POST /api/v1/ai/recommendations/advanced` - Advanced recommendations
- `GET /api/v1/ai/suggestions` - Search suggestions
- `POST /api/v1/ai/chat` - Chatbot
- `POST /api/v1/ai/conversation` - Multi-turn conversation
- `POST /api/v1/ai/analyze` - Message analysis (admin)
- `GET /api/v1/ai/status` - Service status

**Usage**:
```typescript
import { AiService } from './modules/ai/ai.service';

@Injectable()
export class RecommendationService {
  constructor(private aiService: AiService) {}

  async getRecommendations(userId: string) {
    return this.aiService.getProductRecommendations(userId, {
      category: 'headphones',
      budget: { min: 500000, max: 2000000 }
    }, 5);
  }
}
```

## Integration Patterns

### 1. Search + AI Integration

Combine search with AI suggestions:

```typescript
@Injectable()
export class EnhancedSearchService {
  constructor(
    private searchService: SearchService,
    private aiService: AiService,
  ) {}

  async searchWithSuggestions(query: string) {
    const [results, suggestions] = await Promise.all([
      this.searchService.search(query),
      this.aiService.getSearchSuggestions(query, 5),
    ]);

    return {
      results,
      suggestions,
    };
  }
}
```

### 2. Real-time + Order Updates

Notify customers of order changes:

```typescript
@Injectable()
export class OrderService {
  constructor(
    private ordersService: OrdersService,
    private realtimeService: RealtimeService,
  ) {}

  async processOrderPayment(orderId: string) {
    // Process payment
    await this.ordersService.markPaid(orderId);

    // Notify via real-time
    await this.realtimeService.notifyOrderStatusChange(
      orderId,
      'paid',
      userId
    );

    // Get recommendations for next purchase
    const recommendations = await this.aiService.getProductRecommendations(
      userId
    );

    // Notify user of recommendations
    this.realtimeService.notifyUser(userId, {
      type: 'recommendations',
      products: recommendations,
    });
  }
}
```

### 3. AI Chatbot + Product Search

Integrate AI chatbot with product database:

```typescript
@Injectable()
export class ChatbotService {
  constructor(
    private aiService: AiService,
    private searchService: SearchService,
  ) {}

  async handleChat(userMessage: string, userId: string) {
    // Get AI response
    const response = await this.aiService.chatbot(userMessage, [], userId);

    // If product-related, enhance with search
    const analysis = await this.aiService.analyzeMessage(userMessage);
    if (analysis.intent === 'product_recommendation') {
      const products = await this.searchService.search(
        analysis.keywords[0],
        { type: 'product', pageSize: 3 }
      );

      return {
        ...response,
        products: products.results,
      };
    }

    return response;
  }
}
```

## Frontend Integration

### React Components

#### Search Component
```typescript
import { useSearch } from './hooks/useSearch';

export function SearchBar() {
  const { search, suggestions, loading } = useSearch();

  const handleSearch = async (query) => {
    const results = await search(query, {
      type: 'product',
      sortBy: 'relevance'
    });
  };

  return (
    <input
      placeholder="Search products, services..."
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
```

#### Real-time Order Tracker
```typescript
import { useOrderRealtime } from './hooks/useOrderRealtime';

export function OrderTracker({ orderId, token }) {
  const { status, lastUpdate } = useOrderRealtime(orderId, token);

  return (
    <div>
      <h3>Order Status: {status}</h3>
      <p>Last updated: {lastUpdate}</p>
    </div>
  );
}
```

#### AI Chatbot Widget
```typescript
import { useChatbot } from './hooks/useChatbot';

export function ChatbotWidget() {
  const { messages, send, loading } = useChatbot();

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        onKeyPress={(e) => {
          if (e.key === 'Enter') send(e.target.value);
        }}
        disabled={loading}
        placeholder="Ask me anything..."
      />
    </div>
  );
}
```

### Custom Hooks

#### useSearch Hook
```typescript
import { useState } from 'react';

export function useSearch() {
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (query, filters = {}) => {
    setLoading(true);
    const params = new URLSearchParams({
      q: query,
      ...filters,
    });

    const response = await fetch(`/api/v1/search?${params}`);
    const data = await response.json();

    setResults(data.results);
    setLoading(false);
    return data;
  };

  const getSuggestions = async (query) => {
    const response = await fetch(
      `/api/v1/ai/suggestions?q=${query}&limit=5`
    );
    const data = await response.json();
    setSuggestions(data.data);
  };

  return { search, suggestions, getSuggestions, loading };
}
```

#### useOrderRealtime Hook
```typescript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useOrderRealtime(orderId, token) {
  const [status, setStatus] = useState('pending');
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const socket = io('/api/v1/realtime', {
      auth: { token }
    });

    socket.emit('order:subscribe', { orderId });
    socket.on('order:updated', (data) => {
      setStatus(data.status);
      setLastUpdate(new Date());
    });

    return () => {
      socket.emit('order:unsubscribe', { orderId });
      socket.disconnect();
    };
  }, [orderId, token]);

  return { status, lastUpdate };
}
```

## Database Migrations

### SearchQuery Model (Already in Schema)
The `SearchQuery` model is already defined in your Prisma schema for logging searches.

### Optional: Add Indexes

For better performance, add database indexes:

```prisma
model Product {
  // ... existing fields

  // Add these indexes for search
  @@index([name])
  @@index([description])
  @@index([brand])
  @@index([categoryId])
  @@index([isActive])
}

model Service {
  // ... existing fields

  @@index([name])
  @@index([typeId])
  @@index([isActive])
}

model blog_articles {
  // ... existing fields

  @@index([title])
  @@index([content])
  @@index([published])
}
```

Then run:
```bash
npx prisma migrate dev --name add-search-indexes
```

## Testing

### Unit Tests

Create test files for each module:

```typescript
// search.service.spec.ts
import { Test } from '@nestjs/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SearchService, PrismaService],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should search products', async () => {
    const results = await service.search('headphones', {
      type: 'product',
    });

    expect(results.results).toBeDefined();
    expect(results.total).toBeGreaterThanOrEqual(0);
  });
});
```

### Integration Tests

```typescript
// search.controller.spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SearchController } from './search.controller';

describe('Search (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [SearchService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should search /api/v1/search', () => {
    return request(app.getHttpServer())
      .get('/api/v1/search')
      .query({ q: 'headphones' })
      .expect(200)
      .expect((res) => {
        expect(res.body.results).toBeDefined();
      });
  });
});
```

## Performance Optimization

### 1. Caching

Add Redis caching for frequently accessed data:

```typescript
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class OptimizedSearchService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager,
    private searchService: SearchService,
  ) {}

  async search(query: string, filters) {
    const cacheKey = `search:${query}:${JSON.stringify(filters)}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const results = await this.searchService.search(query, filters);

    // Cache for 1 hour
    await this.cacheManager.set(cacheKey, results, 3600000);

    return results;
  }
}
```

### 2. Database Query Optimization

Use efficient Prisma queries:

```typescript
// Avoid N+1 queries
const products = await this.prisma.product.findMany({
  select: {
    id: true,
    name: true,
    price: true,
    category: { select: { name: true } }, // Include related data
  },
  take: 20,
});
```

### 3. Pagination

Always paginate large result sets:

```typescript
// Always use skip/take for large queries
const { page = 1, pageSize = 20 } = params;
const skip = (page - 1) * pageSize;

const [total, items] = await Promise.all([
  this.prisma.product.count({ where }),
  this.prisma.product.findMany({ where, skip, take: pageSize }),
]);
```

## Monitoring & Logging

### Structured Logging

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  async search(query: string, filters) {
    const startTime = Date.now();

    try {
      const results = await this._search(query, filters);
      const duration = Date.now() - startTime;

      this.logger.log(
        `Search completed: query="${query}" results=${results.total} duration=${duration}ms`
      );

      return results;
    } catch (error) {
      this.logger.error(
        `Search failed: query="${query}" error=${error.message}`
      );
      throw error;
    }
  }
}
```

### Metrics

Track key metrics:

```typescript
// Search metrics
- Queries per minute
- Average response time
- Results per query
- Popular search terms

// Real-time metrics
- Active connections
- Messages per minute
- Connection duration

// AI metrics
- Recommendation accuracy
- Chatbot satisfaction
- API usage and costs
```

## Security Considerations

### 1. Authentication
- All admin endpoints require JWT authentication
- Use the `@UseGuards(AdminGuard)` decorator

### 2. Input Validation
- Validate all user inputs
- Sanitize search queries
- Limit request sizes

### 3. Rate Limiting
```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10, // 10 requests per minute
    }),
  ],
})
export class AppModule {}
```

### 4. API Key Protection
- Keep Gemini API key in environment variables
- Never expose in client-side code
- Rotate keys regularly

## Deployment

### Environment Configuration

```env
# Production
NODE_ENV=production
GOOGLE_GEMINI_API_KEY=your_prod_key
WEBSOCKET_CORS_ORIGIN=https://yourdomain.com

# Staging
NODE_ENV=staging
GOOGLE_GEMINI_API_KEY=your_staging_key
WEBSOCKET_CORS_ORIGIN=https://staging.yourdomain.com
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Kubernetes

```yaml
apiVersion: v1
kind: Service
metadata:
  name: audiotailoc-backend
spec:
  type: LoadBalancer
  ports:
    - port: 3000
      targetPort: 3000
  selector:
    app: audiotailoc-backend
```

## Troubleshooting

### Search Issues
- Check database indexes
- Verify database connection
- Check Prisma schema

### Real-time Issues
- Verify WebSocket URL
- Check CORS configuration
- Verify JWT token validity

### AI Issues
- Check Gemini API key
- Verify API quota
- Check network connectivity

## Support & Resources

- **Search Module**: `/src/modules/search/SEARCH_MODULE.md`
- **Real-time Module**: `/src/modules/realtime/REALTIME_MODULE.md`
- **AI Module**: `/src/modules/ai/AI_MODULE.md`
- **Project Repo**: [GitHub Link]
- **API Documentation**: `/docs` (Swagger)

## Next Steps

1. Enable modules in app.module.ts
2. Configure environment variables
3. Test endpoints with Postman/Insomnia
4. Integrate with frontend
5. Monitor and optimize performance
6. Deploy to production

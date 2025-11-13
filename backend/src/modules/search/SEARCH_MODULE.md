# Search Module Documentation

## Overview

The Search Module provides comprehensive full-text search functionality across multiple content types in the AudioTaiLoc platform. It supports searching products, services, blog articles, and knowledge base entries with advanced filtering, faceting, and sorting capabilities.

## Features

### 1. Unified Search
- Search across products, services, blog articles, and knowledge base simultaneously
- Type-specific search with filtering by content type
- Relevance-based ranking with configurable scoring

### 2. Advanced Filtering
- **Price Range**: Filter by minimum and maximum price
- **Category**: Filter products by category
- **Brand**: Filter products by brand
- **Service Type**: Filter services by type
- **Rating**: Filter by minimum rating

### 3. Sorting Options
- **Relevance**: Default sorting by search relevance score
- **Price (Ascending/Descending)**: Sort by price
- **Newest**: Sort by creation date
- **Popular**: Sort by view count and engagement
- **Rating**: Sort by average rating

### 4. Faceted Search
- Generate facets for dynamic filtering
- Category, brand, and service type facets
- Count aggregation for each facet

### 5. Search Analytics
- Log all search queries with result counts
- Track popular searches
- Suggest searches based on history

## API Endpoints

### Search

#### GET `/api/v1/search`
Unified search across all content types.

**Query Parameters:**
- `q` (required): Search query string
- `type`: Content type filter ('product', 'service', 'blog', 'knowledge', 'all')
- `category`: Category ID filter
- `priceMin`: Minimum price filter
- `priceMax`: Maximum price filter
- `brand`: Brand name filter
- `serviceType`: Service type ID filter
- `minRating`: Minimum rating filter (0-5)
- `sortBy`: Sort criteria ('relevance', 'price-asc', 'price-desc', 'newest', 'popular', 'rating')
- `page`: Page number (default: 1)
- `pageSize`: Results per page (default: 20, max: 100)
- `includeFacets`: Include facets in response (true/false)

**Response:**
```json
{
  "query": "gaming headphones",
  "results": [
    {
      "id": "prod_123",
      "type": "product",
      "title": "Pro Gaming Headphones",
      "description": "Professional grade gaming headphones",
      "slug": "pro-gaming-headphones",
      "image": "https://...",
      "price": 299.99,
      "rating": 4.5,
      "relevanceScore": 95,
      "metadata": {
        "brand": "AudioBrand",
        "reviewCount": 125
      }
    }
  ],
  "total": 45,
  "page": 1,
  "pageSize": 20,
  "facets": {
    "categories": [...],
    "brands": [...],
    "priceRanges": [...]
  },
  "executionTime": 125
}
```

#### GET `/api/v1/search/:type`
Search specific content type.

**Parameters:**
- `type`: Content type ('product', 'service', 'blog', 'knowledge')
- `q`: Search query (required)
- `page`: Page number
- `pageSize`: Results per page

### Suggestions

#### GET `/api/v1/search/suggestions`
Get autocomplete search suggestions.

**Query Parameters:**
- `q` (required): Partial search query
- `limit`: Number of suggestions (default: 5, max: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    "gaming headphones",
    "gaming headphones wireless",
    "gaming headphones with microphone"
  ]
}
```

### Popular Searches

#### GET `/api/v1/search/popular`
Get most popular search queries.

**Query Parameters:**
- `limit`: Number of results (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    { "query": "headphones", "count": 1245 },
    { "query": "gaming audio", "count": 892 },
    { "query": "wireless speakers", "count": 756 }
  ]
}
```

### Advanced Search

#### POST `/api/v1/ai/search/advanced`
Advanced search with complex filters (requires authentication).

**Request Body:**
```json
{
  "query": "gaming equipment",
  "type": "product",
  "category": "cat_123",
  "priceMin": 100,
  "priceMax": 500,
  "brand": "AudioBrand",
  "sortBy": "price-asc",
  "page": 1,
  "pageSize": 20,
  "includeFacets": true
}
```

## Usage Examples

### Basic Search
```typescript
// Search across all content
const results = await fetch('/api/v1/search?q=headphones&type=all');

// Search only products
const products = await fetch('/api/v1/search?q=headphones&type=product');
```

### Search with Filters
```typescript
// Search with price range and category
const filtered = await fetch(
  '/api/v1/search?q=headphones&category=cat_123&priceMin=100&priceMax=500&sortBy=price-asc'
);
```

### Search Suggestions
```typescript
// Get autocomplete suggestions
const suggestions = await fetch('/api/v1/search/suggestions?q=head&limit=5');
```

### Popular Searches
```typescript
// Get trending searches
const popular = await fetch('/api/v1/search/popular?limit=10');
```

## Relevance Scoring

The search module uses a multi-factor relevance scoring algorithm:

1. **Exact Match** (100 points): Title exactly matches query
2. **Prefix Match** (90 points): Title starts with query
3. **Contains Match** (80 points): Title contains query
4. **Word Match** (0-70 points): Partial word matches weighted by coverage

## Performance Considerations

- **Pagination**: Results are paginated with max page size of 100
- **Timeout**: Search requests timeout after 10 seconds
- **Caching**: Consider implementing Redis caching for popular searches
- **Indexing**: For large datasets, consider implementing full-text search indexing in the database

## Environment Variables

```env
# Optional: Configure search settings
SEARCH_MAX_RESULTS=100
SEARCH_DEFAULT_PAGE_SIZE=20
SEARCH_TIMEOUT_MS=10000
```

## Error Handling

- **Empty Query**: Returns 400 Bad Request with message "Search query cannot be empty"
- **Invalid Content Type**: Returns error indicating valid types
- **Database Error**: Returns 500 Internal Server Error

## Best Practices

1. **Use Type Filters**: Narrow results by content type when possible
2. **Implement Caching**: Cache popular search results
3. **Log Analytics**: Use search logs to improve recommendations
4. **Rate Limiting**: Implement rate limiting on search endpoints
5. **Query Validation**: Always validate and sanitize user input

## Integration Examples

### Frontend (React)
```typescript
const [results, setResults] = useState([]);

const handleSearch = async (query: string) => {
  const response = await fetch(
    `/api/v1/search?q=${encodeURIComponent(query)}&includeFacets=true`
  );
  const data = await response.json();
  setResults(data);
};
```

### Backend Usage
```typescript
import { SearchService } from './search.service';

export class MyService {
  constructor(private searchService: SearchService) {}

  async findProducts(query: string) {
    return this.searchService.search(query, {
      type: 'product',
      sortBy: 'relevance',
      pageSize: 20,
    });
  }
}
```

## Future Enhancements

1. **Full-Text Indexing**: Implement Elasticsearch or PostgreSQL full-text search
2. **Machine Learning**: Use ML models for better relevance ranking
3. **Semantic Search**: Implement semantic similarity matching
4. **Auto-Complete**: Advanced autocomplete with fuzzy matching
5. **Typo Tolerance**: Handle misspelled queries
6. **Search Analytics Dashboard**: Visualize search trends and insights

## Troubleshooting

### No Results Found
- Check query spelling
- Verify content is published/active
- Try broader search terms

### Slow Search Performance
- Check database indexes
- Consider pagination with smaller page sizes
- Implement caching for popular searches

### Facet Count Mismatch
- Facets are approximations for performance
- Re-run search with specific filters for accurate counts

## Support

For issues or questions about the Search Module, please contact the development team or open an issue in the project repository.

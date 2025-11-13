# AI Module Documentation

## Overview

The AI Module provides intelligent features for the AudioTaiLoc platform including product recommendations, search suggestions, and an AI-powered chatbot. It integrates with Google Gemini API for advanced natural language processing capabilities and falls back to rule-based approaches when the API is unavailable.

## Features

### 1. Product Recommendations
- Personalized product recommendations based on user preferences
- Multi-factor scoring algorithm considering popularity, ratings, and user history
- Budget-aware recommendations

### 2. Search Suggestions
- AI-powered autocomplete with Gemini API
- Database fallback for quick suggestions
- Typo-tolerant matching

### 3. Intelligent Chatbot
- Multi-turn conversation support
- Sentiment analysis
- Intent recognition
- Context-aware responses
- Product recommendations within conversations

### 4. Message Analysis
- Sentiment detection (positive, negative, neutral)
- Keyword extraction
- Intent classification
- Confidence scoring

## API Endpoints

### Recommendations

#### GET `/api/v1/ai/recommendations`
Get personalized product recommendations.

**Query Parameters:**
- `category`: Category ID filter (optional)
- `minBudget`: Minimum budget in VND (optional)
- `maxBudget`: Maximum budget in VND (optional)
- `brand`: Brand name filter (optional)
- `limit`: Number of recommendations (default: 5, max: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "prod_123",
      "name": "Professional Audio Headphones",
      "slug": "professional-audio-headphones",
      "price": 2999000,
      "image": "https://...",
      "reason": "Highly rated, Popular choice",
      "relevanceScore": 95.5
    }
  ]
}
```

#### POST `/api/v1/ai/recommendations/advanced`
Get advanced recommendations with complex filters (requires authentication).

**Request Body:**
```json
{
  "category": "cat_123",
  "minBudget": 1000000,
  "maxBudget": 5000000,
  "brand": "Audio Brand",
  "searchHistory": ["headphones", "gaming audio"],
  "limit": 10
}
```

### Search Suggestions

#### GET `/api/v1/ai/suggestions`
Get AI-powered search suggestions.

**Query Parameters:**
- `q` (required): Partial search query
- `limit`: Number of suggestions (default: 5, max: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "query": "gaming headphones",
      "category": "Headphones",
      "confidence": 0.95
    },
    {
      "query": "gaming headphones wireless",
      "category": "Headphones",
      "confidence": 0.88
    }
  ]
}
```

### Chatbot

#### POST `/api/v1/ai/chat`
Get AI chatbot response.

**Request Body:**
```json
{
  "message": "Can you recommend headphones for gaming?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hi, I'm looking for audio equipment"
    },
    {
      "role": "assistant",
      "content": "Hello! I can help you find the perfect audio equipment..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "For gaming, I recommend headphones with low latency and good spatial audio...",
    "suggestedProducts": [
      {
        "id": "prod_456",
        "name": "Gaming Headphones Pro",
        "slug": "gaming-headphones-pro",
        "price": 1999000,
        "image": "https://...",
        "reason": "Perfect for gaming",
        "relevanceScore": 92
      }
    ],
    "suggestedSearches": [
      {
        "query": "gaming headphones low latency",
        "confidence": 0.9
      }
    ],
    "confidence": 0.85,
    "conversationContext": {
      "messageCount": 3
    }
  }
}
```

#### POST `/api/v1/ai/conversation`
Continue multi-turn conversation.

**Request Body:**
```json
{
  "conversationId": "conv_123",
  "message": "What about wireless options?",
  "history": [
    {
      "role": "user",
      "content": "I need gaming headphones"
    },
    {
      "role": "assistant",
      "content": "Gaming headphones should have low latency..."
    }
  ]
}
```

### Message Analysis

#### POST `/api/v1/ai/analyze` (Admin Only)
Analyze user message for sentiment, keywords, and intent.

**Request Body:**
```json
{
  "message": "These headphones are amazing! Best purchase ever!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sentiment": "positive",
    "keywords": ["headphones", "amazing", "purchase"],
    "intent": "product_recommendation",
    "confidence": 0.85
  }
}
```

### Service Status

#### GET `/api/v1/ai/status`
Check AI service status and availability.

**Response:**
```json
{
  "success": true,
  "data": {
    "geminiAvailable": true,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Installation & Setup

### 1. Install Dependencies
Dependencies are already included in package.json. If needed:

```bash
npm install
```

### 2. Configure Google Gemini API

#### Get API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key

#### Add to Environment
```env
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

### 3. Enable Module in App Module
```typescript
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    // ... other imports
    AiModule,
  ],
})
export class AppModule {}
```

## Usage Examples

### Get Recommendations
```typescript
// Basic recommendation
const response = await fetch('/api/v1/ai/recommendations?limit=5');
const { data: recommendations } = await response.json();

// With filters
const filtered = await fetch(
  '/api/v1/ai/recommendations?category=cat_123&minBudget=1000000&maxBudget=5000000'
);
```

### Search Suggestions
```typescript
const response = await fetch('/api/v1/ai/suggestions?q=head&limit=5');
const { data: suggestions } = await response.json();
suggestions.forEach(s => console.log(s.query));
```

### Chatbot Integration
```typescript
const response = await fetch('/api/v1/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What headphones do you recommend?'
  })
});
const { data } = await response.json();
console.log(data.message);
console.log(data.suggestedProducts);
```

### React Hook for Chatbot
```typescript
import { useState } from 'react';

export function useChatbot() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    setLoading(true);
    const response = await fetch('/api/v1/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        conversationHistory: messages
      })
    });

    const { data } = await response.json();
    setMessages([
      ...messages,
      { role: 'user', content: text },
      { role: 'assistant', content: data.message }
    ]);
    setLoading(false);

    return data;
  };

  return { messages, sendMessage, loading };
}
```

## Recommendation Scoring Algorithm

The service uses a multi-factor scoring system:

### Scoring Components
1. **View Count** (0-30 points)
   - Popular products get higher scores
   - Formula: min(30, viewCount / 10)

2. **Review Rating** (0-30 points)
   - Average rating weighted heavily
   - Formula: avgRating * 6

3. **Cart Popularity** (0-20 points)
   - Products frequently added to carts score higher
   - Formula: min(20, cartCount * 2)

4. **Search History Match** (0-20 points)
   - Products matching user's past searches get bonus
   - Complete category/brand match: 20 points

**Total Score**: 0-100 points

## Sentiment Analysis

Simple pattern-based sentiment detection:

### Positive Indicators
- "love", "great", "excellent", "perfect", "amazing", "best"
- Weights: +1 each

### Negative Indicators
- "hate", "bad", "terrible", "worst", "problem", "issue", "broken"
- Weights: -1 each

**Sentiment**:
- Score > 0 = Positive
- Score < 0 = Negative
- Score = 0 = Neutral

## Intent Recognition

Patterns for different intents:

1. **product_recommendation**: "recommend", "suggestion", "what to buy", "looking for"
2. **question**: "how", "what", "why", "when", "where"
3. **shopping**: "buy", "purchase", "order", "checkout"
4. **support**: "help", "support", "issue", "problem"
5. **general**: Default intent

## Fallback Behavior

When Google Gemini API is unavailable:

- **Recommendations**: Uses local database scoring
- **Search Suggestions**: Uses database prefix matching
- **Chatbot**: Uses rule-based templates
- **Analysis**: Uses pattern-based detection

The service gracefully degrades - features still work with reduced capabilities.

## Configuration

### Environment Variables
```env
# Google Gemini API
GOOGLE_GEMINI_API_KEY=your_key_here

# AI Service Settings
AI_RECOMMENDATION_LIMIT=10
AI_SUGGESTION_LIMIT=5
AI_CHATBOT_TIMEOUT=10000
```

### Model Configuration
```typescript
// Max tokens for Gemini responses
const maxTokens = 1000;

// Temperature for response variability
const temperature = 0.7;

// Request timeout
const timeout = 10000; // 10 seconds
```

## Performance Optimization

### 1. Caching
- Cache popular recommendations
- Store suggestion history
- Cache product data for scoring

### 2. Database Optimization
- Index product names and descriptions
- Index product categories and brands
- Denormalize common queries

### 3. API Efficiency
- Batch recommendation requests
- Implement rate limiting per user
- Use connection pooling

## Error Handling

### API Errors
```typescript
try {
  const response = await this.aiService.getProductRecommendations();
} catch (error) {
  if (error.code === 'GOOGLE_API_ERROR') {
    // Use fallback
  } else {
    // Handle other errors
  }
}
```

### Timeout Handling
- Requests timeout after 10 seconds
- Graceful fallback to simpler methods
- User-friendly error messages

## Security Considerations

1. **API Key Protection**: Never expose API key in frontend
2. **Rate Limiting**: Limit requests per user
3. **Input Validation**: Validate all user messages
4. **Authentication**: Require auth for advanced features
5. **Data Privacy**: Don't store sensitive user data

## Monitoring

### Health Checks
```typescript
const status = await this.aiService.isGeminiAvailable();
if (!status) {
  logger.warn('Gemini API unavailable - using fallback');
}
```

### Logging
- Log all AI requests
- Track response times
- Monitor API errors
- Record user satisfaction

## Testing

### Unit Tests
```typescript
describe('AiService', () => {
  it('should generate recommendations', async () => {
    const recommendations = await aiService.getProductRecommendations();
    expect(recommendations).toHaveLength(5);
  });

  it('should analyze message sentiment', async () => {
    const analysis = await aiService.analyzeMessage('Great product!');
    expect(analysis.sentiment).toBe('positive');
  });
});
```

### Integration Tests
```typescript
describe('AI Module', () => {
  it('should respond to chatbot requests', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/ai/chat')
      .send({ message: 'Hello' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toBeDefined();
  });
});
```

## Future Enhancements

1. **Personalization**: Machine learning models for user preferences
2. **Embeddings**: Semantic search using vector embeddings
3. **Multi-language**: Support for Vietnamese and other languages
4. **Image Recognition**: Analyze product images
5. **Voice Support**: Process voice inputs for accessibility
6. **Context Memory**: Better conversation context handling
7. **A/B Testing**: Test different recommendation strategies

## Troubleshooting

### API Key Invalid
- Verify key in environment variables
- Check API quota and billing
- Regenerate key if needed

### No Recommendations
- Check database has active products
- Verify scoring algorithm
- Check debug logs

### Slow Responses
- Implement caching
- Optimize database queries
- Use connection pooling

### Wrong Sentiment Detection
- Use ML model for better accuracy
- Implement more sophisticated NLP
- Add custom training data

## Support

For issues or questions about the AI Module, please:
1. Check the documentation
2. Review error logs
3. Contact the development team
4. Open an issue in the project repository

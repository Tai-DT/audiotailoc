# AI-Powered Features Documentation

## Overview

Audio Tài Lộc backend now includes comprehensive AI-powered features that leverage Google's Gemini AI to provide intelligent services for content generation, analysis, and business intelligence.

## Base URL

```
http://localhost:3010/api/v1/ai
```

## Authentication

Most endpoints require JWT authentication. Admin-only endpoints require both JWT and Admin guards.

## Core AI Features

### 1. Content Generation

**Endpoint:** `POST /ai/generate-content`

Generate various types of content using AI.

**Request Body:**
```json
{
  "prompt": "Viết mô tả sản phẩm tai nghe cao cấp",
  "type": "product_description",
  "tone": "professional",
  "maxLength": 300
}
```

**Parameters:**
- `prompt` (required): The main prompt for content generation
- `type` (optional): Content type - `product_description`, `email_template`, `marketing_copy`, `faq`, `blog_post`
- `tone` (optional): Writing tone - `professional`, `casual`, `friendly`, `formal`
- `maxLength` (optional): Maximum character length (50-2000)

**Response:**
```json
{
  "success": true,
  "content": "Generated content here...",
  "metadata": {
    "type": "product_description",
    "tone": "professional",
    "length": 245,
    "generatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Sentiment Analysis

**Endpoint:** `POST /ai/analyze-sentiment`

Analyze the sentiment of text content.

**Request Body:**
```json
{
  "text": "Sản phẩm này thật tuyệt vời! Tôi rất hài lòng với chất lượng.",
  "context": "customer_feedback"
}
```

**Response:**
```json
{
  "success": true,
  "sentiment": "positive",
  "confidence": 0.95,
  "emotions": ["joy", "satisfaction"],
  "score": 0.8,
  "text": "Sản phẩm này thật tuyệt vời! Tôi rất hài lòng với chất lượng."
}
```

### 3. Text Classification

**Endpoint:** `POST /ai/classify-text`

Classify text into predefined categories.

**Request Body:**
```json
{
  "text": "Tôi muốn mua tai nghe bluetooth",
  "categories": ["purchase_inquiry", "technical_support", "complaint", "general_question"]
}
```

**Response:**
```json
{
  "success": true,
  "category": "purchase_inquiry",
  "confidence": 0.92,
  "alternatives": ["general_question"],
  "text": "Tôi muốn mua tai nghe bluetooth"
}
```

### 4. Language Detection

**Endpoint:** `POST /ai/detect-language`

Detect the language of text content.

**Request Body:**
```json
{
  "text": "Hello, I would like to buy headphones"
}
```

**Response:**
```json
{
  "success": true,
  "language": "en",
  "confidence": 0.98,
  "name": "Tiếng Anh",
  "text": "Hello, I would like to buy headphones"
}
```

### 5. Text Summarization

**Endpoint:** `POST /ai/summarize-text`

Summarize long text content.

**Request Body:**
```json
{
  "text": "Long text content here...",
  "maxSentences": 3
}
```

**Response:**
```json
{
  "success": true,
  "summary": "Summarized text here...",
  "originalLength": 500,
  "summaryLength": 150,
  "compressionRatio": 70
}
```

### 6. Keyword Extraction

**Endpoint:** `POST /ai/extract-keywords`

Extract important keywords from text.

**Request Body:**
```json
{
  "text": "Tai nghe bluetooth không dây với công nghệ noise cancellation",
  "maxKeywords": 5
}
```

**Response:**
```json
{
  "success": true,
  "keywords": [
    {
      "word": "tai nghe",
      "weight": 0.9,
      "frequency": 1
    },
    {
      "word": "bluetooth",
      "weight": 0.8,
      "frequency": 1
    }
  ],
  "text": "Tai nghe bluetooth không dây với công nghệ noise cancellation"
}
```

### 7. Translation

**Endpoint:** `POST /ai/translate`

Translate text between languages.

**Request Body:**
```json
{
  "text": "Tôi muốn mua tai nghe",
  "targetLanguage": "English",
  "sourceLanguage": "Vietnamese"
}
```

**Response:**
```json
{
  "success": true,
  "original": "Tôi muốn mua tai nghe",
  "translation": "I want to buy headphones",
  "sourceLanguage": "Vietnamese",
  "targetLanguage": "English",
  "length": 25
}
```

## Business-Specific Features

### 8. Customer Intent Detection

**Endpoint:** `POST /ai/detect-intent`

Analyze customer messages to understand their intent.

**Request Body:**
```json
{
  "message": "Tôi đang tìm kiếm tai nghe có giá dưới 1 triệu đồng",
  "userId": "user_123",
  "sessionId": "session_456"
}
```

**Response:**
```json
{
  "success": true,
  "intent": "purchase",
  "confidence": 0.88,
  "entities": ["price_range", "product_type"],
  "urgency": "medium",
  "suggestedAction": "recommend_product",
  "message": "Tôi đang tìm kiếm tai nghe có giá dưới 1 triệu đồng",
  "userId": "user_123",
  "sessionId": "session_456"
}
```

### 9. Predictive Analytics

**Endpoint:** `POST /ai/predictive-analytics`

Get predictive insights for business metrics.

**Request Body:**
```json
{
  "metric": "sales",
  "dateFrom": "2024-01-01",
  "dateTo": "2024-12-31"
}
```

**Response:**
```json
{
  "success": true,
  "metric": "sales",
  "prediction": {
    "trend": "up",
    "confidence": 0.85,
    "nextPeriod": 125000
  },
  "period": {
    "from": "2024-01-01",
    "to": "2024-12-31"
  },
  "factors": ["seasonal_trend", "marketing_campaign"],
  "confidence": 0.85
}
```

### 10. Personalization

**Endpoint:** `POST /ai/personalize`

Get personalized recommendations for users.

**Request Body:**
```json
{
  "userId": "user_123",
  "context": "homepage"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "user_123",
  "recommendations": [
    {
      "productId": "prod_1",
      "score": 0.95,
      "reason": "Based on your category preferences"
    }
  ],
  "preferences": {
    "categories": {"headphones": 3},
    "priceRange": {"min": 500000, "max": 2000000},
    "totalOrders": 5
  },
  "context": "homepage",
  "generatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Advanced Features (Stubs)

### 11. Image Analysis

**Endpoint:** `POST /ai/analyze-image`

Analyze image content (requires Vision API integration).

**Request Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "analysisType": "general"
}
```

### 12. Voice to Text

**Endpoint:** `POST /ai/voice-to-text`

Convert speech to text (requires Speech-to-Text API).

**Request Body:**
```json
{
  "audioUrl": "https://example.com/audio.mp3",
  "language": "vi"
}
```

### 13. Text to Speech

**Endpoint:** `POST /ai/text-to-speech`

Convert text to speech (requires Text-to-Speech API).

**Request Body:**
```json
{
  "text": "Xin chào, đây là test text to speech",
  "voice": "default",
  "language": "vi"
}
```

## System Features

### 14. AI Health Check

**Endpoint:** `GET /ai/health`

Check the health status of AI services.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "services": {
    "gemini": "healthy",
    "embedding": "healthy",
    "database": "healthy"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### 15. AI Capabilities

**Endpoint:** `GET /ai/capabilities`

Get information about available AI capabilities.

**Response:**
```json
{
  "success": true,
  "capabilities": [
    {
      "name": "content_generation",
      "description": "Tạo nội dung tự động",
      "enabled": true,
      "models": ["gemini-pro"]
    }
  ],
  "models": {
    "gemini-pro": {
      "status": "active",
      "maxTokens": 32000,
      "supportedFeatures": ["text", "code", "reasoning"]
    }
  }
}
```

## Admin-Only Features

### 16. AI Model Training

**Endpoint:** `POST /ai/train-model` (Admin only)

Start AI model training jobs.

**Request Body:**
```json
{
  "modelType": "chatbot",
  "trainingData": "path/to/data"
}
```

### 17. AI Performance Monitoring

**Endpoint:** `GET /ai/performance` (Admin only)

Get AI performance metrics.

**Query Parameters:**
- `modelType`: Specific model to monitor
- `dateFrom`: Start date for metrics
- `dateTo`: End date for metrics

### 18. Batch Processing

**Endpoint:** `POST /ai/batch-process` (Admin only)

Process multiple items in batch.

**Request Body:**
```json
{
  "operation": "sentiment_analysis",
  "data": [
    {"id": "1", "text": "Text 1"},
    {"id": "2", "text": "Text 2"}
  ],
  "options": {
    "batchSize": 10
  }
}
```

### 19. AI Model Management

**Endpoints:**
- `GET /ai/models` - List available models
- `PUT /ai/models/:modelId` - Update model configuration
- `DELETE /ai/models/:modelId` - Delete model

### 20. AI Configuration

**Endpoints:**
- `GET /ai/config` - Get AI configuration
- `PUT /ai/config` - Update AI configuration

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Rate Limiting

AI endpoints are subject to rate limiting:
- 100 requests per 15 minutes per IP
- Health check endpoints are excluded from rate limiting

## Testing

Use the provided test script to verify all AI features:

```bash
cd backend
node test-ai-features.js
```

## Integration Examples

### Frontend Integration

```javascript
// Content generation
const response = await fetch('/api/v1/ai/generate-content', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    prompt: 'Write a product description',
    type: 'product_description',
    tone: 'professional'
  })
});

const result = await response.json();
```

### Chatbot Integration

```javascript
// Customer intent detection
const intent = await fetch('/api/v1/ai/detect-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    userId: currentUser.id
  })
});

// Route based on intent
if (intent.suggestedAction === 'recommend_product') {
  // Show product recommendations
} else if (intent.suggestedAction === 'escalate') {
  // Escalate to human agent
}
```

## Future Enhancements

1. **Real-time Streaming**: Implement Server-Sent Events for real-time AI responses
2. **Multi-modal Support**: Add support for image and audio processing
3. **Custom Models**: Allow training of custom AI models
4. **Advanced Analytics**: Implement more sophisticated predictive analytics
5. **Integration APIs**: Add support for third-party AI services

## Support

For questions and support regarding AI features:
- Check the API documentation at `/docs`
- Review the test examples in `test-ai-features.js`
- Contact the development team for advanced usage

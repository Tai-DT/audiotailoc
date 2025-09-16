# Dashboard-Backend Integration Documentation

## Overview
This document describes the integration between the dashboard and backend services, including real-time communication via WebSocket.

## Key Changes Implemented

### 1. API Integration Library (`lib/api.ts`)
- Centralized API client with automatic authentication
- Handles JWT token from localStorage, sessionStorage, or next-auth session
- Base URL: `http://localhost:3010/api/v1` (configurable via env)
- Automatic error handling and response transformation
- Methods: `get()`, `post()`, `put()`, `patch()`, `delete()`

### 2. WebSocket Integration (`lib/socket.ts`)
- Real-time communication using Socket.io client
- Auto-reconnection with configurable attempts
- Event-based messaging system
- Supports notification events (chat feature removed)
- Connection URL: `http://localhost:3010` (configurable via env)

### 3. Customer Support Integration (Zalo)

#### Note: Chat feature has been removed and replaced with Zalo customer support.

#### Previous Chat API Endpoints (No longer available):
- `GET /ai/chat-sessions` - Fetch all conversations
- `GET /ai/chat-sessions/:id` - Fetch messages for a conversation
- `POST /ai/chat` - Send a message
- `PATCH /ai/chat-sessions/:id/read` - Mark conversation as read
- `PATCH /ai/chat-sessions/:id` - Update conversation status
- `DELETE /ai/chat-sessions/:id` - Delete conversation

#### Previous WebSocket Events (No longer available):
- `chat:newMessage` - New message received
- `chat:aiResponse` - AI assistant response
- `chat:sessionUpdate` - Conversation status update
- `join_session` - Join a chat session
- `leave_session` - Leave a chat session
- `send_message` - Send a message via WebSocket
- `typing` - Typing indicator

#### Current WebSocket Events (Notifications only):
- `notification:new` - New notification received
- `notification:update` - Notification status update

### 4. Notification System Integration (`hooks/use-notifications.ts`)

#### API Endpoints Used:
- `GET /notifications` - Fetch all notifications
- `POST /notifications/mark-read` - Mark single notification as read
- `POST /notifications/mark-all-read` - Mark all notifications as read

#### WebSocket Events:
- `notification:new` - New notification received
- `notification:update` - Notification updated

#### Features:
- Real-time toast notifications
- Desktop notifications (with permission)
- Sound notifications (configurable)
- Auto-refresh on new notifications

## Environment Configuration

### Required Environment Variables:
```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1

# WebSocket URL
NEXT_PUBLIC_WS_URL=http://localhost:3010

# Cloudinary Configuration (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dib7tbv7w
```

## Authentication Flow

1. **Token Retrieval Priority:**
   - localStorage (`accessToken`)
   - sessionStorage (`accessToken`)
   - Next-auth session (`/api/auth/session`)

2. **Token Usage:**
   - HTTP requests: Added as `Authorization: Bearer <token>` header
   - WebSocket: Passed in auth object during connection

## Real-time Features

### Chat Messages (Feature Removed)
- Chat feature has been completely removed
- Customer support now handled via Zalo integration
- Previous functionality: Messages sent via WebSocket when connected, fallback to API
- Previous functionality: Optimistic UI updates for better UX
- Previous functionality: Automatic message status updates (sent → delivered → read)
- Previous functionality: Typing indicators for multi-user chat

### Notifications
- Instant push notifications via WebSocket
- Multiple notification types: info, success, warning, error
- Sound and desktop notification support
- Unread count badges auto-update

## Error Handling

- Network errors display user-friendly toast messages
- API errors are logged to console for debugging
- WebSocket disconnections trigger auto-reconnect
- Fallback to API calls when WebSocket unavailable

## Testing Checklist

### Backend Setup:
```bash
cd backend
npm run start:dev  # Runs on port 3010
```

### Dashboard Setup:
```bash
cd dashboard
cp .env.local.example .env.local  # Update with correct URLs
npm install
npm run dev  # Runs on port 3001
```

### Test Scenarios:
1. ✅ Send message from dashboard → appears in real-time
2. ✅ Receive notification → toast and badge update
3. ✅ Mark messages/notifications as read → UI updates
4. ✅ WebSocket disconnect → auto-reconnect works
5. ✅ API errors → graceful degradation

## Known Issues & Improvements

### Current Limitations:
1. User ID currently hardcoded as 'admin' in notifications
2. Authentication token management could be improved
3. No offline message queue

### Future Improvements:
1. Implement proper JWT refresh token flow
2. Add notification retry queue for offline scenarios
3. Enhance Zalo customer support integration
4. Add file upload support for customer inquiries
5. Implement notification search functionality

## Migration Notes

### From Mock Data to Real API:
- All mock setTimeout delays removed
- Mock data generators replaced with API calls
- Static arrays replaced with dynamic state management
- Hard-coded IDs replaced with backend-generated IDs

### Data Transformation:
- Backend role mapping: USER → customer, ASSISTANT → assistant, STAFF → admin
- Date handling: Backend ISO strings converted to Date objects
- Status mapping maintained for backward compatibility

## Security Considerations

1. **Token Storage:**
   - Consider using httpOnly cookies for production
   - Implement token rotation
   - Add token expiry handling

2. **WebSocket Security:**
   - Validate all incoming messages
   - Implement rate limiting
   - Add message sanitization

3. **API Security:**
   - All requests require authentication
   - CORS configured for allowed origins
   - Input validation on all endpoints

## Deployment Considerations

### Environment Variables:
- Update `NEXT_PUBLIC_API_URL` to production backend URL
- Update `NEXT_PUBLIC_WS_URL` to use WSS in production
- Ensure Cloudinary configuration is production-ready

### Performance Optimizations:
- Implement message pagination for large conversations
- Add virtual scrolling for long message lists
- Cache frequently accessed data
- Optimize WebSocket reconnection strategy

## Support & Maintenance

### Logging:
- All API errors logged to console
- WebSocket events logged for debugging
- Consider adding production error tracking (Sentry)

### Monitoring:
- Track WebSocket connection stability
- Monitor API response times
- Track notification delivery rates
- Monitor real-time message latency

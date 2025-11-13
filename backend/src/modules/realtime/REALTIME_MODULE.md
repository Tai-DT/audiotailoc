# Real-time Module Documentation

## Overview

The Real-time Module provides WebSocket-based real-time communication for the AudioTaiLoc platform. It enables live updates for orders, bookings, notifications, and live chat functionality with minimal latency.

## Features

### 1. Order Updates
- Real-time order status changes
- Order progress tracking
- Payment notifications

### 2. Booking Notifications
- Service booking status updates
- Appointment reminders
- Booking confirmations

### 3. Live Chat
- Real-time messaging
- Conversation management
- Multi-user support

### 4. Inventory Alerts
- Stock level notifications
- Product availability changes
- Low inventory warnings

### 5. User Presence
- Track online/offline status
- User connection count
- Real-time user list

## WebSocket Events

### Connection

#### `connect`
Established when client connects to WebSocket server.

**Authentication:**
- Token passed via `auth.token` in handshake
- Or via `Authorization` header
- JWT token validation required for user-specific updates

#### `disconnect`
Triggered when client disconnects from server.

### Order Events

#### `order:subscribe`
Subscribe to updates for a specific order.

**Payload:**
```json
{
  "orderId": "order_123"
}
```

**Response:**
```json
{
  "success": true,
  "room": "order:order_123"
}
```

#### `order:updated` (Broadcast)
Emitted when order status changes.

**Payload:**
```json
{
  "orderId": "order_123",
  "status": "shipped",
  "data": {
    "total": 299.99,
    "itemCount": 2,
    "customerEmail": "user@example.com"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Booking Events

#### `booking:subscribe`
Subscribe to updates for a specific booking.

**Payload:**
```json
{
  "bookingId": "booking_456"
}
```

#### `booking:updated` (Broadcast)
Emitted when booking status changes.

**Payload:**
```json
{
  "bookingId": "booking_456",
  "status": "confirmed",
  "data": {
    "serviceName": "Professional Audio Setup",
    "scheduledDate": "2024-01-20T14:00:00Z",
    "customerEmail": "user@example.com"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Chat Events

#### `chat:subscribe`
Subscribe to a conversation.

**Payload:**
```json
{
  "conversationId": "conv_789"
}
```

#### `chat:message`
Send a message in a conversation.

**Payload:**
```json
{
  "conversationId": "conv_789",
  "message": "Hello, can you help me choose headphones?"
}
```

**Response:**
```json
{
  "success": true,
  "id": "msg_123"
}
```

#### `chat:message` (Broadcast)
Received when another user sends a message in the conversation.

**Payload:**
```json
{
  "id": "msg_123",
  "conversationId": "conv_789",
  "userId": "user_456",
  "email": "user@example.com",
  "message": "Hello, can you help me choose headphones?",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Notification Events

#### `notification:message`
Direct user notification.

**Payload:**
```json
{
  "type": "order_shipped",
  "title": "Your order has shipped!",
  "message": "Track your package using tracking number: ABC123",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### `notification:event`
Custom event notification.

**Payload:**
```json
{
  "event": "inventory_alert",
  "productId": "prod_123",
  "productName": "Gaming Headphones",
  "message": "Product is back in stock!",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### System Events

#### `user:online`
Broadcast when user comes online.

**Payload:**
```json
{
  "userId": "user_123",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### `user:offline`
Broadcast when user goes offline.

**Payload:**
```json
{
  "userId": "user_123",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### `ping`/`pong`
Connection health check.

## Installation & Setup

### 1. Install Dependencies
The module requires Socket.IO which is already included in package.json:

```bash
npm install
```

### 2. Enable Module in App Module
```typescript
import { RealtimeModule } from './modules/realtime/realtime.module';

@Module({
  imports: [
    // ... other imports
    RealtimeModule,
  ],
})
export class AppModule {}
```

### 3. Configure WebSocket in main.ts
```typescript
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(3000);
}
```

## Client Usage

### JavaScript/TypeScript (Socket.IO Client)

#### Installation
```bash
npm install socket.io-client
```

#### Basic Connection
```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/api/v1/realtime', {
  auth: {
    token: 'your-jwt-token-here'
  },
  transports: ['websocket', 'polling']
});

// Connection listeners
socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
```

#### Subscribe to Order Updates
```typescript
// Subscribe
socket.emit('order:subscribe', { orderId: 'order_123' }, (response) => {
  console.log('Subscribed:', response);
});

// Listen for updates
socket.on('order:updated', (data) => {
  console.log('Order updated:', data);
  // Update UI with new order status
});

// Unsubscribe
socket.emit('order:unsubscribe', { orderId: 'order_123' });
```

#### Subscribe to Booking Updates
```typescript
socket.emit('booking:subscribe', { bookingId: 'booking_456' });

socket.on('booking:updated', (data) => {
  console.log('Booking updated:', data);
});
```

#### Send Chat Message
```typescript
socket.emit('chat:subscribe', { conversationId: 'conv_789' });

socket.emit('chat:message', {
  conversationId: 'conv_789',
  message: 'Hello!'
});

socket.on('chat:message', (message) => {
  console.log('New message:', message);
  // Add to chat UI
});
```

#### Listen to Notifications
```typescript
socket.on('notification:message', (notification) => {
  console.log('New notification:', notification);
  // Show notification to user
});

socket.on('notification:order_updated', (data) => {
  console.log('Order notification:', data);
});
```

### React Example
```typescript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function OrderTracker({ orderId, token }) {
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const socket = io('http://localhost:3000/api/v1/realtime', {
      auth: { token }
    });

    socket.on('connect', () => {
      socket.emit('order:subscribe', { orderId });
    });

    socket.on('order:updated', (data) => {
      setStatus(data.status);
    });

    return () => {
      socket.emit('order:unsubscribe', { orderId });
      socket.disconnect();
    };
  }, [orderId, token]);

  return <div>Order Status: {status}</div>;
}
```

## Backend Usage

### Inject RealtimeService
```typescript
import { RealtimeService } from './modules/realtime/realtime.service';

@Injectable()
export class OrderService {
  constructor(private realtimeService: RealtimeService) {}

  async updateOrderStatus(orderId: string, newStatus: string) {
    // Update order in database
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });

    // Notify all subscribers
    await this.realtimeService.notifyOrderStatusChange(
      orderId,
      newStatus,
      userId
    );
  }
}
```

### Notify User
```typescript
// Direct notification
this.realtimeService.notifyUser('user_123', {
  type: 'payment_received',
  message: 'Payment confirmed!'
});

// Broadcast to multiple users
this.realtimeService.notifyUsers(['user_123', 'user_456'], {
  type: 'sale_announcement',
  message: 'New products available!'
});

// Broadcast to all
this.realtimeService.broadcastToAll('maintenance', {
  message: 'System maintenance scheduled for tonight'
});
```

## Configuration

### Environment Variables
```env
# WebSocket configuration
WEBSOCKET_NAMESPACE=/api/v1/realtime
WEBSOCKET_TRANSPORTS=websocket,polling
WEBSOCKET_CORS_ORIGIN=*

# Connection timeouts
WEBSOCKET_PING_INTERVAL=25000
WEBSOCKET_PING_TIMEOUT=60000
```

## Performance Optimization

### 1. Room Management
- Use rooms for targeted updates instead of broadcasting
- Reduces bandwidth and improves latency

### 2. Message Throttling
- Implement throttling for high-frequency events
- Prevents overwhelming the client

### 3. Connection Pooling
- Use namespace segmentation
- Distribute load across multiple connection pools

### 4. Compression
- Enable Socket.IO compression for large payloads
- Reduces bandwidth usage

## Error Handling

### Connection Failures
```typescript
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  // Implement reconnection logic
});
```

### Message Errors
```typescript
socket.emit('order:subscribe', { orderId }, (response) => {
  if (!response.success) {
    console.error('Subscription failed:', response.error);
  }
});
```

## Security Considerations

1. **Authentication**: All connections require valid JWT tokens
2. **Room Isolation**: Users can only access their own order/booking/chat rooms
3. **Rate Limiting**: Implement rate limiting on message sending
4. **Input Validation**: All messages are validated before processing
5. **HTTPS/WSS**: Use secure WebSocket connections in production

## Monitoring & Analytics

### Get Real-time Statistics
```typescript
const stats = this.realtimeService.getRealtimeStats();
console.log(`Connected users: ${stats.connectedUsers}`);
```

### Monitor Connections
```typescript
// Periodically log connection stats
setInterval(() => {
  const stats = this.realtimeService.getRealtimeStats();
  logger.info(`Active connections: ${stats.connectedUsers}`);
}, 60000);
```

## Troubleshooting

### Connection Issues
- Check JWT token validity
- Verify WebSocket namespace URL
- Check CORS configuration

### Missing Updates
- Verify room subscription
- Check browser console for errors
- Verify user is authenticated

### Performance Issues
- Reduce message frequency
- Implement client-side caching
- Use message throttling

## Future Enhancements

1. **Presence Detection**: Show who's typing, viewing products
2. **Message History**: Store and retrieve chat history
3. **Read Receipts**: Confirm message delivery
4. **Video/Audio**: Extend to multimedia support
5. **Analytics**: Track real-time metrics and user behavior

## Support

For issues or questions about the Real-time Module, please contact the development team.

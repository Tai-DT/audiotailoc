# API Documentation

## Authentication
- POST /auth/register - User registration
- POST /auth/login - User login
- POST /auth/refresh - Refresh token
- GET /auth/me - Get current user

## Products
- GET /catalog/products - List products
- GET /catalog/products/:id - Get product details
- POST /catalog/products - Create product (Admin)
- PUT /catalog/products/:id - Update product (Admin)
- DELETE /catalog/products/:id - Delete product (Admin)

## Orders
- GET /orders - List user orders
- POST /orders - Create order
- GET /orders/:id - Get order details
- PUT /orders/:id - Update order status

## Payments
- POST /payments/create-intent - Create payment intent
- POST /payments/confirm - Confirm payment
- GET /payments/:id - Get payment status

## Services
- GET /services - List services
- POST /services/book - Book service
- GET /services/bookings - List user bookings

## AI Features
- POST /ai/search - AI-powered search
- POST /ai/chat - AI chat support
- POST /ai/recommendations - Get AI recommendations

## Health Check
- GET /health - System health check

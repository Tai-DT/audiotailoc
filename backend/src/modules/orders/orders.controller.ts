import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, UseInterceptors, CacheInterceptor } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { CreateOrderDto, UpdateOrderStatusDto, OrderSearchDto } from './dto/order.dto';
import { OrderResponseDto, OrderSummaryDto, OrderAnalyticsDto } from './dto/response.dto';
import { BulkIdsDto } from '../common/dto/base.dto';
import {
  ApiStandardList,
  ApiStandardGet,
  ApiStandardCreate,
  ApiStandardUpdate,
  ApiErrorResponses,
  ApiAuthRequired,
  ApiAdminRequired,
  ApiBulkOperation,
} from '../common/decorators/swagger.decorators';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @UseGuards(AdminOrKeyGuard)
  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'List orders',
    description: 'Retrieve a paginated list of orders with advanced filtering options',
  })
  @ApiAuthRequired()
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderSummaryDto' },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number', example: 1 },
                pageSize: { type: 'number', example: 20 },
                total: { type: 'number', example: 150 },
                totalPages: { type: 'number', example: 8 },
                hasNext: { type: 'boolean', example: true },
                hasPrev: { type: 'boolean', example: false },
              },
            },
            summary: {
              type: 'object',
              properties: {
                totalRevenue: { type: 'number', example: 15000000 },
                averageOrderValue: { type: 'number', example: 100000 },
                ordersByStatus: { type: 'object' },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async listOrders(@Query() query: OrderSearchDto) {
    return this.orders.list(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new order',
    description: 'Create a new order with items and shipping information',
  })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Order data',
    examples: {
      basicOrder: {
        summary: 'Basic order example',
        value: {
          items: [
            {
              productId: '123e4567-e89b-12d3-a456-426614174000',
              quantity: 2,
              notes: 'Please check product condition',
            },
          ],
          shippingAddress: {
            fullName: 'Nguyen Van A',
            phone: '+84987654321',
            street: '123 Nguyen Trai Street',
            ward: 'Ward 1',
            district: 'District 1',
            city: 'Ho Chi Minh City',
            instructions: 'Ring the bell twice',
          },
          customerEmail: 'nguyen.van.a@email.com',
          shippingMethod: 'STANDARD',
          notes: 'Please call before delivery',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: '#/components/schemas/OrderResponseDto' },
      },
    },
  })
  @ApiErrorResponses()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orders.create(createOrderDto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get order details',
    description: 'Retrieve detailed information about a specific order',
  })
  @ApiAuthRequired()
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    type: OrderResponseDto,
  })
  @ApiErrorResponses()
  async getOrder(@Param('id') id: string) {
    return this.orders.get(id);
  }

  @UseGuards(AdminOrKeyGuard)
  @Patch(':id/status/:status')
  @ApiOperation({
    summary: 'Update order status',
    description: 'Update the status of an existing order with optional notes and tracking information',
  })
  @ApiAuthRequired()
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'status',
    description: 'New order status',
    enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'],
    example: 'CONFIRMED',
  })
  @ApiBody({
    type: UpdateOrderStatusDto,
    description: 'Status update data',
    required: false,
    examples: {
      confirmOrder: {
        summary: 'Confirm order',
        value: {
          status: 'CONFIRMED',
          notes: 'Order confirmed and being prepared for shipment',
        },
      },
      shipOrder: {
        summary: 'Ship order',
        value: {
          status: 'SHIPPED',
          notes: 'Order shipped via express delivery',
          trackingNumber: 'VN123456789',
          estimatedDeliveryDate: '2024-01-20T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            status: { type: 'string', example: 'CONFIRMED' },
            updatedAt: { type: 'string', example: '2024-01-15T11:00:00.000Z' },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async updateOrderStatus(
    @Param('id') id: string, 
    @Param('status') status: string,
    @Body() updateData?: UpdateOrderStatusDto,
  ) {
    return this.orders.updateStatus(id, status);
  }

  // Bulk operations
  @UseGuards(AdminOrKeyGuard)
  @Patch('bulk/status')
  @ApiBulkOperation('update status for', 'orders', {
    requireAuth: true,
  })
  async bulkUpdateStatus(
    @Body() body: { ids: string[]; status: string; notes?: string },
  ) {
    return this.orders.bulkUpdateStatus(body.ids, body.status, body.notes);
  }

  @UseGuards(AdminOrKeyGuard)
  @Post('bulk/export')
  @ApiOperation({
    summary: 'Export orders to CSV/Excel',
    description: 'Export filtered orders to CSV or Excel format',
  })
  @ApiAuthRequired()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        filters: { type: 'object', description: 'Order filters' },
        format: { type: 'string', enum: ['csv', 'excel'], default: 'csv' },
        fields: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Export file generated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            downloadUrl: { type: 'string', example: '/exports/orders-2024-01-15.csv' },
            filename: { type: 'string', example: 'orders-2024-01-15.csv' },
            recordCount: { type: 'number', example: 150 },
            expiresAt: { type: 'string', example: '2024-01-16T10:00:00.000Z' },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async exportOrders(
    @Body() body: { filters?: any; format?: 'csv' | 'excel'; fields?: string[] },
  ) {
    return this.orders.exportOrders(body.filters, body.format, body.fields);
  }

  // Order analytics
  @UseGuards(AdminOrKeyGuard)
  @Get('analytics/summary')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get order analytics summary',
    description: 'Get comprehensive order analytics including revenue, trends, and top products',
  })
  @ApiAuthRequired()
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['day', 'week', 'month', 'quarter', 'year'],
    description: 'Analytics period',
    example: 'month',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date (ISO 8601)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date (ISO 8601)',
    example: '2024-01-31T23:59:59.999Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Order analytics retrieved successfully',
    type: OrderAnalyticsDto,
  })
  @ApiErrorResponses()
  async getOrderAnalytics(
    @Query('period') period: string = 'month',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.orders.getAnalytics(period, startDate, endDate);
  }

  @UseGuards(AdminOrKeyGuard)
  @Get('analytics/revenue-trends')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get revenue trends',
    description: 'Get detailed revenue trends over time with breakdowns',
  })
  @ApiAuthRequired()
  @ApiQuery({
    name: 'groupBy',
    required: false,
    enum: ['hour', 'day', 'week', 'month'],
    description: 'Group data by time period',
    example: 'day',
  })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Number of days to include',
    example: 30,
  })
  @ApiResponse({
    status: 200,
    description: 'Revenue trends retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            trends: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  period: { type: 'string', example: '2024-01-15' },
                  orders: { type: 'number', example: 45 },
                  revenue: { type: 'number', example: 4500000 },
                  averageOrderValue: { type: 'number', example: 100000 },
                },
              },
            },
            summary: {
              type: 'object',
              properties: {
                totalRevenue: { type: 'number', example: 45000000 },
                totalOrders: { type: 'number', example: 450 },
                growthRate: { type: 'number', example: 15.5 },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getRevenueTrends(
    @Query('groupBy') groupBy: string = 'day',
    @Query('days') days: number = 30,
  ) {
    return this.orders.getRevenueTrends(groupBy, days);
  }

  // Customer orders
  @UseGuards(JwtGuard)
  @Get('my/orders')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get customer orders',
    description: 'Get orders for the authenticated customer',
  })
  @ApiAuthRequired()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    description: 'Filter by status',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer orders retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderSummaryDto' },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number', example: 1 },
                pageSize: { type: 'number', example: 10 },
                total: { type: 'number', example: 25 },
                totalPages: { type: 'number', example: 3 },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getCustomerOrders(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('status') status?: string,
  ) {
    // TODO: Get user ID from JWT token
    const userId = 'user-id-from-token';
    return this.orders.getCustomerOrders(userId, { page, pageSize, status });
  }

  // Order tracking
  @Get('track/:orderNumber')
  @ApiOperation({
    summary: 'Track order by order number',
    description: 'Track order status and shipping information using order number (public endpoint)',
  })
  @ApiParam({
    name: 'orderNumber',
    description: 'Order number',
    example: 'ORD-2024-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Order tracking information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            orderNumber: { type: 'string', example: 'ORD-2024-001' },
            status: { type: 'string', example: 'SHIPPED' },
            trackingNumber: { type: 'string', example: 'VN123456789' },
            estimatedDelivery: { type: 'string', example: '2024-01-20T10:00:00.000Z' },
            statusHistory: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'CONFIRMED' },
                  timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
                  notes: { type: 'string', example: 'Order confirmed' },
                },
              },
            },
            shippingInfo: {
              type: 'object',
              properties: {
                carrier: { type: 'string', example: 'Vietnam Post' },
                method: { type: 'string', example: 'EXPRESS' },
                trackingUrl: { type: 'string', example: 'https://tracking.vnpost.vn/VN123456789' },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async trackOrder(@Param('orderNumber') orderNumber: string) {
    return this.orders.trackOrder(orderNumber);
  }
}


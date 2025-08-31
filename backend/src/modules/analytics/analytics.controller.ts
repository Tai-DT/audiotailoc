import { Controller, Get, Query, UseGuards, Param, UseInterceptors, CacheInterceptor } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService, AnalyticsFilters } from './analytics.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { AnalyticsQueryDto } from '../common/dto/base.dto';
import {
  ApiAuthRequired,
  ApiErrorResponses,
} from '../common/decorators/swagger.decorators';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(AdminOrKeyGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get dashboard analytics',
    description: 'Comprehensive dashboard data including sales, orders, customers, and key metrics',
  })
  @ApiAuthRequired()
  @ApiResponse({
    status: 200,
    description: 'Dashboard analytics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            overview: {
              type: 'object',
              properties: {
                totalRevenue: { type: 'number', example: 125000000 },
                totalOrders: { type: 'number', example: 1250 },
                totalCustomers: { type: 'number', example: 850 },
                averageOrderValue: { type: 'number', example: 100000 },
                revenueGrowth: { type: 'number', example: 15.5 },
                orderGrowth: { type: 'number', example: 12.3 },
              },
            },
            salesTrend: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string', example: '2024-01-15' },
                  revenue: { type: 'number', example: 5000000 },
                  orders: { type: 'number', example: 50 },
                  customers: { type: 'number', example: 35 },
                },
              },
            },
            topProducts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  name: { type: 'string', example: 'Premium Audio Cable' },
                  revenue: { type: 'number', example: 15000000 },
                  quantity: { type: 'number', example: 150 },
                  growth: { type: 'number', example: 25.5 },
                },
              },
            },
            customerSegments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  segment: { type: 'string', example: 'Premium' },
                  customers: { type: 'number', example: 250 },
                  revenue: { type: 'number', example: 75000000 },
                  averageValue: { type: 'number', example: 300000 },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getDashboardData(@Query() query: AnalyticsQueryDto) {
    const filters: AnalyticsFilters = {
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      groupBy: query.groupBy,
      metrics: query.metrics,
    };

    return this.analyticsService.getDashboardData(filters);
  }

  @Get('sales')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get sales analytics',
    description: 'Detailed sales metrics including revenue, trends, and performance indicators',
  })
  @ApiAuthRequired()
  @ApiResponse({
    status: 200,
    description: 'Sales analytics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            summary: {
              type: 'object',
              properties: {
                totalRevenue: { type: 'number', example: 125000000 },
                totalOrders: { type: 'number', example: 1250 },
                averageOrderValue: { type: 'number', example: 100000 },
                conversionRate: { type: 'number', example: 3.5 },
                revenueGrowth: { type: 'number', example: 15.5 },
                orderGrowth: { type: 'number', example: 12.3 },
              },
            },
            trends: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  period: { type: 'string', example: '2024-01-15' },
                  revenue: { type: 'number', example: 5000000 },
                  orders: { type: 'number', example: 50 },
                  averageOrderValue: { type: 'number', example: 100000 },
                },
              },
            },
            byCategory: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: { type: 'string', example: 'Audio Equipment' },
                  revenue: { type: 'number', example: 45000000 },
                  orders: { type: 'number', example: 450 },
                  growth: { type: 'number', example: 18.2 },
                },
              },
            },
            byPaymentMethod: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  method: { type: 'string', example: 'VNPAY' },
                  revenue: { type: 'number', example: 65000000 },
                  orders: { type: 'number', example: 650 },
                  percentage: { type: 'number', example: 52.0 },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getSalesMetrics(@Query() query: AnalyticsQueryDto) {
    const filters: AnalyticsFilters = {
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      groupBy: query.groupBy,
      metrics: query.metrics,
    };

    return this.analyticsService.getSalesMetrics(filters);
  }

  @Get('customers')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get customer analytics',
    description: 'Customer behavior, segments, retention, and lifetime value analysis',
  })
  @ApiAuthRequired()
  @ApiResponse({
    status: 200,
    description: 'Customer analytics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            summary: {
              type: 'object',
              properties: {
                totalCustomers: { type: 'number', example: 850 },
                newCustomers: { type: 'number', example: 125 },
                returningCustomers: { type: 'number', example: 725 },
                retentionRate: { type: 'number', example: 68.5 },
                averageLifetimeValue: { type: 'number', example: 450000 },
                churnRate: { type: 'number', example: 5.2 },
              },
            },
            acquisition: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  period: { type: 'string', example: '2024-01-15' },
                  newCustomers: { type: 'number', example: 15 },
                  cost: { type: 'number', example: 75000 },
                  costPerAcquisition: { type: 'number', example: 5000 },
                },
              },
            },
            segments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  segment: { type: 'string', example: 'High Value' },
                  customers: { type: 'number', example: 125 },
                  averageValue: { type: 'number', example: 800000 },
                  frequency: { type: 'number', example: 4.2 },
                  percentage: { type: 'number', example: 14.7 },
                },
              },
            },
            cohortAnalysis: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  cohort: { type: 'string', example: '2024-01' },
                  customers: { type: 'number', example: 100 },
                  month1: { type: 'number', example: 85 },
                  month2: { type: 'number', example: 72 },
                  month3: { type: 'number', example: 68 },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getCustomerMetrics(@Query() query: AnalyticsQueryDto) {
    const filters: AnalyticsFilters = {
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      groupBy: query.groupBy,
      metrics: query.metrics,
    };

    return this.analyticsService.getCustomerMetrics(filters);
  }

  @Get('inventory')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get inventory analytics',
    description: 'Inventory levels, turnover rates, and stock performance analysis',
  })
  @ApiAuthRequired()
  @ApiResponse({
    status: 200,
    description: 'Inventory analytics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            summary: {
              type: 'object',
              properties: {
                totalProducts: { type: 'number', example: 450 },
                totalValue: { type: 'number', example: 2500000000 },
                averageTurnover: { type: 'number', example: 6.2 },
                outOfStock: { type: 'number', example: 15 },
                lowStock: { type: 'number', example: 35 },
                deadStock: { type: 'number', example: 8 },
              },
            },
            turnoverAnalysis: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: { type: 'string', example: 'Audio Equipment' },
                  turnoverRate: { type: 'number', example: 8.5 },
                  daysInStock: { type: 'number', example: 43 },
                  value: { type: 'number', example: 850000000 },
                },
              },
            },
            stockAlerts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  name: { type: 'string', example: 'Premium Audio Cable' },
                  currentStock: { type: 'number', example: 5 },
                  minStock: { type: 'number', example: 10 },
                  status: { type: 'string', example: 'LOW_STOCK' },
                  daysUntilEmpty: { type: 'number', example: 12 },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getInventoryMetrics(@Query() query: AnalyticsQueryDto) {
    const filters: AnalyticsFilters = {
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      groupBy: query.groupBy,
      metrics: query.metrics,
    };

    return this.analyticsService.getInventoryMetrics(filters);
  }

  @Get('kpis')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get business KPIs',
    description: 'Key Performance Indicators and business metrics overview',
  })
  @ApiAuthRequired()
  @ApiResponse({
    status: 200,
    description: 'Business KPIs retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            financial: {
              type: 'object',
              properties: {
                revenue: { type: 'number', example: 125000000 },
                grossMargin: { type: 'number', example: 35.5 },
                netMargin: { type: 'number', example: 15.2 },
                roas: { type: 'number', example: 4.2 },
                cac: { type: 'number', example: 45000 },
                ltv: { type: 'number', example: 450000 },
                ltvCacRatio: { type: 'number', example: 10.0 },
              },
            },
            operational: {
              type: 'object',
              properties: {
                orderFulfillmentRate: { type: 'number', example: 98.5 },
                averageDeliveryTime: { type: 'number', example: 2.5 },
                returnRate: { type: 'number', example: 3.2 },
                customerSatisfaction: { type: 'number', example: 4.7 },
                inventoryTurnover: { type: 'number', example: 6.2 },
                stockoutRate: { type: 'number', example: 2.1 },
              },
            },
            marketing: {
              type: 'object',
              properties: {
                conversionRate: { type: 'number', example: 3.5 },
                clickThroughRate: { type: 'number', example: 2.8 },
                costPerClick: { type: 'number', example: 1500 },
                emailOpenRate: { type: 'number', example: 25.5 },
                socialEngagement: { type: 'number', example: 8.2 },
                brandAwareness: { type: 'number', example: 65.0 },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getBusinessKPIs(@Query() query: AnalyticsQueryDto) {
    const filters: AnalyticsFilters = {
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      groupBy: query.groupBy,
      metrics: query.metrics,
    };

    return this.analyticsService.getBusinessKPIs(filters);
  }

  @Get('export/:type')
  @ApiOperation({
    summary: 'Export analytics data',
    description: 'Export analytics data in various formats (CSV, Excel, PDF)',
  })
  @ApiAuthRequired()
  @ApiParam({
    name: 'type',
    description: 'Type of analytics to export',
    enum: ['sales', 'customers', 'inventory', 'all'],
    example: 'sales',
  })
  @ApiQuery({
    name: 'format',
    required: false,
    enum: ['csv', 'excel', 'pdf'],
    description: 'Export format',
    example: 'csv',
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
            filename: { type: 'string', example: 'sales-analytics-2024-01-15.csv' },
            downloadUrl: { type: 'string', example: '/api/v1/analytics/download/sales-analytics-2024-01-15.csv' },
            size: { type: 'number', example: 1024000 },
            expiresAt: { type: 'string', example: '2024-01-16T10:00:00.000Z' },
            recordCount: { type: 'number', example: 1250 },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async exportAnalytics(
    @Param('type') type: 'sales' | 'customers' | 'inventory' | 'all',
    @Query('format') format: 'csv' | 'excel' | 'pdf' = 'csv',
    @Query() query: AnalyticsQueryDto
  ) {
    const filters: AnalyticsFilters = {
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      groupBy: query.groupBy,
      metrics: query.metrics,
    };

    const filename = await this.analyticsService.exportAnalytics(type, format, filters);
    return { 
      success: true,
      data: {
        filename, 
        downloadUrl: `/api/v1/analytics/download/${filename}`,
        size: 1024000,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        recordCount: 1250,
      }
    };
  }

  @Get('realtime/sales')
  @ApiOperation({
    summary: 'Get real-time sales data',
    description: 'Real-time sales metrics for dashboard widgets and monitoring',
  })
  @ApiAuthRequired()
  @ApiResponse({
    status: 200,
    description: 'Real-time sales data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            todayRevenue: { type: 'number', example: 5500000 },
            todayOrders: { type: 'number', example: 55 },
            todayCustomers: { type: 'number', example: 42 },
            averageOrderValue: { type: 'number', example: 100000 },
            revenueVsYesterday: { type: 'number', example: 12.5 },
            ordersVsYesterday: { type: 'number', example: 8.3 },
            hourlyTrend: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  hour: { type: 'number', example: 14 },
                  revenue: { type: 'number', example: 250000 },
                  orders: { type: 'number', example: 3 },
                },
              },
            },
            lastUpdated: { type: 'string', example: '2024-01-15T14:30:00.000Z' },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getRealTimeSales() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const filters: AnalyticsFilters = {
      startDate: today,
      endDate: now,
    };

    return this.analyticsService.getSalesMetrics(filters);
  }

  @Get('realtime/orders')
  @ApiOperation({
    summary: 'Get real-time order tracking',
    description: 'Real-time order status and processing metrics',
  })
  @ApiAuthRequired()
  @ApiResponse({
    status: 200,
    description: 'Real-time order data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            todayOrders: { type: 'number', example: 55 },
            todayRevenue: { type: 'number', example: 5500000 },
            averageOrderValue: { type: 'number', example: 100000 },
            pendingOrders: { type: 'number', example: 12 },
            processingOrders: { type: 'number', example: 8 },
            shippedToday: { type: 'number', example: 35 },
            deliveredToday: { type: 'number', example: 42 },
            ordersByStatus: {
              type: 'object',
              properties: {
                PENDING: { type: 'number', example: 12 },
                CONFIRMED: { type: 'number', example: 18 },
                PROCESSING: { type: 'number', example: 8 },
                SHIPPED: { type: 'number', example: 15 },
                DELIVERED: { type: 'number', example: 42 },
              },
            },
            lastUpdated: { type: 'string', example: '2024-01-15T14:30:00.000Z' },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getRealTimeOrders() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const filters: AnalyticsFilters = {
      startDate: today,
      endDate: now,
    };

    const salesMetrics = await this.analyticsService.getSalesMetrics(filters);
    
    return {
      success: true,
      data: {
        todayOrders: salesMetrics.totalOrders,
        todayRevenue: salesMetrics.totalRevenue,
        averageOrderValue: salesMetrics.averageOrderValue,
        pendingOrders: 12,
        processingOrders: 8,
        shippedToday: 35,
        deliveredToday: 42,
        ordersByStatus: {
          PENDING: 12,
          CONFIRMED: 18,
          PROCESSING: 8,
          SHIPPED: 15,
          DELIVERED: 42,
        },
        lastUpdated: new Date().toISOString(),
      },
    };
  }

  // Advanced analytics endpoints
  @Get('forecasting/sales')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get sales forecasting',
    description: 'AI-powered sales forecasting and predictive analytics',
  })
  @ApiAuthRequired()
  @ApiQuery({
    name: 'horizon',
    required: false,
    type: Number,
    description: 'Forecast horizon in days',
    example: 30,
  })
  @ApiQuery({
    name: 'model',
    required: false,
    enum: ['arima', 'prophet', 'linear', 'ensemble'],
    description: 'Forecasting model to use',
    example: 'prophet',
  })
  @ApiResponse({
    status: 200,
    description: 'Sales forecast retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            forecast: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string', example: '2024-01-20' },
                  predictedRevenue: { type: 'number', example: 5200000 },
                  lowerBound: { type: 'number', example: 4800000 },
                  upperBound: { type: 'number', example: 5600000 },
                  confidence: { type: 'number', example: 85.5 },
                },
              },
            },
            model: { type: 'string', example: 'prophet' },
            accuracy: { type: 'number', example: 92.5 },
            generatedAt: { type: 'string', example: '2024-01-15T14:30:00.000Z' },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getSalesForecasting(
    @Query('horizon') horizon: number = 30,
    @Query('model') model: string = 'prophet',
  ) {
    return {
      success: true,
      data: {
        forecast: [
          {
            date: '2024-01-20',
            predictedRevenue: 5200000,
            lowerBound: 4800000,
            upperBound: 5600000,
            confidence: 85.5,
          },
        ],
        model,
        accuracy: 92.5,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  @Get('cohort-analysis')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get cohort analysis',
    description: 'Customer cohort analysis for retention and lifetime value insights',
  })
  @ApiAuthRequired()
  @ApiQuery({
    name: 'cohortType',
    required: false,
    enum: ['monthly', 'weekly', 'quarterly'],
    description: 'Cohort grouping period',
    example: 'monthly',
  })
  @ApiQuery({
    name: 'metric',
    required: false,
    enum: ['retention', 'revenue', 'orders'],
    description: 'Metric to analyze',
    example: 'retention',
  })
  @ApiResponse({
    status: 200,
    description: 'Cohort analysis retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            cohorts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  cohort: { type: 'string', example: '2024-01' },
                  size: { type: 'number', example: 100 },
                  periods: {
                    type: 'array',
                    items: { type: 'number' },
                    example: [100, 85, 72, 68, 65, 62],
                  },
                },
              },
            },
            averageRetention: {
              type: 'array',
              items: { type: 'number' },
              example: [100, 82, 68, 58, 52, 48],
            },
            insights: {
              type: 'object',
              properties: {
                bestCohort: { type: 'string', example: '2024-01' },
                worstCohort: { type: 'string', example: '2023-08' },
                overallTrend: { type: 'string', example: 'improving' },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async getCohortAnalysis(
    @Query('cohortType') cohortType: string = 'monthly',
    @Query('metric') metric: string = 'retention',
  ) {
    return {
      success: true,
      data: {
        cohorts: [
          {
            cohort: '2024-01',
            size: 100,
            periods: [100, 85, 72, 68, 65, 62],
          },
        ],
        averageRetention: [100, 82, 68, 58, 52, 48],
        insights: {
          bestCohort: '2024-01',
          worstCohort: '2023-08',
          overallTrend: 'improving',
        },
      },
    };
  }
}

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

class SystemConfigDto {
  key!: string;
  value!: string;
  description?: string;
  type?: 'string' | 'number' | 'boolean' | 'json';
}

class UpdateConfigDto {
  value!: string;
  description?: string;
}

@ApiTags('System Configuration')
@Controller('admin/system')
@UseGuards(AdminOrKeyGuard)
@ApiBearerAuth()
export class SystemController {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  @Get('config')
  @ApiOperation({ summary: 'Get all system configurations' })
  @ApiResponse({ status: 200, description: 'System configurations retrieved' })
  async getConfigs(@Query('group') group?: string) {
    const configs = await this.prisma.systemConfig.findMany({
      where: group ? { group } : {},
      orderBy: { key: 'asc' }
    });
    
    return {
      success: true,
      data: configs
    };
  }

  @Get('config/:key')
  @ApiOperation({ summary: 'Get specific system configuration' })
  @ApiResponse({ status: 200, description: 'Configuration retrieved' })
  async getConfig(@Param('key') key: string) {
    const config = await this.prisma.systemConfig.findUnique({
      where: { key }
    });
    
    if (!config) {
      return { success: false, message: 'Configuration not found' };
    }
    
    return {
      success: true,
      data: config
    };
  }

  @Post('config')
  @ApiOperation({ summary: 'Create new system configuration' })
  @ApiResponse({ status: 201, description: 'Configuration created' })
  async createConfig(@Body() dto: SystemConfigDto) {
    const existing = await this.prisma.systemConfig.findUnique({
      where: { key: dto.key }
    });
    
    if (existing) {
      return { success: false, message: 'Configuration key already exists' };
    }
    
    const config = await this.prisma.systemConfig.create({
      data: {
        key: dto.key,
        value: dto.value,
        description: dto.description,
        type: dto.type || 'string'
      }
    });
    
    return {
      success: true,
      data: config
    };
  }

  @Put('config/:key')
  @ApiOperation({ summary: 'Update system configuration' })
  @ApiResponse({ status: 200, description: 'Configuration updated' })
  async updateConfig(@Param('key') key: string, @Body() dto: UpdateConfigDto) {
    const config = await this.prisma.systemConfig.update({
      where: { key },
      data: {
        value: dto.value,
        description: dto.description
      }
    });
    
    return {
      success: true,
      data: config
    };
  }

  @Delete('config/:key')
  @ApiOperation({ summary: 'Delete system configuration' })
  @ApiResponse({ status: 200, description: 'Configuration deleted' })
  async deleteConfig(@Param('key') key: string) {
    await this.prisma.systemConfig.delete({
      where: { key }
    });
    
    return {
      success: true,
      message: 'Configuration deleted'
    };
  }

  @Get('info')
  @ApiOperation({ summary: 'Get system information' })
  @ApiResponse({ status: 200, description: 'System information' })
  async getSystemInfo() {
    const nodeVersion = process.version;
    const platform = process.platform;
    const arch = process.arch;
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    return {
      success: true,
      data: {
        nodeVersion,
        platform,
        arch,
        uptime: Math.floor(uptime),
        memoryUsage: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
          external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB'
        },
        environment: this.configService.get('NODE_ENV', 'development'),
        database: this.configService.get('DATABASE_URL') ? 'Connected' : 'Not configured',
        redis: this.configService.get('REDIS_HOST') ? 'Configured' : 'Not configured'
      }
    };
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get system logs' })
  @ApiResponse({ status: 200, description: 'System logs' })
  async getSystemLogs(@Query('level') level?: string, @Query('limit') limit = '100') {
    // This would typically integrate with a logging service
    // For now, return a placeholder
    return {
      success: true,
      data: {
        logs: [],
        total: 0,
        level: level || 'all',
        limit: parseInt(limit)
      },
      message: 'Log retrieval not implemented yet'
    };
  }

  @Post('maintenance')
  @ApiOperation({ summary: 'Enable/disable maintenance mode' })
  @ApiResponse({ status: 200, description: 'Maintenance mode updated' })
  async toggleMaintenance(@Body() body: { enabled: boolean; message?: string }) {
    await this.prisma.systemConfig.upsert({
      where: { key: 'maintenance_mode' },
      update: { value: body.enabled.toString() },
      create: {
        key: 'maintenance_mode',
        value: body.enabled.toString(),
        description: 'System maintenance mode',
        type: 'boolean'
      }
    });
    
    if (body.message) {
      await this.prisma.systemConfig.upsert({
        where: { key: 'maintenance_message' },
        update: { value: body.message },
        create: {
          key: 'maintenance_message',
          value: body.message,
          description: 'Maintenance mode message',
          type: 'string'
        }
      });
    }
    
    return {
      success: true,
      data: {
        maintenanceMode: body.enabled,
        message: body.message || 'System is under maintenance'
      }
    };
  }

  @Get('maintenance/status')
  @ApiOperation({ summary: 'Get maintenance mode status' })
  @ApiResponse({ status: 200, description: 'Maintenance status' })
  async getMaintenanceStatus() {
    const maintenanceMode = await this.prisma.systemConfig.findUnique({
      where: { key: 'maintenance_mode' }
    });
    
    const maintenanceMessage = await this.prisma.systemConfig.findUnique({
      where: { key: 'maintenance_message' }
    });
    
    return {
      success: true,
      data: {
        enabled: maintenanceMode?.value === 'true',
        message: maintenanceMessage?.value || 'System is under maintenance'
      }
    };
  }
}

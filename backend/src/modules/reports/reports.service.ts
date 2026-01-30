import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { CreateReportDto } from './dto/report.dto';
import { ExportPdfService } from './services/export-pdf.service';
import { ExportExcelService } from './services/export-excel.service';
import { ExportCsvService } from './services/export-csv.service';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly exportPdfService: ExportPdfService,
    private readonly exportExcelService: ExportExcelService,
    private readonly exportCsvService: ExportCsvService,
  ) {}

  async findAll(params: { page: number; pageSize: number; type?: string }) {
    const skip = (params.page - 1) * params.pageSize;

    const where: any = {};
    if (params.type) where.type = params.type;

    const [reports, total] = await Promise.all([
      this.prisma.inventory_reports.findMany({
        where,
        skip,
        take: params.pageSize,
        orderBy: { generatedAt: 'desc' },
      }),
      this.prisma.inventory_reports.count({ where }),
    ]);

    return {
      data: reports,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
    };
  }

  async findById(id: string) {
    const report = await this.prisma.inventory_reports.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async findByType(type: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const [reports, total] = await Promise.all([
      this.prisma.inventory_reports.findMany({
        where: { type },
        skip,
        take: pageSize,
        orderBy: { generatedAt: 'desc' },
      }),
      this.prisma.inventory_reports.count({ where: { type } }),
    ]);

    return {
      data: reports,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async generate(createReportDto: CreateReportDto) {
    if (!createReportDto.type || !createReportDto.title) {
      throw new BadRequestException('type and title are required');
    }

    const report = await this.prisma.inventory_reports.create({
      data: {
        id: randomUUID(),
        type: createReportDto.type,
        title: createReportDto.title,
        description: createReportDto.description,
        parameters: JSON.stringify(createReportDto.parameters || {}),
        data: JSON.stringify({}),
        generatedBy: 'SYSTEM',
        generatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Report generated: ${report.id}`);
    return report;
  }

  async export(id: string) {
    const report = await this.findById(id);

    return {
      ...report,
      exportUrl: `/api/v1/reports/${id}/download`,
      format: 'CSV',
    };
  }

  async delete(id: string) {
    await this.findById(id);

    await this.prisma.inventory_reports.delete({
      where: { id },
    });

    this.logger.log(`Report deleted: ${id}`);
    return { message: 'Report deleted successfully' };
  }

  async getAnalyticsSummary() {
    const [totalOrders, totalRevenue, totalCustomers, totalProducts] = await Promise.all([
      this.prisma.orders.count(),
      this.prisma.orders.aggregate({
        _sum: { totalCents: true },
      }),
      this.prisma.users.count({ where: { role: 'USER' } }),
      this.prisma.products.count({ where: { isActive: true } }),
    ]);

    return {
      totalOrders,
      totalRevenue: Number(totalRevenue._sum.totalCents || BigInt(0)) / 100,
      totalCustomers,
      totalProducts,
      timestamp: new Date(),
    };
  }

  async generateSalesReport(startDate?: string, endDate?: string) {
    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        // If only a date is provided, include the full day.
        if (!Number.isNaN(start.getTime())) {
          start.setHours(0, 0, 0, 0);
          where.createdAt.gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        // If only a date is provided, include the full day.
        if (!Number.isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }
    }

    const orders = await this.prisma.orders.findMany({
      where,
      include: {
        order_items: true,
      },
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + BigInt(order.totalCents || 0),
      BigInt(0),
    );
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / BigInt(totalOrders) : BigInt(0);

    return {
      type: 'SALES',
      period: { startDate, endDate },
      totalOrders,
      totalRevenue: Number(totalRevenue) / 100,
      averageOrderValue: Number(averageOrderValue) / 100,
      orders: orders.map(order => ({
        id: order.id,
        orderNo: order.orderNo,
        totalCents: order.totalCents,
        status: order.status,
        createdAt: order.createdAt,
      })),
      generatedAt: new Date(),
    };
  }

  async generateInventoryReport() {
    const products = await this.prisma.products.findMany({
      include: {
        inventory: true,
        inventory_alerts: true,
      },
    });

    const lowStockProducts = products.filter(
      p => p.inventory && p.inventory.stock < (p.inventory.lowStockThreshold || 10),
    );

    return {
      type: 'INVENTORY',
      totalProducts: products.length,
      lowStockProducts: lowStockProducts.length,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        stock: p.inventory?.stock || 0,
        lowStockThreshold: p.inventory?.lowStockThreshold || 0,
        alerts: p.inventory_alerts.length,
      })),
      generatedAt: new Date(),
    };
  }

  async generateCustomersReport() {
    const users = await this.prisma.users.findMany({
      where: { role: 'USER' },
      include: {
        orders: true,
      },
    });

    const totalSpent = users.map(u =>
      u.orders.reduce((sum, order) => sum + BigInt(order.totalCents || 0), BigInt(0)),
    );

    return {
      type: 'CUSTOMERS',
      totalCustomers: users.length,
      customers: users.map((u, idx) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        orders: u.orders.length,
        totalSpent: Number(totalSpent[idx]) / 100,
        createdAt: u.createdAt,
      })),
      generatedAt: new Date(),
    };
  }

  /**
   * Export sales report in specified format
   */
  async exportSalesReport(
    format: 'pdf' | 'excel' | 'csv',
    startDate?: string,
    endDate?: string,
  ): Promise<Buffer> {
    const reportData = await this.generateSalesReport(startDate, endDate);

    const columns = [
      { key: 'orderNo', header: 'Mã đơn hàng', width: 20 },
      { key: 'totalCents', header: 'Tổng tiền (VNĐ)', width: 20 },
      { key: 'status', header: 'Trạng thái', width: 15 },
      { key: 'createdAt', header: 'Ngày tạo', width: 20 },
    ];

    const data = reportData.orders.map(order => ({
      ...order,
      totalCents: (Number(order.totalCents) / 100).toLocaleString('vi-VN'),
      createdAt: new Date(order.createdAt).toLocaleDateString('vi-VN'),
    }));

    return this.exportReport(format, {
      title: 'Báo cáo Doanh số',
      subtitle: `Từ ${startDate || 'đầu'} đến ${endDate || 'hiện tại'}`,
      data,
      columns,
    });
  }

  /**
   * Export inventory report in specified format
   */
  async exportInventoryReport(format: 'pdf' | 'excel' | 'csv'): Promise<Buffer> {
    const reportData = await this.generateInventoryReport();

    const columns = [
      { key: 'id', header: 'Mã SP', width: 15 },
      { key: 'name', header: 'Tên sản phẩm', width: 30 },
      { key: 'stock', header: 'Tồn kho', width: 15 },
      { key: 'lowStockThreshold', header: 'Ngưỡng cảnh báo', width: 20 },
      { key: 'alerts', header: 'Cảnh báo', width: 15 },
    ];

    return this.exportReport(format, {
      title: 'Báo cáo Tồn kho',
      subtitle: `Tổng số sản phẩm: ${reportData.totalProducts}`,
      data: reportData.products,
      columns,
    });
  }

  /**
   * Export customers report in specified format
   */
  async exportCustomersReport(format: 'pdf' | 'excel' | 'csv'): Promise<Buffer> {
    const reportData = await this.generateCustomersReport();

    const columns = [
      { key: 'id', header: 'Mã KH', width: 15 },
      { key: 'name', header: 'Tên khách hàng', width: 25 },
      { key: 'email', header: 'Email', width: 30 },
      { key: 'orders', header: 'Số đơn hàng', width: 15 },
      { key: 'totalSpent', header: 'Tổng chi tiêu (VNĐ)', width: 20 },
      { key: 'createdAt', header: 'Ngày đăng ký', width: 20 },
    ];

    const data = reportData.customers.map(customer => ({
      ...customer,
      totalSpent: customer.totalSpent.toLocaleString('vi-VN'),
      createdAt: new Date(customer.createdAt).toLocaleDateString('vi-VN'),
    }));

    return this.exportReport(format, {
      title: 'Báo cáo Khách hàng',
      subtitle: `Tổng số khách hàng: ${reportData.totalCustomers}`,
      data,
      columns,
    });
  }

  /**
   * Generic export report method
   */
  private async exportReport(
    format: 'pdf' | 'excel' | 'csv',
    options: {
      title: string;
      subtitle?: string;
      data: any[];
      columns: { key: string; header: string; width?: number }[];
    },
  ): Promise<Buffer> {
    switch (format) {
      case 'pdf':
        return this.exportPdfService.generatePDF(options);
      case 'excel':
        return this.exportExcelService.generateExcel({
          ...options,
          sheetName: options.title,
        });
      case 'csv':
        return this.exportCsvService.generateCSVWithBOM({
          data: options.data,
          fields: options.columns.map(c => c.key),
          headers: options.columns.map(c => c.header),
        });
      default:
        throw new BadRequestException('Unsupported export format');
    }
  }

  /**
   * Export comprehensive report with all data
   */
  async exportComprehensiveReport(): Promise<Buffer> {
    const [salesReport, inventoryReport, customersReport] = await Promise.all([
      this.generateSalesReport(),
      this.generateInventoryReport(),
      this.generateCustomersReport(),
    ]);

    const sheets = [
      {
        title: 'Báo cáo Doanh số',
        sheetName: 'Doanh số',
        data: salesReport.orders.map(order => ({
          ...order,
          totalCents: (Number(order.totalCents) / 100).toLocaleString('vi-VN'),
          createdAt: new Date(order.createdAt).toLocaleDateString('vi-VN'),
        })),
        columns: [
          { key: 'orderNo', header: 'Mã đơn hàng', width: 20 },
          { key: 'totalCents', header: 'Tổng tiền (VNĐ)', width: 20 },
          { key: 'status', header: 'Trạng thái', width: 15 },
          { key: 'createdAt', header: 'Ngày tạo', width: 20 },
        ],
      },
      {
        title: 'Báo cáo Tồn kho',
        sheetName: 'Tồn kho',
        data: inventoryReport.products,
        columns: [
          { key: 'id', header: 'Mã SP', width: 15 },
          { key: 'name', header: 'Tên sản phẩm', width: 30 },
          { key: 'stock', header: 'Tồn kho', width: 15 },
          { key: 'lowStockThreshold', header: 'Ngưỡng cảnh báo', width: 20 },
          { key: 'alerts', header: 'Cảnh báo', width: 15 },
        ],
      },
      {
        title: 'Báo cáo Khách hàng',
        sheetName: 'Khách hàng',
        data: customersReport.customers.map(customer => ({
          ...customer,
          totalSpent: customer.totalSpent.toLocaleString('vi-VN'),
          createdAt: new Date(customer.createdAt).toLocaleDateString('vi-VN'),
        })),
        columns: [
          { key: 'id', header: 'Mã KH', width: 15 },
          { key: 'name', header: 'Tên khách hàng', width: 25 },
          { key: 'email', header: 'Email', width: 30 },
          { key: 'orders', header: 'Số đơn hàng', width: 15 },
          { key: 'totalSpent', header: 'Tổng chi tiêu (VNĐ)', width: 20 },
          { key: 'createdAt', header: 'Ngày đăng ký', width: 20 },
        ],
      },
    ];

    return this.exportExcelService.generateMultiSheetExcel(sheets);
  }
}

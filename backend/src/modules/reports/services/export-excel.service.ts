import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

export interface ExcelReportOptions {
  title: string;
  subtitle?: string;
  data: any[];
  columns: { key: string; header: string; width?: number }[];
  sheetName?: string;
}

@Injectable()
export class ExportExcelService {
  private readonly logger = new Logger(ExportExcelService.name);

  /**
   * Generate Excel report from data
   */
  async generateExcel(options: ExcelReportOptions): Promise<Buffer> {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(options.sheetName || 'Báo cáo');

      // Set worksheet properties
      worksheet.properties.defaultRowHeight = 20;

      // Add title
      this.addTitle(worksheet, options.title, options.subtitle, options.columns.length);

      // Add headers
      this.addHeaders(worksheet, options.columns);

      // Add data
      this.addData(worksheet, options.data, options.columns);

      // Format worksheet
      this.formatWorksheet(worksheet, options.columns);

      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer();

      this.logger.log(`Excel report generated: ${options.title}`);
      return Buffer.from(buffer);
    } catch (error) {
      this.logger.error('Error generating Excel:', error);
      throw error;
    }
  }

  /**
   * Add title rows
   */
  private addTitle(
    worksheet: ExcelJS.Worksheet,
    title: string,
    subtitle: string | undefined,
    columnCount: number,
  ): void {
    // Add title
    const titleRow = worksheet.addRow([title]);
    titleRow.font = { size: 16, bold: true };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    titleRow.height = 30;
    worksheet.mergeCells(1, 1, 1, columnCount);

    // Add subtitle if provided
    if (subtitle) {
      const subtitleRow = worksheet.addRow([subtitle]);
      subtitleRow.font = { size: 12 };
      subtitleRow.alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.mergeCells(2, 1, 2, columnCount);
    }

    // Add date
    const dateRow = worksheet.addRow([`Ngày tạo: ${new Date().toLocaleString('vi-VN')}`]);
    dateRow.font = { size: 10, italic: true };
    dateRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(subtitle ? 3 : 2, 1, subtitle ? 3 : 2, columnCount);

    // Add empty row
    worksheet.addRow([]);
  }

  /**
   * Add header row
   */
  private addHeaders(
    worksheet: ExcelJS.Worksheet,
    columns: { key: string; header: string; width?: number }[],
  ): void {
    const headerRow = worksheet.addRow(columns.map(col => col.header));

    // Style header
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4A5568' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 25;

    // Add borders
    headerRow.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  }

  /**
   * Add data rows
   */
  private addData(
    worksheet: ExcelJS.Worksheet,
    data: any[],
    columns: { key: string; header: string; width?: number }[],
  ): void {
    data.forEach((item, index) => {
      const row = worksheet.addRow(columns.map(col => item[col.key]));

      // Alternate row colors
      if (index % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF7FAFC' },
        };
      }

      // Add borders
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        };
        cell.alignment = { vertical: 'middle' };
      });
    });
  }

  /**
   * Format worksheet
   */
  private formatWorksheet(
    worksheet: ExcelJS.Worksheet,
    columns: { key: string; header: string; width?: number }[],
  ): void {
    // Set column widths
    worksheet.columns = columns.map(col => ({
      key: col.key,
      width: col.width || 20,
    }));

    // Auto-filter
    const headerRowIndex = worksheet.rowCount > 4 ? 5 : 2;
    worksheet.autoFilter = {
      from: { row: headerRowIndex, column: 1 },
      to: { row: headerRowIndex, column: columns.length },
    };

    // Freeze panes (freeze header row)
    worksheet.views = [
      {
        state: 'frozen',
        xSplit: 0,
        ySplit: headerRowIndex,
        topLeftCell: `A${headerRowIndex + 1}`,
      },
    ];
  }

  /**
   * Generate Excel with multiple sheets
   */
  async generateMultiSheetExcel(sheets: ExcelReportOptions[]): Promise<Buffer> {
    try {
      const workbook = new ExcelJS.Workbook();

      for (const sheetOptions of sheets) {
        const worksheet = workbook.addWorksheet(sheetOptions.sheetName || 'Báo cáo');
        worksheet.properties.defaultRowHeight = 20;

        this.addTitle(
          worksheet,
          sheetOptions.title,
          sheetOptions.subtitle,
          sheetOptions.columns.length,
        );
        this.addHeaders(worksheet, sheetOptions.columns);
        this.addData(worksheet, sheetOptions.data, sheetOptions.columns);
        this.formatWorksheet(worksheet, sheetOptions.columns);
      }

      const buffer = await workbook.xlsx.writeBuffer();
      this.logger.log(`Multi-sheet Excel report generated with ${sheets.length} sheets`);
      return Buffer.from(buffer);
    } catch (error) {
      this.logger.error('Error generating multi-sheet Excel:', error);
      throw error;
    }
  }
}

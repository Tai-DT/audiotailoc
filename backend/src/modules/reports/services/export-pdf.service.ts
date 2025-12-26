import { Injectable, Logger } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export interface PDFReportOptions {
  title: string;
  subtitle?: string;
  data: any[];
  columns: { key: string; header: string; width?: number }[];
  footer?: string;
  orientation?: 'portrait' | 'landscape';
}

@Injectable()
export class ExportPdfService {
  private readonly logger = new Logger(ExportPdfService.name);

  /**
   * Generate PDF report from data
   */
  async generatePDF(options: PDFReportOptions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const buffers: Buffer[] = [];

        // Create PDF document
        const doc = new PDFDocument({
          size: 'A4',
          layout: options.orientation || 'portrait',
          margin: 50,
          info: {
            Title: options.title,
            Author: 'AudioTaiLoc System',
            Subject: 'Report',
            CreationDate: new Date(),
          },
        });

        // Collect data
        doc.on('data', chunk => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Add header
        this.addHeader(doc, options.title, options.subtitle);

        // Add table
        this.addTable(doc, options.data, options.columns);

        // Add footer
        if (options.footer) {
          this.addFooter(doc, options.footer);
        }

        // Add page numbers
        this.addPageNumbers(doc);

        // Finalize PDF
        doc.end();

        this.logger.log(`PDF report generated: ${options.title}`);
      } catch (error) {
        this.logger.error('Error generating PDF:', error);
        reject(error);
      }
    });
  }

  /**
   * Add header to PDF
   */
  private addHeader(doc: PDFKit.PDFDocument, title: string, subtitle?: string): void {
    doc.fontSize(20).font('Helvetica-Bold').text(title, { align: 'center' }).moveDown(0.5);

    if (subtitle) {
      doc.fontSize(12).font('Helvetica').text(subtitle, { align: 'center' }).moveDown(0.5);
    }

    doc
      .fontSize(10)
      .text(`Ngày tạo: ${new Date().toLocaleString('vi-VN')}`, {
        align: 'center',
      })
      .moveDown(1.5);
  }

  /**
   * Add table to PDF
   */
  private addTable(
    doc: PDFKit.PDFDocument,
    data: any[],
    columns: { key: string; header: string; width?: number }[],
  ): void {
    const startX = 50;
    let startY = doc.y;
    const rowHeight = 25;
    const pageHeight = doc.page.height - 100;

    // Calculate column widths
    const totalWidth = doc.page.width - 100;
    const defaultWidth = totalWidth / columns.length;
    const columnWidths = columns.map(col => col.width || defaultWidth);

    // Draw header
    this.drawTableRow(
      doc,
      startX,
      startY,
      columns.map(col => col.header),
      columnWidths,
      rowHeight,
      true,
    );
    startY += rowHeight;

    // Draw data rows
    data.forEach((row, index) => {
      // Check if we need a new page
      if (startY + rowHeight > pageHeight) {
        doc.addPage();
        startY = 50;
        // Redraw header on new page
        this.drawTableRow(
          doc,
          startX,
          startY,
          columns.map(col => col.header),
          columnWidths,
          rowHeight,
          true,
        );
        startY += rowHeight;
      }

      const values = columns.map(col => this.formatValue(row[col.key]));
      this.drawTableRow(
        doc,
        startX,
        startY,
        values,
        columnWidths,
        rowHeight,
        false,
        index % 2 === 0,
      );
      startY += rowHeight;
    });

    doc.moveDown(2);
  }

  /**
   * Draw a single table row
   */
  private drawTableRow(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    values: string[],
    widths: number[],
    height: number,
    isHeader: boolean,
    isEvenRow = false,
  ): void {
    let currentX = x;

    values.forEach((value, i) => {
      const width = widths[i];

      // Draw background
      if (isHeader) {
        doc.rect(currentX, y, width, height).fillAndStroke('#4A5568', '#2D3748');
      } else if (isEvenRow) {
        doc.rect(currentX, y, width, height).fillAndStroke('#F7FAFC', '#E2E8F0');
      } else {
        doc.rect(currentX, y, width, height).stroke('#E2E8F0');
      }

      // Draw text
      doc
        .fontSize(isHeader ? 10 : 9)
        .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
        .fillColor(isHeader ? '#FFFFFF' : '#2D3748')
        .text(value, currentX + 5, y + 8, {
          width: width - 10,
          height: height,
          align: 'left',
          ellipsis: true,
        });

      currentX += width;
    });

    doc.fillColor('#000000'); // Reset color
  }

  /**
   * Add footer to PDF
   */
  private addFooter(doc: PDFKit.PDFDocument, footer: string): void {
    doc
      .fontSize(8)
      .font('Helvetica')
      .text(footer, 50, doc.page.height - 50, {
        align: 'center',
      });
  }

  /**
   * Add page numbers
   */
  private addPageNumbers(doc: PDFKit.PDFDocument): void {
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(range.start + i);
      doc
        .fontSize(8)
        .text(`Trang ${i + 1} / ${range.count}`, 50, doc.page.height - 30, { align: 'right' });
    }
  }

  /**
   * Format value for display
   */
  private formatValue(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') {
      return value.toLocaleString('vi-VN');
    }
    if (value instanceof Date) {
      return value.toLocaleDateString('vi-VN');
    }
    return String(value);
  }

  /**
   * Convert buffer to stream
   */
  bufferToStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }
}

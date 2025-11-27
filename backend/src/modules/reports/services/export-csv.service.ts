import { Injectable, Logger } from '@nestjs/common';
import { Parser } from 'json2csv';

export interface CSVReportOptions {
  data: any[];
  fields?: string[];
  headers?: string[];
}

@Injectable()
export class ExportCsvService {
  private readonly logger = new Logger(ExportCsvService.name);

  /**
   * Generate CSV report from data
   */
  async generateCSV(options: CSVReportOptions): Promise<string> {
    try {
      const { data, fields, headers } = options;

      if (!data || data.length === 0) {
        this.logger.warn('No data to export to CSV');
        return '';
      }

      // Prepare fields
      const csvFields = this.prepareFields(data, fields, headers);

      // Create parser
      const parser = new Parser({
        fields: csvFields,
        delimiter: ',',
        quote: '"',
        header: true,
      });

      // Parse data
      const csv = parser.parse(data);

      this.logger.log(`CSV report generated with ${data.length} rows`);
      return csv;
    } catch (error) {
      this.logger.error('Error generating CSV:', error);
      throw error;
    }
  }

  /**
   * Generate CSV buffer
   */
  async generateCSVBuffer(options: CSVReportOptions): Promise<Buffer> {
    const csv = await this.generateCSV(options);
    return Buffer.from(csv, 'utf-8');
  }

  /**
   * Prepare fields for CSV export
   */
  private prepareFields(data: any[], fields?: string[], headers?: string[]): any[] {
    if (!fields || fields.length === 0) {
      // Auto-detect fields from first data item
      fields = Object.keys(data[0]);
    }

    // Map fields to include custom headers
    if (headers && headers.length === fields.length) {
      return fields.map((field, index) => ({
        label: headers[index],
        value: field,
      }));
    }

    // Default: use field names as headers
    return fields.map(field => ({
      label: this.formatHeader(field),
      value: field,
    }));
  }

  /**
   * Format header from field name
   */
  private formatHeader(field: string): string {
    // Convert camelCase or snake_case to Title Case
    return field
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Generate CSV with custom formatting
   */
  async generateFormattedCSV(
    data: any[],
    columns: { key: string; header: string; formatter?: (value: any) => string }[],
  ): Promise<string> {
    try {
      if (!data || data.length === 0) {
        return '';
      }

      // Format data using custom formatters
      const formattedData = data.map(row => {
        const formattedRow: any = {};
        columns.forEach(col => {
          const value = row[col.key];
          formattedRow[col.key] = col.formatter
            ? col.formatter(value)
            : this.defaultFormatter(value);
        });
        return formattedRow;
      });

      // Generate CSV
      const fields = columns.map(col => ({
        label: col.header,
        value: col.key,
      }));

      const parser = new Parser({
        fields,
        delimiter: ',',
        quote: '"',
        header: true,
      });

      const csv = parser.parse(formattedData);
      this.logger.log(`Formatted CSV generated with ${data.length} rows`);
      return csv;
    } catch (error) {
      this.logger.error('Error generating formatted CSV:', error);
      throw error;
    }
  }

  /**
   * Default value formatter
   */
  private defaultFormatter(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') return value.toLocaleString('vi-VN');
    if (value instanceof Date) return value.toLocaleString('vi-VN');
    if (typeof value === 'boolean') return value ? 'Có' : 'Không';
    return String(value);
  }

  /**
   * Generate CSV with BOM for proper Excel UTF-8 support
   */
  async generateCSVWithBOM(options: CSVReportOptions): Promise<Buffer> {
    const csv = await this.generateCSV(options);
    // Add BOM (Byte Order Mark) for UTF-8
    const BOM = '\uFEFF';
    return Buffer.from(BOM + csv, 'utf-8');
  }

  /**
   * Generate TSV (Tab-Separated Values)
   */
  async generateTSV(options: CSVReportOptions): Promise<string> {
    try {
      const { data, fields, headers } = options;

      if (!data || data.length === 0) {
        return '';
      }

      const csvFields = this.prepareFields(data, fields, headers);

      const parser = new Parser({
        fields: csvFields,
        delimiter: '\t',
        quote: '"',
        header: true,
      });

      const tsv = parser.parse(data);
      this.logger.log(`TSV report generated with ${data.length} rows`);
      return tsv;
    } catch (error) {
      this.logger.error('Error generating TSV:', error);
      throw error;
    }
  }
}

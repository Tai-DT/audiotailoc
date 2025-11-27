export class CreateReportDto {
  type: 'SALES' | 'INVENTORY' | 'CUSTOMERS' | 'PRODUCTS' | 'SERVICES' | 'CUSTOM';
  title: string;
  description?: string;
  parameters?: Record<string, any>;
  startDate?: string;
  endDate?: string;
}

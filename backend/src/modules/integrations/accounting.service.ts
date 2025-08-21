import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface AccountingTransaction {
  id: string;
  type: 'SALE' | 'PURCHASE' | 'PAYMENT' | 'RECEIPT' | 'JOURNAL';
  date: Date;
  reference: string;
  description: string;
  totalAmount: number;
  currency: string;
  customerId?: string;
  supplierId?: string;
  lineItems: Array<{
    accountCode: string;
    accountName: string;
    description: string;
    debitAmount: number;
    creditAmount: number;
    taxCode?: string;
    taxAmount?: number;
  }>;
  taxTotal: number;
  status: 'DRAFT' | 'POSTED' | 'VOID';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  issueDate: Date;
  dueDate: Date;
  currency: string;
  subtotal: number;
  taxTotal: number;
  total: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'VOID';
  lineItems: Array<{
    productId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    taxCode?: string;
    taxRate?: number;
    taxAmount?: number;
  }>;
  payments: Array<{
    date: Date;
    amount: number;
    method: string;
    reference: string;
  }>;
}

export interface ChartOfAccount {
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  category: string;
  isActive: boolean;
  parentCode?: string;
  taxCode?: string;
}

export interface TaxCode {
  code: string;
  name: string;
  rate: number;
  type: 'INPUT' | 'OUTPUT' | 'EXEMPT';
  isActive: boolean;
}

export interface FinancialReport {
  type: 'PROFIT_LOSS' | 'BALANCE_SHEET' | 'CASH_FLOW' | 'TRIAL_BALANCE';
  period: {
    startDate: Date;
    endDate: Date;
  };
  currency: string;
  data: Array<{
    accountCode: string;
    accountName: string;
    amount: number;
    percentage?: number;
  }>;
  totals: {
    revenue?: number;
    expenses?: number;
    netIncome?: number;
    assets?: number;
    liabilities?: number;
    equity?: number;
  };
}

@Injectable()
export class AccountingService {
  private readonly logger = new Logger(AccountingService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService
  ) {}

  // Create invoice in accounting system
  async createInvoice(orderData: any): Promise<Invoice> {
    try {
      const provider = this.config.get<string>('ACCOUNTING_PROVIDER');
      
      switch (provider) {
        case 'misa':
          return this.createMISAInvoice(orderData);
        case 'fast':
          return this.createInternalInvoice(orderData);
        case 'quickbooks':
          return this.createQuickBooksInvoice(orderData);
        case 'xero':
          return this.createXeroInvoice(orderData);
        default:
          return this.createInternalInvoice(orderData);
      }
    } catch (error) {
      this.logger.error('Failed to create invoice:', error);
      throw error;
    }
  }

  // Sync transaction to accounting system
  async syncTransaction(transaction: AccountingTransaction): Promise<void> {
    try {
      const provider = this.config.get<string>('ACCOUNTING_PROVIDER');
      
      switch (provider) {
        case 'misa':
          await this.syncMISATransaction(transaction);
          break;
        case 'fast':
          await this.syncInternalTransaction(transaction);
          break;
        case 'quickbooks':
          await this.syncInternalTransaction(transaction);
          break;
        case 'xero':
          await this.syncInternalTransaction(transaction);
          break;
        default:
          await this.syncInternalTransaction(transaction);
      }
    } catch (error) {
      this.logger.error('Failed to sync transaction:', error);
      throw error;
    }
  }

  // Get chart of accounts
  async getChartOfAccounts(): Promise<ChartOfAccount[]> {
    try {
      const provider = this.config.get<string>('ACCOUNTING_PROVIDER');
      
      switch (provider) {
        case 'misa':
          return this.getMISAChartOfAccounts();
        case 'fast':
          return this.getInternalChartOfAccounts();
        case 'quickbooks':
          return this.getInternalChartOfAccounts();
        case 'xero':
          return this.getInternalChartOfAccounts();
        default:
          return this.getInternalChartOfAccounts();
      }
    } catch (error) {
      this.logger.error('Failed to get chart of accounts:', error);
      throw error;
    }
  }

  // Generate financial report
  async generateFinancialReport(
    type: FinancialReport['type'],
    startDate: Date,
    endDate: Date
  ): Promise<FinancialReport> {
    try {
      const provider = this.config.get<string>('ACCOUNTING_PROVIDER');
      
      switch (provider) {
        case 'misa':
          return this.generateMISAReport(type, startDate, endDate);
        case 'fast':
          return this.generateInternalReport(type, startDate, endDate);
        case 'quickbooks':
          return this.generateInternalReport(type, startDate, endDate);
        case 'xero':
          return this.generateInternalReport(type, startDate, endDate);
        default:
          return this.generateInternalReport(type, startDate, endDate);
      }
    } catch (error) {
      this.logger.error('Failed to generate financial report:', error);
      throw error;
    }
  }

  // Calculate tax for transaction
  async calculateTax(amount: number, taxCode: string): Promise<number> {
    try {
      const taxCodes = await this.getTaxCodes();
      const tax = taxCodes.find(t => t.code === taxCode);
      
      if (!tax) {
        throw new Error(`Tax code not found: ${taxCode}`);
      }

      return amount * (tax.rate / 100);
    } catch (error) {
      this.logger.error('Failed to calculate tax:', error);
      throw error;
    }
  }

  // Get tax codes
  async getTaxCodes(): Promise<TaxCode[]> {
    try {
      // Vietnam standard tax codes
      return [
        {
          code: 'VAT_0',
          name: 'VAT 0%',
          rate: 0,
          type: 'OUTPUT',
          isActive: true,
        },
        {
          code: 'VAT_5',
          name: 'VAT 5%',
          rate: 5,
          type: 'OUTPUT',
          isActive: true,
        },
        {
          code: 'VAT_10',
          name: 'VAT 10%',
          rate: 10,
          type: 'OUTPUT',
          isActive: true,
        },
        {
          code: 'VAT_EXEMPT',
          name: 'VAT Exempt',
          rate: 0,
          type: 'EXEMPT',
          isActive: true,
        },
      ];
    } catch (error) {
      this.logger.error('Failed to get tax codes:', error);
      throw error;
    }
  }

  // MISA Integration
  private async createMISAInvoice(orderData: any): Promise<Invoice> {
    const apiKey = this.config.get<string>('MISA_API_KEY');
    const baseUrl = this.config.get<string>('MISA_BASE_URL');

    const response = await firstValueFrom(
      this.httpService.post(`${baseUrl}/api/v1/invoices`, {
        InvoiceNumber: orderData.orderNumber,
        CustomerCode: orderData.customerId,
        CustomerName: orderData.customerName,
        CustomerAddress: orderData.shippingAddress,
        InvoiceDate: new Date().toISOString(),
        DueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        Currency: 'VND',
        InvoiceDetails: orderData.items.map((item: any) => ({
          ItemCode: item.productId,
          ItemName: item.productName,
          Quantity: item.quantity,
          UnitPrice: item.price,
          Amount: item.quantity * item.price,
          VATRate: 10,
          VATAmount: item.quantity * item.price * 0.1,
        })),
        TotalAmount: orderData.total,
        VATAmount: orderData.total * 0.1,
        TotalPayment: orderData.total + (orderData.total * 0.1),
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      })
    );

    return this.mapMISAInvoiceResponse(response.data);
  }

  private async syncMISATransaction(transaction: AccountingTransaction): Promise<void> {
    const apiKey = this.config.get<string>('MISA_API_KEY');
    const baseUrl = this.config.get<string>('MISA_BASE_URL');

    await firstValueFrom(
      this.httpService.post(`${baseUrl}/api/v1/journal-entries`, {
        RefNo: transaction.reference,
        RefDate: transaction.date.toISOString(),
        Description: transaction.description,
        JournalEntryDetails: transaction.lineItems.map(item => ({
          AccountNumber: item.accountCode,
          Description: item.description,
          DebitAmount: item.debitAmount,
          CreditAmount: item.creditAmount,
        })),
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      })
    );
  }

  private async getMISAChartOfAccounts(): Promise<ChartOfAccount[]> {
    const apiKey = this.config.get<string>('MISA_API_KEY');
    const baseUrl = this.config.get<string>('MISA_BASE_URL');

    const response = await firstValueFrom(
      this.httpService.get(`${baseUrl}/api/v1/accounts`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      })
    );

    return response.data.map((account: any) => ({
      code: account.AccountNumber,
      name: account.AccountName,
      type: this.mapMISAAccountType(account.AccountType),
      category: account.AccountCategory,
      isActive: account.IsActive,
      parentCode: account.ParentAccountNumber,
    }));
  }

  private async generateMISAReport(
    type: FinancialReport['type'],
    startDate: Date,
    endDate: Date
  ): Promise<FinancialReport> {
    const apiKey = this.config.get<string>('MISA_API_KEY');
    const baseUrl = this.config.get<string>('MISA_BASE_URL');

    const reportEndpoint = this.getMISAReportEndpoint(type);
    
    const response = await firstValueFrom(
      this.httpService.get(`${baseUrl}/api/v1/reports/${reportEndpoint}`, {
        params: {
          FromDate: startDate.toISOString().split('T')[0],
          ToDate: endDate.toISOString().split('T')[0],
        },
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      })
    );

    return this.mapMISAReportResponse(type, response.data, startDate, endDate);
  }

  // QuickBooks Integration
  private async createQuickBooksInvoice(orderData: any): Promise<Invoice> {
    const accessToken = this.config.get<string>('QUICKBOOKS_ACCESS_TOKEN');
    const companyId = this.config.get<string>('QUICKBOOKS_COMPANY_ID');
    const baseUrl = this.config.get<string>('QUICKBOOKS_BASE_URL');

    const response = await firstValueFrom(
      this.httpService.post(`${baseUrl}/v3/company/${companyId}/invoice`, {
        CustomerRef: {
          value: orderData.customerId,
        },
        Line: orderData.items.map((item: any, index: number) => ({
          Id: (index + 1).toString(),
          LineNum: index + 1,
          Amount: item.quantity * item.price,
          DetailType: 'SalesItemLineDetail',
          SalesItemLineDetail: {
            ItemRef: {
              value: item.productId,
              name: item.productName,
            },
            Qty: item.quantity,
            UnitPrice: item.price,
          },
        })),
        TxnDate: new Date().toISOString().split('T')[0],
        DueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        DocNumber: orderData.orderNumber,
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
    );

    return this.mapQuickBooksInvoiceResponse(response.data.QueryResponse.Invoice[0]);
  }

  // Xero Integration
  private async createXeroInvoice(orderData: any): Promise<Invoice> {
    const accessToken = this.config.get<string>('XERO_ACCESS_TOKEN');
    const tenantId = this.config.get<string>('XERO_TENANT_ID');

    const response = await firstValueFrom(
      this.httpService.post('https://api.xero.com/api.xro/2.0/Invoices', {
        Invoices: [{
          Type: 'ACCREC',
          Contact: {
            ContactID: orderData.customerId,
          },
          Date: new Date().toISOString().split('T')[0],
          DueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          InvoiceNumber: orderData.orderNumber,
          Reference: orderData.orderNumber,
          LineItems: orderData.items.map((item: any) => ({
            Description: item.productName,
            Quantity: item.quantity,
            UnitAmount: item.price,
            AccountCode: '200', // Sales account
            TaxType: 'OUTPUT2', // 10% GST
          })),
          Status: 'AUTHORISED',
        }],
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Xero-tenant-id': tenantId,
          'Content-Type': 'application/json',
        },
      })
    );

    return this.mapXeroInvoiceResponse(response.data.Invoices[0]);
  }

  // Internal accounting system
  private async createInternalInvoice(orderData: any): Promise<Invoice> {
    // Create invoice in internal system
    const invoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: orderData.orderNumber,
      customerId: orderData.customerId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerAddress: orderData.shippingAddress,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      currency: 'VND',
      subtotal: orderData.subtotal,
      taxTotal: orderData.taxTotal,
      total: orderData.total,
      status: 'DRAFT',
      lineItems: orderData.items.map((item: any) => ({
        productId: item.productId,
        description: item.productName,
        quantity: item.quantity,
        unitPrice: item.price,
        lineTotal: item.quantity * item.price,
        taxCode: 'VAT_10',
        taxRate: 10,
        taxAmount: item.quantity * item.price * 0.1,
      })),
      payments: [],
    };

    return invoice;
  }

  private async syncInternalTransaction(transaction: AccountingTransaction): Promise<void> {
    // Sync to internal accounting system
    this.logger.log(`Syncing transaction ${transaction.id} to internal system`);
  }

  private async getInternalChartOfAccounts(): Promise<ChartOfAccount[]> {
    // Return standard Vietnamese chart of accounts
    return [
      { code: '111', name: 'Tiền mặt', type: 'ASSET', category: 'Current Assets', isActive: true },
      { code: '112', name: 'Tiền gửi ngân hàng', type: 'ASSET', category: 'Current Assets', isActive: true },
      { code: '131', name: 'Phải thu của khách hàng', type: 'ASSET', category: 'Current Assets', isActive: true },
      { code: '156', name: 'Hàng tồn kho', type: 'ASSET', category: 'Current Assets', isActive: true },
      { code: '211', name: 'Phải trả người bán', type: 'LIABILITY', category: 'Current Liabilities', isActive: true },
      { code: '333', name: 'Thuế và các khoản phải nộp', type: 'LIABILITY', category: 'Current Liabilities', isActive: true },
      { code: '411', name: 'Vốn góp của chủ sở hữu', type: 'EQUITY', category: 'Equity', isActive: true },
      { code: '511', name: 'Doanh thu bán hàng', type: 'REVENUE', category: 'Revenue', isActive: true },
      { code: '632', name: 'Giá vốn hàng bán', type: 'EXPENSE', category: 'Cost of Goods Sold', isActive: true },
      { code: '641', name: 'Chi phí bán hàng', type: 'EXPENSE', category: 'Operating Expenses', isActive: true },
      { code: '642', name: 'Chi phí quản lý doanh nghiệp', type: 'EXPENSE', category: 'Operating Expenses', isActive: true },
    ];
  }

  private async generateInternalReport(
    type: FinancialReport['type'],
    startDate: Date,
    endDate: Date
  ): Promise<FinancialReport> {
    // Generate report from internal data
    return {
      type,
      period: { startDate, endDate },
      currency: 'VND',
      data: [],
      totals: {},
    };
  }

  // Helper methods
  private mapMISAAccountType(misaType: string): ChartOfAccount['type'] {
    const typeMap: Record<string, ChartOfAccount['type']> = {
      'Asset': 'ASSET',
      'Liability': 'LIABILITY',
      'Equity': 'EQUITY',
      'Revenue': 'REVENUE',
      'Expense': 'EXPENSE',
    };
    return typeMap[misaType] || 'ASSET';
  }

  private getMISAReportEndpoint(type: FinancialReport['type']): string {
    const endpointMap: Record<FinancialReport['type'], string> = {
      'PROFIT_LOSS': 'profit-loss',
      'BALANCE_SHEET': 'balance-sheet',
      'CASH_FLOW': 'cash-flow',
      'TRIAL_BALANCE': 'trial-balance',
    };
    return endpointMap[type];
  }

  private mapMISAInvoiceResponse(data: any): Invoice {
    return {
      id: data.InvoiceID,
      invoiceNumber: data.InvoiceNumber,
      customerId: data.CustomerCode,
      customerName: data.CustomerName,
      customerEmail: data.CustomerEmail || '',
      customerAddress: data.CustomerAddress,
      issueDate: new Date(data.InvoiceDate),
      dueDate: new Date(data.DueDate),
      currency: data.Currency,
      subtotal: data.TotalAmount,
      taxTotal: data.VATAmount,
      total: data.TotalPayment,
      status: 'SENT',
      lineItems: data.InvoiceDetails.map((item: any) => ({
        productId: item.ItemCode,
        description: item.ItemName,
        quantity: item.Quantity,
        unitPrice: item.UnitPrice,
        lineTotal: item.Amount,
        taxCode: 'VAT_10',
        taxRate: item.VATRate,
        taxAmount: item.VATAmount,
      })),
      payments: [],
    };
  }

  private mapMISAReportResponse(
    type: FinancialReport['type'],
    data: any,
    startDate: Date,
    endDate: Date
  ): FinancialReport {
    return {
      type,
      period: { startDate, endDate },
      currency: 'VND',
      data: data.ReportData || [],
      totals: data.Totals || {},
    };
  }

  private mapQuickBooksInvoiceResponse(data: any): Invoice {
    return {
      id: data.Id,
      invoiceNumber: data.DocNumber,
      customerId: data.CustomerRef.value,
      customerName: data.CustomerRef.name,
      customerEmail: '',
      customerAddress: '',
      issueDate: new Date(data.TxnDate),
      dueDate: new Date(data.DueDate),
      currency: 'USD',
      subtotal: data.TotalAmt,
      taxTotal: 0,
      total: data.TotalAmt,
      status: 'SENT',
      lineItems: data.Line.map((line: any) => ({
        description: line.SalesItemLineDetail?.ItemRef?.name || '',
        quantity: line.SalesItemLineDetail?.Qty || 1,
        unitPrice: line.SalesItemLineDetail?.UnitPrice || 0,
        lineTotal: line.Amount,
      })),
      payments: [],
    };
  }

  private mapXeroInvoiceResponse(data: any): Invoice {
    return {
      id: data.InvoiceID,
      invoiceNumber: data.InvoiceNumber,
      customerId: data.Contact.ContactID,
      customerName: data.Contact.Name,
      customerEmail: '',
      customerAddress: '',
      issueDate: new Date(data.Date),
      dueDate: new Date(data.DueDate),
      currency: data.CurrencyCode,
      subtotal: data.SubTotal,
      taxTotal: data.TotalTax,
      total: data.Total,
      status: 'SENT',
      lineItems: data.LineItems.map((item: any) => ({
        description: item.Description,
        quantity: item.Quantity,
        unitPrice: item.UnitAmount,
        lineTotal: item.LineAmount,
        taxAmount: item.TaxAmount,
      })),
      payments: [],
    };
  }
}

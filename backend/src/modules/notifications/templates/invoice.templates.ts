import { OrderEmailData } from './email.templates';

export interface InvoiceData extends OrderEmailData {
  invoiceNo: string;
  invoiceDate: string;
  dueDate?: string;
  taxCode?: string;
  companyName?: string;
  companyAddress?: string;
  subTotal: string;
  taxAmount: string;
  discountAmount?: string;
  notes?: string;
}

export const invoiceTemplates = {
  standard: (data: InvoiceData) => {
    const itemsHtml = data.items
      .map(
        (item, index) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; color: #6b7280;">${index + 1}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <div style="font-weight: 500; color: #1f2937;">${item.name}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; color: #4b5563;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; color: #4b5563;">${item.price}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; color: #1f2937; font-weight: 500;">
          ${(parseFloat(item.price.replace(/[^0-9.-]+/g, '')) * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </td>
      </tr>
    `,
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Hóa đơn #${data.invoiceNo}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f3f4f6; }
          .invoice-box { max-width: 800px; margin: 0 auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); font-size: 16px; line-height: 24px; font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; color: #555; background-color: #fff; }
          .invoice-box table { width: 100%; line-height: inherit; text-align: left; }
          .invoice-box table td { padding: 5px; vertical-align: top; }
          .invoice-box table tr td:nth-child(2) { text-align: right; }
          .invoice-box table tr.top table td { padding-bottom: 20px; }
          .invoice-box table tr.top table td.title { font-size: 45px; line-height: 45px; color: #333; }
          .invoice-box table tr.information table td { padding-bottom: 40px; }
          .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
          .invoice-box table tr.details td { padding-bottom: 20px; }
          .invoice-box table tr.item td{ border-bottom: 1px solid #eee; }
          .invoice-box table tr.item.last td { border-bottom: none; }
          .invoice-box table tr.total td:nth-child(2) { border-top: 2px solid #eee; font-weight: bold; }
          
          @media only screen and (max-width: 600px) {
            .invoice-box table tr.top table td { width: 100%; display: block; text-align: center; }
            .invoice-box table tr.information table td { width: 100%; display: block; text-align: center; }
          }
          
          /** RTL **/
          .rtl { direction: rtl; font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; }
          .rtl table { text-align: right; }
          .rtl table tr td:nth-child(2) { text-align: left; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <table cellpadding="0" cellspacing="0">
            <tr class="top">
              <td colspan="5">
                <table>
                  <tr>
                    <td class="title">
                      <h1 style="color: #2563eb; margin: 0;">Audio Tài Lộc</h1>
                    </td>
                    
                    <td>
                      Hóa đơn #: ${data.invoiceNo}<br>
                      Ngày tạo: ${data.invoiceDate}<br>
                      ${data.dueDate ? `Hạn thanh toán: ${data.dueDate}` : ''}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <tr class="information">
              <td colspan="5">
                <table>
                  <tr>
                    <td>
                      Audio Tài Lộc<br>
                      123 Đường ABC<br>
                      Quận XYZ, TP.HCM
                    </td>
                    
                    <td>
                      ${data.companyName || data.customerName}<br>
                      ${data.companyAddress || data.shippingAddress || ''}<br>
                      ${data.taxCode ? `MST: ${data.taxCode}` : ''}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <tr class="heading">
              <td style="text-align: center; width: 5%;">STT</td>
              <td style="width: 40%;">Mô tả</td>
              <td style="text-align: center; width: 15%;">Số lượng</td>
              <td style="text-align: right; width: 20%;">Đơn giá</td>
              <td style="text-align: right; width: 20%;">Thành tiền</td>
            </tr>
            
            ${itemsHtml}
            
            <tr class="total">
              <td colspan="3"></td>
              <td style="text-align: right; padding-top: 20px;">Tạm tính:</td>
              <td style="text-align: right; padding-top: 20px;">${data.subTotal}</td>
            </tr>
            ${
              data.discountAmount
                ? `
            <tr>
              <td colspan="3"></td>
              <td style="text-align: right;">Giảm giá:</td>
              <td style="text-align: right;">-${data.discountAmount}</td>
            </tr>
            `
                : ''
            }
            <tr>
              <td colspan="3"></td>
              <td style="text-align: right;">Thuế (VAT):</td>
              <td style="text-align: right;">${data.taxAmount}</td>
            </tr>
            <tr>
              <td colspan="3"></td>
              <td style="text-align: right; font-size: 18px; color: #2563eb; font-weight: bold; padding-top: 10px;">Tổng cộng:</td>
              <td style="text-align: right; font-size: 18px; color: #2563eb; font-weight: bold; padding-top: 10px;">${data.totalAmount}</td>
            </tr>
          </table>

          ${
            data.notes
              ? `
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <strong>Ghi chú:</strong>
            <p style="margin-top: 5px; color: #666;">${data.notes}</p>
          </div>
          `
              : ''
          }

          <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #888;">
            <p>Cảm ơn quý khách đã sử dụng dịch vụ của Audio Tài Lộc!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  },
};

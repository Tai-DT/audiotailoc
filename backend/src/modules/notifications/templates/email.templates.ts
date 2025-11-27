export interface OrderEmailData {
  orderNo: string;
  customerName: string;
  totalAmount: string;
  items: Array<{ name: string; quantity: number; price: string }>;
  status: string;
  trackingUrl?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  createdAt?: string;
}

export const emailTemplates = {
  orderConfirmation: (data: OrderEmailData) => {
    const itemsHtml = data.items
      .map(
        item => `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #eee;">
          <div style="font-weight: 500; color: #1f2937;">${item.name}</div>
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #eee; text-align: center; color: #4b5563;">${item.quantity}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #eee; text-align: right; color: #1f2937; font-weight: 500;">${item.price}</td>
      </tr>
    `,
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận đơn hàng</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background-color: #2563eb; padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Audio Tài Lộc</h1>
            <p style="color: #e0e7ff; margin: 5px 0 0 0; font-size: 14px;">Âm thanh đỉnh cao - Trải nghiệm tuyệt vời</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #111827; margin: 0 0 10px 0; font-size: 20px;">Cảm ơn bạn đã đặt hàng!</h2>
              <p style="margin: 0; color: #6b7280;">Đơn hàng #${data.orderNo} của bạn đã được tiếp nhận.</p>
            </div>

            <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <h3 style="margin-top: 0; color: #374151; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Thông tin khách hàng</h3>
              <p style="margin: 5px 0;"><strong>Họ tên:</strong> ${data.customerName}</p>
              ${data.shippingAddress ? `<p style="margin: 5px 0;"><strong>Địa chỉ giao hàng:</strong> ${data.shippingAddress}</p>` : ''}
              ${data.paymentMethod ? `<p style="margin: 5px 0;"><strong>Phương thức thanh toán:</strong> ${data.paymentMethod}</p>` : ''}
            </div>

            <div style="margin-bottom: 30px;">
              <h3 style="color: #374151; font-size: 16px; margin-bottom: 15px;">Chi tiết đơn hàng</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                  <tr style="background-color: #f3f4f6; color: #6b7280; text-transform: uppercase; font-size: 12px;">
                    <th style="padding: 10px 8px; text-align: left;">Sản phẩm</th>
                    <th style="padding: 10px 8px; text-align: center;">SL</th>
                    <th style="padding: 10px 8px; text-align: right;">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 15px 8px; text-align: right; font-weight: bold; color: #374151;">Tổng cộng:</td>
                    <td style="padding: 15px 8px; text-align: right; font-weight: bold; color: #2563eb; font-size: 16px;">${data.totalAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style="text-align: center; color: #6b7280; font-size: 14px;">
              <p>Chúng tôi sẽ thông báo ngay khi đơn hàng được giao cho đơn vị vận chuyển.</p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${data.orderNo}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; margin-top: 10px;">Theo dõi đơn hàng</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} Audio Tài Lộc. All rights reserved.</p>
            <p style="margin: 0;">
              Hotline: 1900-xxxx | Email: <a href="mailto:support@audiotailoc.com" style="color: #2563eb; text-decoration: none;">support@audiotailoc.com</a>
            </p>
            <p style="margin: 10px 0 0 0;">Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  welcome: (customerName: string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chào mừng đến với Audio Tài Lộc</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background-color: #2563eb; padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Chào mừng bạn! 🎉</h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px;">Xin chào <strong>${customerName}</strong>,</p>
            
            <p>Cảm ơn bạn đã trở thành thành viên của đại gia đình <strong>Audio Tài Lộc</strong>. Chúng tôi rất vui được đồng hành cùng bạn trên hành trình trải nghiệm âm thanh đỉnh cao.</p>
            
            <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 20px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #1e40af; font-size: 18px;">Tại sao chọn Audio Tài Lộc?</h3>
              <ul style="margin-bottom: 0; padding-left: 20px; color: #1e3a8a;">
                <li style="margin-bottom: 8px;">Sản phẩm chính hãng 100%</li>
                <li style="margin-bottom: 8px;">Bảo hành uy tín, dài hạn</li>
                <li style="margin-bottom: 8px;">Tư vấn kỹ thuật chuyên sâu</li>
                <li>Hỗ trợ lắp đặt tận nơi</li>
              </ul>
            </div>

            <p>Hãy bắt đầu khám phá các sản phẩm mới nhất của chúng tôi ngay hôm nay!</p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">Khám phá ngay</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0;">Kết nối với chúng tôi trên mạng xã hội</p>
            <div style="margin: 10px 0;">
              <!-- Social icons placeholders -->
              <span style="display: inline-block; width: 24px; height: 24px; background-color: #d1d5db; border-radius: 50%; margin: 0 5px;"></span>
              <span style="display: inline-block; width: 24px; height: 24px; background-color: #d1d5db; border-radius: 50%; margin: 0 5px;"></span>
              <span style="display: inline-block; width: 24px; height: 24px; background-color: #d1d5db; border-radius: 50%; margin: 0 5px;"></span>
            </div>
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Audio Tài Lộc.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  },
};

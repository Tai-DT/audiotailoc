import { emailTemplates } from '../src/modules/notifications/templates/email.templates';
import { invoiceTemplates } from '../src/modules/notifications/templates/invoice.templates';

async function testTemplates() {
  console.log('Starting Email & Invoice Templates Test...\n');

  // 1. Test Welcome Email
  console.log('--- Testing Welcome Email ---');
  try {
    const welcomeHtml = emailTemplates.welcome('Nguyễn Văn A');
    console.log('Rendered Welcome Email Length:', welcomeHtml.length);
    console.log('Contains customer name:', welcomeHtml.includes('Nguyễn Văn A'));
    console.log('✅ Welcome Email Template: OK\n');
  } catch (error) {
    console.error('❌ Welcome Email Template: FAILED', error);
  }

  // 2. Test Order Confirmation Email
  console.log('--- Testing Order Confirmation Email ---');
  try {
    const orderData = {
      orderNo: 'ORD-123456',
      customerName: 'Nguyễn Văn A',
      items: [
        { name: 'Loa Bluetooth Sony', quantity: 1, price: '2.500.000 ₫' },
        { name: 'Tai nghe Marshall', quantity: 2, price: '3.000.000 ₫' },
      ],
      totalAmount: '8.500.000 ₫',
      shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
      paymentMethod: 'COD',
      status: 'PENDING',
      createdAt: new Date().toLocaleString('vi-VN'),
    };
    const orderHtml = emailTemplates.orderConfirmation(orderData);
    console.log('Rendered Order Confirmation Length:', orderHtml.length);
    console.log('Contains Order No:', orderHtml.includes('ORD-123456'));
    console.log('Contains Item Name:', orderHtml.includes('Loa Bluetooth Sony'));
    console.log('✅ Order Confirmation Template: OK\n');
  } catch (error) {
    console.error('❌ Order Confirmation Template: FAILED', error);
  }

  // 3. Test Invoice
  console.log('--- Testing Invoice ---');
  try {
    const invoiceData = {
      orderNo: 'ORD-2023-001',
      status: 'completed',
      invoiceNo: 'INV-2023-001',
      invoiceDate: new Date().toLocaleDateString('vi-VN'),
      customerName: 'Công ty TNHH ABC',
      customerAddress: '456 Đường XYZ, Quận 3, TP.HCM',
      taxCode: '0123456789',
      items: [
        { name: 'Loa Bluetooth Sony', quantity: 1, price: '2.500.000 ₫', total: '2.500.000 ₫' },
        { name: 'Tai nghe Marshall', quantity: 2, price: '3.000.000 ₫', total: '6.000.000 ₫' },
      ],
      subTotal: '8.500.000 ₫',
      taxAmount: '850.000 ₫',
      totalAmount: '9.350.000 ₫',
      paymentMethod: 'Chuyển khoản',
    };
    const invoiceHtml = invoiceTemplates.standard(invoiceData);
    console.log('Rendered Invoice Length:', invoiceHtml.length);
    console.log('Contains Invoice No:', invoiceHtml.includes('INV-2023-001'));
    console.log('Contains Tax Code:', invoiceHtml.includes('0123456789'));
    console.log('✅ Invoice Template: OK\n');
  } catch (error) {
    console.error('❌ Invoice Template: FAILED', error);
  }

  console.log('Test Completed.');
}

testTemplates();
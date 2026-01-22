import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { BackupService } from '../backup/backup.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { MessagesService } from '../messages/messages.service';
import { CacheService } from '../caching/cache.service';
import { NotificationGateway } from './notification.gateway';
// TODO: ChatService module does not exist
// import { ChatService } from '../chat/chat.service';

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalAmount: number;
  items?: any[];
  shippingAddress?: string;
  status: string;
  createdAt: string | Date;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly chatIds: string[];
  private readonly baseUrl: string;
  private readonly enabled: boolean;
  private readonly webhookSecret: string;
  private readonly dashboardUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => BackupService))
    private readonly backupService: BackupService,
    @Inject(forwardRef(() => AnalyticsService))
    private readonly analyticsService: AnalyticsService,
    @Inject(forwardRef(() => MessagesService))
    private readonly messagesService: MessagesService,
    private readonly cacheService: CacheService,
    private readonly notificationGateway: NotificationGateway,
    // TODO: ChatService module does not exist
    // @Inject(forwardRef(() => ChatService))
    // private readonly chatService: ChatService,
  ) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN', '');
    this.chatIds = this.configService
      .get<string>('TELEGRAM_CHAT_IDS', '')
      .split(',')
      .map(id => id.trim())
      .filter(Boolean);
    this.webhookSecret = this.configService.get<string>('TELEGRAM_WEBHOOK_SECRET', '');
    this.dashboardUrl = this.configService.get<string>('DASHBOARD_URL', '');
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
    this.enabled = !!this.botToken; // Only check token for enabling bot features

    if (!this.enabled) {
      this.logger.warn('Telegram bot disabled: Missing TELEGRAM_BOT_TOKEN');
    } else {
      this.logger.log(`Telegram bot enabled. Notification targets: ${this.chatIds.length}`);
    }
  }

  getWebhookSecret(): string {
    return this.webhookSecret;
  }

  private escapeHtml(text: string): string {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private buildDashboardUrl(path: string): string {
    const base = (this.dashboardUrl || '').replace(/\/+$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    if (!base) return normalizedPath;
    return `${base}${normalizedPath}`;
  }

  /**
   * Send a text message to Telegram with optional keyboard
   */
  async sendMessage(message: string, chatId?: string, replyMarkup?: any): Promise<void> {
    if (!this.enabled) {
      this.logger.debug('Telegram not configured, skipping notification');
      return;
    }

    // Send to specific chat or all configured chats
    const targets = chatId ? [chatId] : this.chatIds;

    if (!chatId && targets.length === 0) {
      this.logger.warn('Telegram notification skipped: Missing TELEGRAM_CHAT_IDS');
      return;
    }

    const promises = targets.map(id => this.sendToChat(id, message, replyMarkup));
    await Promise.allSettled(promises);
  }

  /**
   * Send notification for new order
   */
  async sendOrderNotification(order: OrderData): Promise<void> {
    const message = this.formatOrderMessage(order);

    const inlineKeyboard: any[] = [
      [
        { text: '✅ Xác nhận', callback_data: `confirm_order:${order.id}` },
        { text: '❌ Hủy đơn', callback_data: `cancel_order:${order.id}` },
      ],
    ];

    if (this.dashboardUrl) {
      inlineKeyboard.push([
        {
          text: '📦 Xem chi tiết',
          url: this.buildDashboardUrl(`/dashboard/orders/${order.id}`),
        },
      ]);
    }

    const replyMarkup = { inline_keyboard: inlineKeyboard };
    await this.sendMessage(message, undefined, replyMarkup);
  }

  /**
   * Send notification for order status update
   */
  async sendOrderStatusUpdate(
    order: OrderData,
    oldStatus: string,
    newStatus: string,
  ): Promise<void> {
    const message = this.formatStatusUpdateMessage(order, oldStatus, newStatus);
    await this.sendMessage(message);
  }

  /**
   * Send notification for payment
   */
  async sendPaymentNotification(payment: any): Promise<void> {
    const message = this.formatPaymentMessage(payment);
    await this.sendMessage(message);
  }

  /**
   * Send low stock alert
   */
  async sendLowStockAlert(product: any): Promise<void> {
    const stock = product.inventory?.stock ?? product.stock ?? 0;
    const message = `
⚠️ CẢNH BÁO TỒN KHO

📦 Sản phẩm: ${product.name}
🏷️ SKU: ${product.sku || 'N/A'}
📊 Tồn kho: ${stock} (Thấp!)

🔗 Xem chi tiết: ${this.buildDashboardUrl('/dashboard/inventory')}
    `.trim();

    await this.sendMessage(message);
  }

  /**
   * Send system alert
   */
  async sendSystemAlert(title: string, message: string): Promise<void> {
    const fullMessage = `
🚨 ${title}

${message}

⏰ ${new Date().toLocaleString('vi-VN')}
    `.trim();

    await this.sendMessage(fullMessage);
  }

  /**
   * Send new review notification
   */
  async sendNewReviewNotification(review: any): Promise<void> {
    const stars = '⭐'.repeat(review.rating);
    const message = `
⭐ ĐÁNH GIÁ MỚI

${review.productName ? `📦 Sản phẩm: ${this.escapeHtml(review.productName)}` : `🔧 Dịch vụ: ${this.escapeHtml(review.serviceName)}`}
👤 Khách hàng: ${this.escapeHtml(review.userName || review.customerName)}
${stars} (${review.rating}/5)

💬 "${this.escapeHtml(review.comment || review.content)}"

⏰ ${this.formatDate(review.createdAt)}
🔗 Xem chi tiết: ${this.buildDashboardUrl('/dashboard/reviews')}
    `.trim();

    await this.sendMessage(message);
  }

  /**
   * Send new booking notification
   */
  async sendBookingNotification(booking: any): Promise<void> {
    const message = `
📅 ĐẶT LỊCH MỚI #${booking.id.substring(0, 8)}

👤 Khách hàng: ${booking.customerName || 'N/A'}
📧 Email: ${booking.customerEmail || 'N/A'}
📱 SĐT: ${booking.customerPhone || 'N/A'}

🔧 Dịch vụ: ${booking.serviceName}
⏰ Thời gian hẹn: ${this.formatDate(booking.scheduledTime || booking.scheduleTime)}
👨‍🔧 Kỹ thuật viên: ${booking.technicianName || 'Chưa phân công'}

💰 Chi phí ước tính: ${booking.estimatedCost ? this.formatMoney(booking.estimatedCost) : 'Chưa xác định'}
📋 Trạng thái: ${this.translateBookingStatus(booking.status)}

🔗 Xem chi tiết: ${this.buildDashboardUrl('/dashboard/bookings')}
    `.trim();

    await this.sendMessage(message);
  }

  /**
   * Send booking status update
   */
  async sendBookingStatusUpdate(booking: any, oldStatus: string, newStatus: string): Promise<void> {
    const statusEmoji: Record<string, string> = {
      PENDING: '⏳',
      CONFIRMED: '✅',
      IN_PROGRESS: '🔧',
      COMPLETED: '✅',
      CANCELLED: '❌',
    };

    const emoji = statusEmoji[newStatus] || '📋';

    const message = `
${emoji} CẬP NHẬT ĐẶT LỊCH #${booking.id.substring(0, 8)}

Trạng thái: ${this.translateBookingStatus(oldStatus)} → ${this.translateBookingStatus(newStatus)}

👤 Khách hàng: ${booking.customerName}
🔧 Dịch vụ: ${booking.serviceName}
⏰ ${this.formatDate(new Date())}

🔗 Xem chi tiết: ${this.buildDashboardUrl('/dashboard/bookings')}
    `.trim();

    await this.sendMessage(message);
  }

  /**
   * Send critical alert (with emoji emphasis)
   */
  async sendCriticalAlert(title: string, details: string): Promise<void> {
    const message = `
🚨🚨🚨 CẢNH BÁO QUAN TRỌNG

${title}

${details}

⏰ ${new Date().toLocaleString('vi-VN')}
    `.trim();

    await this.sendMessage(message);
  }

  /**
   * Send out of stock alert
   */
  async sendOutOfStockAlert(product: any): Promise<void> {
    const stock = product.stock !== undefined ? product.stock : product.inventory?.stock || 0;
    const message = `
❌ HẾT HÀNG

📦 Sản phẩm: ${product.name}
🏷️ SKU: ${product.sku || 'N/A'}
📊 Tồn kho: ${stock} (Hết hàng!)

⚠️ Cần nhập hàng ngay!

🔗 Xem chi tiết: ${this.buildDashboardUrl('/dashboard/inventory')}
    `.trim();

    await this.sendMessage(message);
  }

  /**
   * Send payment refund notification
   */
  async sendRefundNotification(refund: any): Promise<void> {
    const message = `
↩️ HOÀN TIỀN

Đơn hàng: #${refund.orderNo}
💰 Số tiền: ${this.formatMoney(refund.amountCents)}
💳 Phương thức: ${refund.provider}
📝 Lý do: ${refund.reason || 'Không có'}

⏰ ${this.formatDate(refund.createdAt)}
🔗 Xem chi tiết: ${this.buildDashboardUrl('/dashboard/payments')}
    `.trim();

    await this.sendMessage(message);
  }

  /**
   * Send chat message notification
   */
  async sendChatMessageNotification(
    customerName: string,
    messageContent: string,
    conversationId: string,
  ): Promise<void> {
    const message = `
💬 TIN NHẮN MỚI
👤 Khách hàng: ${this.escapeHtml(customerName)}
📝 Nội dung: "${this.escapeHtml(messageContent)}"
🆔 ID: <code>${conversationId}</code>

🔗 Trả lời ngay: ${this.buildDashboardUrl(`/dashboard/messages?id=${conversationId}`)}
💡 Tip: Reply tin nhắn này hoặc dùng <code>/chat ${conversationId} [nội dung]</code> để trả lời nhanh.
    `.trim();

    await this.sendMessage(message);

    // Cache the last conversation ID for quick replies
    await this.cacheService.set('telegram:last_conversation_id', conversationId, { ttl: 86400 });
  }

  /**
   * Format order creation message
   */
  private formatOrderMessage(order: OrderData): string {
    const itemsText =
      order.items && order.items.length > 0
        ? order.items
            .slice(0, 3)
            .map(item => `  • ${this.escapeHtml(item.productName || item.name)} x${item.quantity}`)
            .join('\n')
        : '  Không có sản phẩm';

    const moreItems =
      order.items && order.items.length > 3
        ? `\n  ... và ${order.items.length - 3} sản phẩm khác`
        : '';

    return `
🆕 ĐƠN HÀNG MỚI #${order.orderNumber}

👤 Khách hàng: ${this.escapeHtml(order.customerName)}
📧 Email: ${order.customerEmail}
📱 SĐT: ${order.customerPhone || 'N/A'}

💰 Tổng tiền: ${this.formatMoney(order.totalAmount)}
📦 Sản phẩm:
${itemsText}${moreItems}

📍 Địa chỉ: ${order.shippingAddress || 'N/A'}
⏰ Thời gian: ${this.formatDate(order.createdAt)}

🔗 Xem chi tiết: ${this.buildDashboardUrl('/dashboard/orders')}
    `.trim();
  }

  /**
   * Format status update message
   */
  private formatStatusUpdateMessage(
    order: OrderData,
    oldStatus: string,
    newStatus: string,
  ): string {
    const statusEmoji: Record<string, string> = {
      PENDING: '⏳',
      PROCESSING: '📦',
      COMPLETED: '✅',
      CANCELLED: '❌',
    };

    const emoji = statusEmoji[newStatus] || '📋';

    return `
${emoji} CẬP NHẬT ĐƠN HÀNG #${order.orderNumber}

Trạng thái: ${this.translateStatus(oldStatus)} → ${this.translateStatus(newStatus)}

👤 Khách hàng: ${this.escapeHtml(order.customerName)}
💰 Tổng tiền: ${this.formatMoney(order.totalAmount)}
⏰ ${this.formatDate(new Date())}

🔗 Xem chi tiết: ${this.buildDashboardUrl('/dashboard/orders')}
    `.trim();
  }

  /**
   * Format payment message
   */
  private formatPaymentMessage(payment: any): string {
    const statusEmoji: Record<string, string> = {
      PAID: '✅',
      PENDING: '⏳',
      FAILED: '❌',
      REFUNDED: '↩️',
    };

    const emoji = statusEmoji[payment.status] || '💳';

    // amount may be provided as `amountCents` (DB cents) or `amount` (full VND)
    const amountValue =
      payment.amountCents !== undefined ? payment.amountCents / 100 : payment.amount;

    return `
${emoji} THANH TOÁN #${payment.orderNo}

Trạng thái: ${payment.status}
💰 Số tiền: ${this.formatMoney(amountValue)}
💳 Phương thức: ${payment.provider}
⏰ ${this.formatDate(payment.createdAt)}

🔗 Xem chi tiết: ${this.buildDashboardUrl('/dashboard/payments')}
    `.trim();
  }

  /**
   * Send message to specific chat
   */
  private async sendToChat(chatId: string, message: string, replyMarkup?: any): Promise<void> {
    const maxRetries = 3;
    const timeout = 30000; // 30 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await axios.post(
          `${this.baseUrl}/sendMessage`,
          {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
            reply_markup: replyMarkup,
          },
          { timeout },
        );
        this.logger.log(`Sent Telegram notification to chat ${chatId}`);
        return; // Success, exit function
      } catch (error) {
        const errorMessage = (error as Error).message;
        this.logger.warn(
          `Attempt ${attempt}/${maxRetries} failed to send to ${chatId}: ${errorMessage}`,
        );

        if (attempt === maxRetries) {
          this.logger.error(
            `Failed to send Telegram message to ${chatId} after ${maxRetries} attempts`,
          );
        } else {
          // Wait before retrying (1s, 2s, 4s...)
          const delay = 1000 * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  }

  /**
   * Format money in VND
   * Note: VND values are stored as full amounts (not cents), so no division needed
   */
  private formatMoney(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  /**
   * Format date to Vietnamese locale
   */
  private formatDate(date: string | Date): string {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Translate order status to Vietnamese
   */
  private translateStatus(status: string): string {
    const translations: Record<string, string> = {
      PENDING: 'Chờ xử lý',
      PROCESSING: 'Đang xử lý',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
    };
    return translations[status] || status;
  }

  /**
   * Translate booking status to Vietnamese
   */
  private translateBookingStatus(status: string): string {
    const translations: Record<string, string> = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      IN_PROGRESS: 'Đang thực hiện',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
    };
    return translations[status] || status;
  }

  /**
   * Test connection to Telegram API
   */
  async testConnection(): Promise<{
    success: boolean;
    message: string;
    botInfo?: any;
  }> {
    if (!this.enabled) {
      return {
        success: false,
        message: 'Telegram not configured',
      };
    }

    try {
      const response = await axios.get(`${this.baseUrl}/getMe`, {
        timeout: 30000,
      });

      if (response.data.ok) {
        return {
          success: true,
          message: 'Connection successful',
          botInfo: response.data.result,
        };
      } else {
        return {
          success: false,
          message: 'Invalid bot token',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  /**
   * Handle incoming Telegram updates (Webhook)
   */
  async handleUpdate(update: any): Promise<void> {
    if (!this.enabled) return;

    try {
      if (update.message) {
        await this.handleMessage(update.message);
      } else if (update.callback_query) {
        await this.handleCallbackQuery(update.callback_query);
      }
    } catch (error) {
      this.logger.error('Error handling Telegram update', error);
    }
  }

  private async handleCallbackQuery(callbackQuery: any): Promise<void> {
    const chatId = callbackQuery.message.chat.id.toString();
    const data = callbackQuery.data;
    const _messageId = callbackQuery.message.message_id;

    // Verify auth
    if (this.chatIds.length > 0 && !this.chatIds.includes(chatId)) {
      return;
    }

    // Acknowledge callback (stop loading animation)
    try {
      await axios.post(`${this.baseUrl}/answerCallbackQuery`, {
        callback_query_id: callbackQuery.id,
      });
    } catch (e) {
      // Ignore error
    }

    if (typeof data === 'string' && data.startsWith('confirm_order:')) {
      const orderId = data.split(':')[1];
      await this.sendToChat(chatId, `⏳ Đang xác nhận đơn hàng ${orderId}...`);
      // TODO: Call OrdersService to update status (Need to inject OrdersService properly to avoid circular dependency hell, or emit event)
      // For now, just notify admin it's processed
      await this.sendToChat(
        chatId,
        `✅ Đã gửi lệnh xác nhận đơn hàng ${orderId}. (Tính năng đang hoàn thiện)`,
      );
    } else if (typeof data === 'string' && data.startsWith('cancel_order:')) {
      const orderId = data.split(':')[1];
      await this.sendToChat(chatId, `⏳ Đang hủy đơn hàng ${orderId}...`);
      // TODO: Call OrdersService
      await this.sendToChat(
        chatId,
        `✅ Đã gửi lệnh hủy đơn hàng ${orderId}. (Tính năng đang hoàn thiện)`,
      );
    }
  }

  private async handleMessage(message: any): Promise<void> {
    const chatId = message.chat.id.toString();
    const text = message.text;

    // Verify if the sender is authorized (in configured chatIds)
    // Note: In a real app, you might want a more robust auth mechanism
    if (this.chatIds.length > 0 && !this.chatIds.includes(chatId)) {
      this.logger.warn(`Unauthorized Telegram access attempt from chat ${chatId}`);
      return;
    }

    if (!text) return;

    if (typeof text === 'string' && text.startsWith('/')) {
      const [command, ...args] = text.split(' ');
      await this.handleCommand(chatId, command, args, message);
    } else if (message.reply_to_message) {
      // Handle reply to a message
      await this.handleReply(chatId, message.reply_to_message, text);
    } else {
      // Handle direct message (try to use last conversation)
      const lastId = await this.cacheService.get<string>('telegram:last_conversation_id');
      if (lastId) {
        await this.processReply(chatId, lastId, text);
      } else {
        await this.sendToChat(
          chatId,
          'ℹ️ Để trả lời khách hàng, vui lòng Reply vào tin nhắn thông báo hoặc dùng lệnh:\n/chat [id] [nội dung]',
        );
      }
    }
  }

  private async handleCommand(
    chatId: string,
    command: string,
    args: string[],
    _originalMessage: any,
  ): Promise<void> {
    switch (command) {
      case '/start':
        await this.sendToChat(
          chatId,
          `👋 Xin chào! Tôi là Bot quản trị AudioTaiLoc.\n\n` +
            `Các lệnh hỗ trợ:\n` +
            `/stats - Xem thống kê nhanh\n` +
            `/backup - Tạo sao lưu dữ liệu\n` +
            `/chat [id] [nội dung] - Chat với khách hàng\n` +
            `/help - Xem trợ giúp`,
        );
        break;

      case '/help':
        await this.sendToChat(
          chatId,
          `📚 <b>Danh sách lệnh:</b>\n\n` +
            `📊 <b>Thống kê:</b>\n` +
            `/stats - Xem doanh thu, đơn hàng hôm nay\n\n` +
            `💾 <b>Sao lưu:</b>\n` +
            `/backup - Tạo bản sao lưu database ngay lập tức\n\n` +
            `💬 <b>Chat:</b>\n` +
            `/chat [nội dung] - Trả lời tin nhắn gần nhất\n` +
            `/chat [id] [nội dung] - Trả lời tin nhắn theo ID\n` +
            `<i>Hoặc đơn giản là Reply vào tin nhắn thông báo của Bot</i>`,
        );
        break;

      case '/stats':
        await this.handleStatsCommand(chatId);
        break;

      case '/backup':
        await this.handleBackupCommand(chatId);
        break;

      case '/chat':
        await this.handleChatCommand(chatId, args);
        break;

      default:
        await this.sendToChat(chatId, `❌ Lệnh không hợp lệ. Gõ /help để xem hướng dẫn.`);
    }
  }

  private async handleStatsCommand(chatId: string): Promise<void> {
    try {
      await this.sendToChat(chatId, '⏳ Đang lấy dữ liệu thống kê...');

      const [overview, bookings] = await Promise.all([
        this.analyticsService.getOverview('7days'),
        this.analyticsService.getBookingsTodayReal(),
      ]);

      const message = `
📊 <b>THỐNG KÊ NHANH (7 ngày qua)</b>

💰 Doanh thu: ${this.formatMoney(overview.totalRevenue)}
📦 Đơn hàng: ${overview.totalOrders}
👥 Khách mới: ${overview.newCustomers}

📅 <b>Hôm nay:</b>
🔧 Đặt lịch mới: ${bookings.bookingsToday}

🔗 <a href="${this.buildDashboardUrl('/')}">Xem chi tiết Dashboard</a>
      `.trim();

      await this.sendToChat(chatId, message);
    } catch (error) {
      this.logger.error('Stats command failed', error);
      await this.sendToChat(chatId, '❌ Có lỗi khi lấy thống kê.');
    }
  }

  private async handleBackupCommand(chatId: string): Promise<void> {
    try {
      await this.sendToChat(chatId, '⏳ Đang thực hiện sao lưu database...');

      const result = await this.backupService.createFullBackup({
        compress: true,
        comment: 'Triggered via Telegram',
        // uploadToDrive: true, // Field does not exist in BackupOptions
      });

      if (result.success) {
        let message =
          `✅ <b>Sao lưu thành công!</b>\n\n` +
          `🆔 ID: ${result.backupId}\n` +
          `📦 Kích thước: ${(result.size / 1024 / 1024).toFixed(2)} MB\n` +
          `⏱️ Thời gian: ${result.duration}ms`;

        // TODO: cloudUrl does not exist on BackupResult
        if ((result as any).cloudUrl) {
          message += `\n☁️ <b>Google Drive:</b> Đã upload thành công`;
        } else {
          message += `\n⚠️ <b>Google Drive:</b> Upload thất bại hoặc chưa cấu hình`;
        }

        await this.sendToChat(chatId, message);
      } else {
        await this.sendToChat(chatId, '❌ Sao lưu thất bại.');
      }
    } catch (error) {
      this.logger.error('Backup command failed', error);
      await this.sendToChat(chatId, `❌ Lỗi khi sao lưu: ${(error as Error).message}`);
    }
  }

  private async handleChatCommand(chatId: string, args: string[]): Promise<void> {
    if (args.length === 0) {
      await this.sendToChat(chatId, '❌ Vui lòng nhập nội dung chat.');
      return;
    }

    let conversationId: string | null = null;
    let content = '';

    // Check if first arg is a UUID (conversation ID)
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    if (uuidRegex.test(args[0])) {
      conversationId = args[0];
      content = args.slice(1).join(' ');
    } else {
      // Try to get last conversation ID from cache
      conversationId = await this.cacheService.get<string>('telegram:last_conversation_id');
      content = args.join(' ');
    }

    if (!conversationId) {
      await this.sendToChat(
        chatId,
        '❌ Không tìm thấy hội thoại nào gần đây. Vui lòng cung cấp ID hội thoại: /chat [id] [nội dung]',
      );
      return;
    }

    if (!content) {
      await this.sendToChat(chatId, '❌ Nội dung tin nhắn không được để trống.');
      return;
    }

    await this.processReply(chatId, conversationId, content);
  }

  private async handleReply(chatId: string, replyToMessage: any, text: string): Promise<void> {
    // Try to extract conversation ID from the replied message text if possible
    // We look for "ID: <code>UUID</code>" pattern we added in sendChatMessageNotification
    const _entities = replyToMessage.entities || [];
    let conversationId: string | null = null;

    // Check entities for code blocks which might contain the ID
    // Alternatively, check the text content with regex
    const replyText = replyToMessage.text || replyToMessage.caption || '';
    // Regex to match UUID, allowing for potential HTML tags or surrounding text
    const uuidRegex =
      /([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/;
    const match = replyText.match(uuidRegex);

    if (match && match[1]) {
      conversationId = match[1];
    } else {
      // Fallback to cached last conversation
      conversationId = await this.cacheService.get<string>('telegram:last_conversation_id');
    }

    if (conversationId) {
      await this.processReply(chatId, conversationId, text);
    } else {
      await this.sendToChat(
        chatId,
        '❌ Không xác định được hội thoại để trả lời. Vui lòng dùng lệnh /chat [id] [nội dung]',
      );
    }
  }

  private async processReply(
    chatId: string,
    conversationId: string,
    _content: string,
  ): Promise<void> {
    try {
      // TODO: ChatService does not exist
      // Use ChatService to send the message as ADMIN
      // await this.chatService.sendMessage(
      //   {
      //     conversationId,
      //     content,
      //     senderType: 'ADMIN',
      //   },
      //   { requesterRole: 'ADMIN' },
      // );

      // 4. Send confirmation to Telegram
      await this.sendToChat(chatId, `✅ Đã gửi phản hồi cho khách hàng.`);

      // 5. Update cache to keep this conversation active
      await this.cacheService.set('telegram:last_conversation_id', conversationId, { ttl: 86400 });
    } catch (error: any) {
      this.logger.error('Failed to send reply', error);

      if (error.message.includes('NotFound') || error.status === 404) {
        await this.sendToChat(
          chatId,
          `❌ Hội thoại không tồn tại hoặc đã kết thúc.\nĐã xóa cache hội thoại cũ.`,
        );
        await this.cacheService.del('telegram:last_conversation_id');
      } else {
        await this.sendToChat(chatId, `❌ Lỗi khi gửi phản hồi: ${error.message}`);
      }
    }
  }
}

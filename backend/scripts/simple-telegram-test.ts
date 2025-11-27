import { Logger } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

async function testTelegram() {
  const logger = new Logger('SimpleTelegramTest');
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_IDS;

  if (!botToken || !chatId) {
    logger.error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_IDS is missing in .env');
    process.exit(1);
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const message = `
🚀 *Test Notification from Audio Tài Lộc*
--------------------------------
Đây là tin nhắn kiểm tra kết nối.
Nếu bạn nhận được tin nhắn này, Bot đã hoạt động chính xác!

📅 Time: ${new Date().toLocaleString('vi-VN')}
  `;

  try {
    logger.log(`Sending test message to chat ID: ${chatId}`);
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    });

    if (response.data.ok) {
      logger.log('✅ Message sent successfully!');
      logger.log('Message ID:', response.data.result.message_id);
    } else {
      logger.error('Failed to send message:', response.data);
    }
  } catch (error: any) {
    logger.error('Error sending message:', error.message);
    if (error.response) {
      logger.error('Response data:', error.response.data);
    }
  }
}

testTelegram();
import { Logger } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

async function setupWebhook() {
  const logger = new Logger('TelegramSetup');
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  // Get URL from command line args
  const webhookUrl = process.argv[2];

  if (!botToken) {
    logger.error('TELEGRAM_BOT_TOKEN is not defined in .env file');
    process.exit(1);
  }

  if (!webhookUrl) {
    logger.error('Please provide the webhook URL as an argument');
    logger.log('Usage: npx ts-node scripts/setup-telegram-webhook.ts https://your-domain.com/api/v1/notifications/telegram/webhook');
    process.exit(1);
  }

  const url = `https://api.telegram.org/bot${botToken}/setWebhook?url=${webhookUrl}`;

  try {
    logger.log(`Setting webhook to: ${webhookUrl}`);
    const response = await axios.get(url);
    
    if (response.data.ok) {
      logger.log('Webhook set successfully!');
      logger.log('Response:', response.data);
    } else {
      logger.error('Failed to set webhook:', response.data);
    }
  } catch (error: any) {
    logger.error('Error setting webhook:', error.message);
    if (error.response) {
      logger.error('Response data:', error.response.data);
    }
  }
}

setupWebhook();
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3010;
const WEBHOOK_URL = `http://localhost:${PORT}/api/v1/notifications/telegram/webhook`;
const ADMIN_ID = 7583101089; // Chat ID của admin

async function sendCommand(command: string) {
  console.log(`🚀 Sending command: ${command}`);

  const payload = {
    update_id: Math.floor(Math.random() * 1000000),
    message: {
      message_id: Math.floor(Math.random() * 1000),
      from: {
        id: ADMIN_ID,
        is_bot: false,
        first_name: 'Admin',
        username: 'admin_user'
      },
      chat: {
        id: ADMIN_ID,
        first_name: 'Admin',
        username: 'admin_user',
        type: 'private'
      },
      date: Math.floor(Date.now() / 1000),
      text: command
    }
  };

  try {
    await axios.post(WEBHOOK_URL, payload);
    console.log(`✅ Command ${command} sent successfully!`);
  } catch (error) {
    console.error(`❌ Error sending command ${command}:`, (error as any).message);
  }
}

async function main() {
  console.log('Testing Telegram Commands via Webhook...');
  
  await sendCommand('/help');
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await sendCommand('/stats');

  console.log('--------------------------------------------------');
  console.log('👉 Check your Telegram to see if the bot replied.');
  console.log('--------------------------------------------------');
}

main();
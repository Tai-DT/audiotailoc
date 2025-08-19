import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Lazy import to avoid type dependency at build time
const nodemailer = require('nodemailer');

@Injectable()
export class MailService {
  private transporter;
  private from: string;
  constructor(private readonly config: ConfigService) {
    try {
      this.transporter = nodemailer.createTransport({
        host: this.config.get('SMTP_HOST') || 'localhost',
        port: Number(this.config.get('SMTP_PORT') || '1025'),
      });
    } catch {
      this.transporter = {
        sendMail: async () => undefined,
      };
    }
    this.from = this.config.get('SMTP_FROM') || 'no-reply@audiotailoc.local';
  }

  async send(to: string, subject: string, text: string) {
    if (!this.transporter?.sendMail) return;
    await this.transporter.sendMail({ from: this.from, to, subject, text });
  }
}


import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async sendTestEmail(
    to: string,
    config?: { host: string; port: number; user: string; pass: string; from?: string },
  ) {
    if (config) {
      // Use provided configuration for testing
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: config.host,
          port: config.port,
          secure: config.port === 465, // true for 465, false for other ports
          auth: {
            user: config.user,
            pass: config.pass,
          },
          tls: {
            rejectUnauthorized: false, // Allow self-signed certs for testing
          },
        });

        await transporter.sendMail({
          from: config.from || config.user,
          to,
          subject: 'Test Email from Audio Tai Loc (Custom Config)',
          text: 'This is a test email sent from the settings page to verify your NEW email configuration.',
          html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                        <h2 style="color: #2563eb; text-align: center;">Test Email (Custom Config)</h2>
                        <p>Hello,</p>
                        <p>This is a test email sent from the <strong>Audio Tai Loc</strong> settings page to verify your <strong>NEW</strong> email configuration.</p>
                        <p><strong>Configuration used:</strong></p>
                        <ul>
                            <li>Host: ${config.host}</li>
                            <li>Port: ${config.port}</li>
                            <li>User: ${config.user}</li>
                        </ul>
                        <p>If you received this email, your new SMTP settings are working correctly.</p>
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
                            <p>Sent from Audio Tai Loc System</p>
                        </div>
                    </div>
                    `,
        });
        return { success: true, message: `Test email sent to ${to} using custom config` };
      } catch (error: any) {
        throw new Error(`Failed to send test email with custom config: ${error.message}`);
      }
    } else {
      // Use existing system configuration
      await this.mailService.send(
        to,
        'Test Email from Audio Tai Loc',
        'This is a test email sent from the settings page to verify email configuration.',
        `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #2563eb; text-align: center;">Test Email</h2>
                    <p>Hello,</p>
                    <p>This is a test email sent from the <strong>Audio Tai Loc</strong> settings page to verify your email configuration.</p>
                    <p>If you received this email, your SMTP settings are working correctly.</p>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
                        <p>Sent from Audio Tai Loc System</p>
                    </div>
                </div>
                `,
      );
      return { success: true, message: `Test email sent to ${to}` };
    }
  }

  async findAll() {
    // Mock implementation
    return {
      general: {
        siteName: 'Audio Tai Loc',
        siteDescription: 'Professional Audio Equipment',
        contactEmail: 'contact@audiotailoc.com',
      },
      email: {
        smtpHost: 'smtp.example.com',
        smtpPort: 587,
      },
      notifications: {
        enableEmailNotifications: true,
        enablePushNotifications: false,
      },
    };
  }

  async update(settings: any) {
    // Mock implementation
    return {
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    };
  }
}

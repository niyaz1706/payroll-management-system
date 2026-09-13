import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  private async getTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) return this.transporter;

    // First try Brevo if credentials exist, else fallback safely to Ethereal
    try {
      if (process.env.MAIL_USER && process.env.MAIL_PASS) {
        this.transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST || 'smtp-relay.brevo.com',
          port: Number(process.env.MAIL_PORT) || 587,
          secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });
        await this.transporter.verify();
        this.logger.log('Connected to Brevo SMTP successfully.');
        return this.transporter;
      }
    } catch (err) {
      this.logger.warn('Brevo SMTP auth rejected, switching to active Test SMTP Provider...');
    }

    const testAccount = await nodemailer.createTestAccount();
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return this.transporter;
  }

  async sendWelcomeNotification(to: string, employeeName: string): Promise<{ success: boolean; previewUrl?: string | false }> {
    try {
      const transporter = await this.getTransporter();
      const info = await transporter.sendMail({
        from: process.env.MAIL_FROM || '"Payroll HR" <no-reply@company.com>',
        to,
        subject: 'Welcome to the Payroll Management System',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 6px;">
            <h2 style="color: #2b6cb0;">Welcome, ${employeeName}!</h2>
            <p>Your employee account has been created. You can now log in to the portal to view payslips and file leaves.</p>
            <br/>
            <p style="color: #718096; font-size: 12px;">Automated notification from Payroll System.</p>
          </div>
        `,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.log(`Preview Delivered Mail: ${previewUrl}`);
      }
      return { success: true, previewUrl };
    } catch (error: any) {
      this.logger.error(`Mail failed: ${error?.message || error}`);
      return { success: false };
    }
  }

  async sendPasswordResetNotification(to: string, resetTokenOrOtp: string): Promise<boolean> {
    try {
      const transporter = await this.getTransporter();
      await transporter.sendMail({
        from: process.env.MAIL_FROM || '"Payroll Security" <no-reply@company.com>',
        to,
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 6px;">
            <h3 style="color: #c53030;">Password Reset Verification</h3>
            <p>We received a request to reset your password. Use the verification code below:</p>
            <h1 style="letter-spacing: 4px; color: #2d3748;">${resetTokenOrOtp}</h1>
            <p style="color: #718096; font-size: 13px;">This code expires in 15 minutes.</p>
          </div>
        `,
      });
      return true;
    } catch (error: any) {
      this.logger.error(`Reset mail failed: ${error?.message || error}`);
      return false;
    }
  }

  async sendPayslipNotification(to: string, employeeName: string, month: string): Promise<boolean> {
    try {
      const transporter = await this.getTransporter();
      await transporter.sendMail({
        from: process.env.MAIL_FROM || '"Payroll Accounts" <no-reply@company.com>',
        to,
        subject: `Payslip for ${month} - Payroll System`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 6px;">
            <h2 style="color: #2f855a;">Payslip Generated</h2>
            <p>Dear ${employeeName},</p>
            <p>Your salary slip for <strong>${month}</strong> has been generated.</p>
          </div>
        `,
      });
      return true;
    } catch (error: any) {
      this.logger.error(`Payslip mail failed: ${error?.message || error}`);
      return false;
    }
  }
}
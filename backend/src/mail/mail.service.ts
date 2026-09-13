import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  private async getTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) {
      return this.transporter;
    }

    // Ethereal auto-generated test credentials
    const testAccount = await nodemailer.createTestAccount();
    this.logger.log(`Created fake test email account: ${testAccount.user}`);

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

  async sendWelcomeEmail(to: string, name: string): Promise<{ success: boolean; previewUrl?: string | false }> {
    try {
      const transporter = await this.getTransporter();

      const info = await transporter.sendMail({
        from: '"Payroll HR Team" <no-reply@payrollsystem.local>',
        to,
        subject: 'Welcome to Payroll Management System 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #2b6cb0;">Welcome aboard, ${name}!</h2>
            <p>Your employee account has been successfully created in the <strong>Payroll Management System</strong>.</p>
            <p>You can now log in, view your salary slips, and manage your leaves.</p>
            <br/>
            <p style="color: #718096; font-size: 13px;">Automated message from HR & Payroll Dept.</p>
          </div>
        `,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      this.logger.log(`Email delivered! Preview URL: ${previewUrl}`);

      return { success: true, previewUrl };
    } catch (error: any) {
      this.logger.error(`Mail failed: ${error?.message || error}`);
      return { success: false };
    }
  }
}
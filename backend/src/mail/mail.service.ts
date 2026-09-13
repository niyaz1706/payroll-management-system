import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp-relay.brevo.com',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  // 1. Welcome / Account Activation Notification
  async sendWelcomeNotification(to: string, employeeName: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
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
      this.logger.log(`Welcome email sent to ${to}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Welcome email failed: ${error?.message || error}`);
      return false;
    }
  }

  // 2. Password Reset / OTP Notification
  async sendPasswordResetNotification(to: string, resetTokenOrOtp: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || '"Payroll Security" <no-reply@company.com>',
        to,
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 6px;">
            <h3 style="color: #c53030;">Password Reset Verification</h3>
            <p>We received a request to reset your password. Use the verification code below:</p>
            <h1 style="letter-spacing: 4px; color: #2d3748;">${resetTokenOrOtp}</h1>
            <p style="color: #718096; font-size: 13px;">This code expires in 15 minutes. If you did not request this, ignore this email.</p>
          </div>
        `,
      });
      this.logger.log(`Password reset email sent to ${to}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Password reset email failed: ${error?.message || error}`);
      return false;
    }
  }

  // 3. Monthly Payslip Notification (with Attachment support)
  async sendPayslipNotification(
    to: string,
    employeeName: string,
    month: string,
    pdfBuffer?: Buffer,
  ): Promise<boolean> {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.MAIL_FROM || '"Payroll Accounts" <no-reply@company.com>',
        to,
        subject: `Payslip for ${month} - Payroll System`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 6px;">
            <h2 style="color: #2f855a;">Payslip Generated</h2>
            <p>Dear ${employeeName},</p>
            <p>Your salary slip for <strong>${month}</strong> has been generated and processed.</p>
            <p>Please find your payslip details attached or log in to the portal to review your earnings breakdown.</p>
            <br/>
            <p style="color: #718096; font-size: 12px;">Finance & Accounts Department</p>
          </div>
        `,
        attachments: pdfBuffer
          ? [
              {
                filename: `Payslip_${month}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf',
              },
            ]
          : [],
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Payslip email sent to ${to}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Payslip email failed: ${error?.message || error}`);
      return false;
    }
  }
}
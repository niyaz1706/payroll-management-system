import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('test')
  async testMail(@Query('email') email?: string) {
    const target = email || 'test@example.com';
    const success = await this.mailService.sendWelcomeNotification(target, 'Test User');
    return {
      status: success ? 'SUCCESS' : 'FAILED',
      message: success ? `Notification sent to ${target}` : 'Failed to send',
    };
  }

  @Post('send-welcome')
  async sendWelcome(@Body() body: { email: string; name: string }) {
    const success = await this.mailService.sendWelcomeNotification(body.email, body.name);
    return { success };
  }

  @Post('send-reset-otp')
  async sendResetOtp(@Body() body: { email: string; otp: string }) {
    const success = await this.mailService.sendPasswordResetNotification(body.email, body.otp);
    return { success };
  }

  @Post('send-payslip')
  async sendPayslip(@Body() body: { email: string; name: string; month: string }) {
    const success = await this.mailService.sendPayslipNotification(body.email, body.name, body.month);
    return { success };
  }
}
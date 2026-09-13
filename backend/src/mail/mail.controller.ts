import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test')
  async sendTestEmail(@Body('email') email: string) {
    const targetEmail = email || process.env.SMTP_USER;
    const success = await this.mailService.sendWelcomeEmail(
      targetEmail,
      'Test User',
    );

    return {
      success,
      message: success
        ? `Test email sent to ${targetEmail}`
        : 'Failed to send test email. Check server logs.',
    };
  }
}
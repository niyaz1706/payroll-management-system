import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('test')
  async testMail() {
    const targetEmail: string = process.env.MAIL_USER || 'test@example.com';
    const success = await this.mailService.sendWelcomeEmail(
      targetEmail,
      'Test Employee',
    );

    return {
      status: success ? 'SUCCESS' : 'FAILED',
      message: success
        ? `Welcome email sent successfully to ${targetEmail}`
        : 'Failed to send email. Check backend logs.',
    };
  }
}
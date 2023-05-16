import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';

import { HOST, MAIL_FROM, MAIL_TEST } from 'libs/config';
import { MailTemplates } from 'libs/constants';
import lang from 'libs/lang';
import { RegistrationDto } from './dto/registration.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

  async registration(registrationDto: RegistrationDto): Promise<void> {
    try {
      const info = await this.mailerService.sendMail({
        to: registrationDto.email,
        from: MAIL_FROM,
        subject: lang.get('en')?.subjectRegistration,
        template: MailTemplates.ForgotPassword,
        context: {
          host: HOST,
          title: lang.get('en')?.subjectRegistration,
          action: lang.get('en')?.verificationCode,
          code: registrationDto.code,
        },
      });
      if (MAIL_TEST) {
        const previewUri = nodemailer.getTestMessageUrl(info);
        Logger.log(previewUri);
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    try {
      const info = await this.mailerService.sendMail({
        to: forgotPasswordDto.email,
        from: MAIL_FROM,
        subject: lang.get('en')?.subjectForgotPassword,
        template: MailTemplates.ForgotPassword,
        context: {
          host: HOST,
          title: lang.get('en')?.subjectForgotPassword,
          action: lang.get('en')?.resetPasswordCode,
          code: forgotPasswordDto.code,
        },
      });
      if (MAIL_TEST) {
        const previewUri = nodemailer.getTestMessageUrl(info);
        Logger.log(previewUri);
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

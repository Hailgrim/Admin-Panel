import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';

import { HOST, MAIL_FROM, MAIL_TEST } from 'libs/config';
import { MailTemplates } from 'libs/constants';
import { RegistrationDto } from './dto/registration.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import d from 'locales/dictionary';
import { ChangeEmailDto } from './dto/change-email.dto';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

  async registration(registrationDto: RegistrationDto): Promise<void> {
    try {
      const info = await this.mailerService.sendMail({
        to: registrationDto.email,
        from: MAIL_FROM,
        subject: d['en'].subjectRegistration,
        template: MailTemplates.Registration,
        context: {
          host: HOST,
          title: d['en'].subjectRegistration,
          action: d['en'].verificationCode,
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
        subject: d['en'].subjectForgotPassword,
        template: MailTemplates.ForgotPassword,
        context: {
          host: HOST,
          title: d['en'].subjectForgotPassword,
          action: d['en'].resetPasswordCode,
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

  async changeEmail(changeEmailDto: ChangeEmailDto): Promise<void> {
    try {
      const info = await this.mailerService.sendMail({
        to: changeEmailDto.email,
        from: MAIL_FROM,
        subject: d['en'].subjectChangeEmail,
        template: MailTemplates.ChangeEmail,
        context: {
          host: HOST,
          title: d['en'].subjectChangeEmail,
          action: d['en'].changeEmailCode,
          code: changeEmailDto.code,
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

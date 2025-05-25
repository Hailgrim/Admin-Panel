import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import {
  HOST,
  MAIL_FROM,
  MAIL_TEST,
  MAIL_CHANGE_EMAIL,
  MAIL_FORGOT_PASSWORD,
  MAIL_REGISTRATION,
} from 'libs/config';
import { d } from '@ap/shared';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

  async registration(email: string, code: string): Promise<void> {
    try {
      const info = (await this.mailerService.sendMail({
        to: email,
        from: MAIL_FROM,
        subject: d['en'].subjectRegistration,
        template: MAIL_REGISTRATION,
        context: {
          host: HOST,
          title: d['en'].subjectRegistration,
          action: d['en'].verificationCode,
          code,
        },
      })) as SMTPTransport.SentMessageInfo;

      if (MAIL_TEST) {
        Logger.log(nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async forgotPassword(email: string, code: string): Promise<void> {
    try {
      const info = (await this.mailerService.sendMail({
        to: email,
        from: MAIL_FROM,
        subject: d['en'].subjectForgotPassword,
        template: MAIL_FORGOT_PASSWORD,
        context: {
          host: HOST,
          title: d['en'].subjectForgotPassword,
          action: d['en'].resetPasswordCode,
          code,
        },
      })) as SMTPTransport.SentMessageInfo;

      if (MAIL_TEST) {
        Logger.log(nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async changeEmail(email: string, code: string): Promise<void> {
    try {
      const info = (await this.mailerService.sendMail({
        to: email,
        from: MAIL_FROM,
        subject: d['en'].subjectChangeEmail,
        template: MAIL_CHANGE_EMAIL,
        context: {
          host: HOST,
          title: d['en'].subjectChangeEmail,
          action: d['en'].changeEmailCode,
          code,
        },
      })) as SMTPTransport.SentMessageInfo;

      if (MAIL_TEST) {
        Logger.log(nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}

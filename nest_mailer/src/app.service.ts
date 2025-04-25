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
import { RegistrationDto } from './dto/registration.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import d from 'locales/dictionary';
import { ChangeEmailDto } from './dto/change-email.dto';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

  async registration(registrationDto: RegistrationDto): Promise<void> {
    try {
      const info = (await this.mailerService.sendMail({
        to: registrationDto.email,
        from: MAIL_FROM,
        subject: d['en'].subjectRegistration,
        template: MAIL_REGISTRATION,
        context: {
          host: HOST,
          title: d['en'].subjectRegistration,
          action: d['en'].verificationCode,
          code: registrationDto.code,
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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    try {
      const info = (await this.mailerService.sendMail({
        to: forgotPasswordDto.email,
        from: MAIL_FROM,
        subject: d['en'].subjectForgotPassword,
        template: MAIL_FORGOT_PASSWORD,
        context: {
          host: HOST,
          title: d['en'].subjectForgotPassword,
          action: d['en'].resetPasswordCode,
          code: forgotPasswordDto.code,
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

  async changeEmail(changeEmailDto: ChangeEmailDto): Promise<void> {
    try {
      const info = (await this.mailerService.sendMail({
        to: changeEmailDto.email,
        from: MAIL_FROM,
        subject: d['en'].subjectChangeEmail,
        template: MAIL_CHANGE_EMAIL,
        context: {
          host: HOST,
          title: d['en'].subjectChangeEmail,
          action: d['en'].changeEmailCode,
          code: changeEmailDto.code,
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

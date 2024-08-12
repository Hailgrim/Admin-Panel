import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';
import { RegistrationDto } from './dto/registration.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ method: 'registration' })
  registration(registrationDto: RegistrationDto) {
    return this.appService.registration(registrationDto);
  }

  @MessagePattern({ method: 'forgotPassword' })
  forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return this.appService.forgotPassword(forgotPasswordDto);
  }

  @MessagePattern({ method: 'changeEmail' })
  changeEmail(changeEmailDto: ChangeEmailDto) {
    return this.appService.changeEmail(changeEmailDto);
  }
}

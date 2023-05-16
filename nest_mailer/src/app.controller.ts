import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';
import { RegistrationDto } from './dto/registration.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

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
}

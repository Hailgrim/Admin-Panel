import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

import d from 'locales/dictionary';

export class RegistrationDto {
  @ApiProperty({ example: 'user@mail.com', description: d['en'].email })
  @IsEmail({}, { message: d['en'].incorrect(d['en'].email) })
  email: string;

  @ApiProperty({
    example: '1q2w3e4r5',
    description: d['en'].resetPasswordCode,
  })
  @IsString({
    message: d['en'].mustBeAString(d['en'].resetPasswordCode),
  })
  code: string;
}

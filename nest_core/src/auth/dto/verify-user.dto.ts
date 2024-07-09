import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

import d from 'locales/dictionary';

export class VerifyUserDto {
  @ApiProperty({ example: 'user@mail.com', description: d['en'].email })
  @IsEmail({}, { message: d['en'].incorrect(d['en'].email) })
  email: string;

  @ApiProperty({
    example: '1q2w3e4r5',
    description: d['en'].verificationCode,
  })
  @IsString({
    message: d['en'].mustBeAString(d['en'].verificationCode),
  })
  code: string;
}

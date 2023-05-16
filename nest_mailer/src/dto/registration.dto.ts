import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

import lang from 'libs/lang';

export class RegistrationDto {
  @ApiProperty({ example: 'user@mail.com', description: lang.get('en')?.email })
  @IsEmail({}, { message: lang.get('en')?.incorrect(lang.get('en')?.email) })
  email: string;

  @ApiProperty({
    example: '1q2w3e4r5',
    description: lang.get('en')?.resetPasswordCode,
  })
  @IsString({
    message: lang.get('en')?.mustBeAString(lang.get('en')?.resetPasswordCode),
  })
  code: string;
}

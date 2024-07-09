import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

import d from 'locales/dictionary';

export class ResetPasswordDto {
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

  @ApiProperty({ example: '1q2w3e4r5', description: d['en'].password })
  @IsStrongPassword({}, { message: d['en'].mustBeAStrong(d['en'].password) })
  @Length(10, 100, {
    message: d['en'].fieldLength(d['en'].password, 10, 100),
  })
  password: string;
}

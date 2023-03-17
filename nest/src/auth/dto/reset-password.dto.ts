import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

import lang from 'libs/lang';

export class ResetPasswordDto {
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

  @ApiProperty({ example: '1q2w3e4r5', description: lang.get('en')?.password })
  @IsStrongPassword(
    {},
    { message: lang.get('en')?.mustBeAStrong(lang.get('en')?.password) },
  )
  @Length(10, 100, {
    message: lang.get('en')?.fieldLength(lang.get('en')?.password, 10, 100),
  })
  password: string;
}

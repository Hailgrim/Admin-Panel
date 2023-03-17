import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

import lang from 'libs/lang';
import { SignUpFields } from 'libs/types';

export class SignUpDto implements SignUpFields {
  @ApiProperty({ example: 'user@mail.com', description: lang.get('en')?.email })
  @Transform(({ value }) => (typeof value == 'string' ? value.trim() : value))
  @IsEmail({}, { message: lang.get('en')?.incorrect(lang.get('en')?.email) })
  @Length(5, 100, {
    message: lang.get('en')?.fieldLength(lang.get('en')?.email, 5, 100),
  })
  email: string;

  @ApiProperty({ example: '1q2w3e4r5', description: lang.get('en')?.password })
  @IsStrongPassword(
    {},
    { message: lang.get('en')?.mustBeAStrong(lang.get('en')?.password) },
  )
  @Length(10, 100, {
    message: lang.get('en')?.fieldLength(lang.get('en')?.password, 10, 100),
  })
  password: string;

  @ApiProperty({ example: 'Linus Torvalds', description: lang.get('en')?.name })
  @Transform(({ value }) => (typeof value == 'string' ? value.trim() : value))
  @IsString({
    message: lang.get('en')?.mustBeAString(lang.get('en')?.name),
  })
  @Length(1, 100, {
    message: lang.get('en')?.fieldLength(lang.get('en')?.name, 1, 100),
  })
  name: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

import lang from 'libs/lang';
import { UpdateUserFields } from 'libs/types';

export class UpdateUserDto implements UpdateUserFields {
  @ApiProperty({ example: 'user@mail.com', description: lang.get('en')?.email })
  @IsOptional()
  @IsEmail({}, { message: lang.get('en')?.incorrect(lang.get('en')?.email) })
  @Length(5, 100, {
    message: lang.get('en')?.fieldLength(lang.get('en')?.email, 5, 100),
  })
  email?: string;

  @ApiProperty({ example: '1q2w3e4r5', description: lang.get('en')?.password })
  @IsOptional()
  @IsStrongPassword(
    {},
    { message: lang.get('en')?.mustBeAStrong(lang.get('en')?.password) },
  )
  @Length(10, 100, {
    message: lang.get('en')?.fieldLength(lang.get('en')?.password, 10, 100),
  })
  password?: string;

  @ApiProperty({ example: 'Linus Torvalds', description: lang.get('en')?.name })
  @IsOptional()
  @IsString({
    message: lang.get('en')?.mustBeAString(lang.get('en')?.name),
  })
  @Length(1, 100, {
    message: lang.get('en')?.fieldLength(lang.get('en')?.name, 1, 100),
  })
  name?: string;

  @ApiProperty({ example: true, description: lang.get('en')?.status })
  @IsOptional()
  @IsBoolean({
    message: lang.get('en')?.mustBeABoolean(lang.get('en')?.status),
  })
  enabled?: boolean;
}

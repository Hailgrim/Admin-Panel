import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import lang from 'libs/lang';

export class SignInDto {
  @ApiProperty({ example: 'user@mail.com', description: lang.get('en')?.email })
  @IsString({ message: lang.get('en')?.mustBeAString(lang.get('en')?.email) })
  username: string;

  @ApiProperty({
    example: 'user@mail.com',
    description: lang.get('en')?.password,
  })
  @IsString({
    message: lang.get('en')?.mustBeAString(lang.get('en')?.password),
  })
  password: string;

  @ApiProperty({
    example: 'user@mail.com',
    description: lang.get('en')?.rememberMe,
  })
  @IsOptional()
  @IsBoolean({
    message: lang.get('en')?.mustBeABoolean(lang.get('en')?.rememberMe),
  })
  rememberMe?: boolean;
}

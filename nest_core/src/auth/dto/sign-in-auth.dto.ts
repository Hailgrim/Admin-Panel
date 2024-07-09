import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import d from 'locales/dictionary';

export class SignInDto {
  @ApiProperty({ example: 'user@mail.com', description: d['en'].email })
  @IsString({ message: d['en'].mustBeAString(d['en'].email) })
  username: string;

  @ApiProperty({
    example: 'user@mail.com',
    description: d['en'].password,
  })
  @IsString({
    message: d['en'].mustBeAString(d['en'].password),
  })
  password: string;

  @ApiProperty({
    example: 'user@mail.com',
    description: d['en'].rememberMe,
  })
  @IsOptional()
  @IsBoolean({
    message: d['en'].mustBeABoolean(d['en'].rememberMe),
  })
  rememberMe?: boolean;
}

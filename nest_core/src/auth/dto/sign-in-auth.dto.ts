import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import d from 'locales/dictionary';

export class SignInDto {
  @ApiProperty({ example: 'example@mail.com', description: d['en'].email })
  @IsString()
  username: string;

  @ApiProperty({
    example: '!Q1q2w3e4r',
    description: d['en'].password,
  })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    example: true,
    description: d['en'].rememberMe,
  })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

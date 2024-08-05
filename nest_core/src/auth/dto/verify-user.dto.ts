import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import d from 'locales/dictionary';

export class VerifyUserDto {
  @ApiProperty({ example: 'example@mail.com', description: d['en'].email })
  @IsString()
  email: string;

  @ApiProperty({
    example: '1234',
    description: d['en'].verificationCode,
  })
  @IsString()
  code: string;
}

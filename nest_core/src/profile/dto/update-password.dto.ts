import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

import d from 'locales/dictionary';
import { IUpdatePassword } from '../profile.types';
import { PASSWORD_REGEX } from 'libs/constants';

export class UpdatePasswordDto implements IUpdatePassword {
  @ApiPropertyOptional({
    example: '!Q1q2w3e4r',
    description: d['en'].oldPassword,
  })
  @IsOptional()
  @IsString()
  oldPassword?: string;

  @ApiProperty({ example: 'r4e3w2q1Q!', description: d['en'].newPassword })
  @Matches(PASSWORD_REGEX)
  newPassword: string;
}

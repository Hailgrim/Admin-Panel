import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

import { PASSWORD_REGEX } from '@ap/shared/src/libs';
import { IUpdatePassword } from '@ap/shared/src/types';

export class UpdatePasswordDto implements IUpdatePassword {
  @ApiPropertyOptional({ type: String, example: '!Q1q2w3e4r' })
  @IsOptional()
  @IsString()
  oldPassword?: string;

  @ApiProperty({ type: String, example: 'r4e3w2q1Q!' })
  @Matches(PASSWORD_REGEX)
  newPassword: string;
}

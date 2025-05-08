import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

import { EMAIL_REGEX } from '@ap/shared';

export class ForgotPasswordDto {
  @ApiProperty({ type: String, example: 'example@mail.com' })
  @Matches(EMAIL_REGEX)
  email: string;

  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  code: string;
}

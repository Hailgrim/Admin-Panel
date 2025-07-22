import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

import { EMAIL_REGEX } from '@ap/shared/src/libs';
import { IChangeEmailRequest } from '@ap/shared/src/types';

export class ChangeEmailRequestDto implements IChangeEmailRequest {
  @ApiProperty({ type: String, example: 'example@mail.com' })
  @Matches(EMAIL_REGEX)
  newEmail: string;
}

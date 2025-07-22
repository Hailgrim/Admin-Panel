import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { IChangeEmailConfirm } from '@ap/shared/src/types';

export class ChangeEmailConfirmDto implements IChangeEmailConfirm {
  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  code: string;
}

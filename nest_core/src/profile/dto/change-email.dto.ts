import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { IChangeEmail } from '../profile.types';

export class ChangeEmailDto implements IChangeEmail {
  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  code: string;
}

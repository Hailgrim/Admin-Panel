import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import lang from 'libs/lang';
import { IUsersRoles } from 'libs/types';

export class UsersRolesDto implements IUsersRoles {
  @ApiProperty({ example: 1, description: lang.get('en')?.userId })
  @IsNumber(
    {},
    { message: lang.get('en')?.mustBeANumber(lang.get('en')?.userId) },
  )
  userId: number;

  @ApiProperty({ example: 1, description: lang.get('en')?.roleId })
  @IsNumber(
    {},
    { message: lang.get('en')?.mustBeANumber(lang.get('en')?.roleId) },
  )
  roleId: number;
}

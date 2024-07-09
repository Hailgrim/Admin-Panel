import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import d from 'locales/dictionary';
import { IUsersRoles } from 'src/roles/roles.types';

export class UsersRolesDto implements IUsersRoles {
  @ApiProperty({ example: 1, description: d['en'].userId })
  @IsNumber({}, { message: d['en'].mustBeANumber(d['en'].userId) })
  userId: number;

  @ApiProperty({ example: 1, description: d['en'].roleId })
  @IsNumber({}, { message: d['en'].mustBeANumber(d['en'].roleId) })
  roleId: number;
}

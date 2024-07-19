import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import d from 'locales/dictionary';
import { IUsersRoles } from 'src/roles/roles.types';

export class UsersRolesDto implements IUsersRoles {
  @ApiProperty({ example: 1, description: d['en'].userId })
  @IsString({ message: d['en'].mustBeAString(d['en'].userId) })
  userId: string;

  @ApiProperty({ example: 1, description: d['en'].roleId })
  @IsString({ message: d['en'].mustBeANumber(d['en'].roleId) })
  roleId: number;
}

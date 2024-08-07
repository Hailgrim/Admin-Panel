import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import d from 'locales/dictionary';
import { IUsersRoles } from 'src/roles/roles.types';

export class UsersRolesDto implements IUsersRoles {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: d['en'].userId,
  })
  @IsString()
  userId: string;

  @ApiProperty({ example: 1, description: d['en'].roleId })
  @IsString()
  roleId: number;
}

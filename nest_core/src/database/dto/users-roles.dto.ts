import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { IUsersRoles } from '../database.types';
import { IUser } from 'src/users/users.types';
import { IRole } from 'src/roles/roles.types';

export class UsersRolesDto implements IUsersRoles {
  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  userId: IUser['id'];

  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  roleId: IRole['id'];
}

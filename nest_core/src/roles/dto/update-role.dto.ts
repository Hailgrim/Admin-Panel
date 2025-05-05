import { PartialType, PickType } from '@nestjs/swagger';

import { TUpdateRole } from '../roles.types';
import { RoleDto } from './role.dto';

export class UpdateRoleDto
  extends PartialType(
    PickType<RoleDto, keyof TUpdateRole>(RoleDto, [
      'name',
      'description',
      'enabled',
    ]),
  )
  implements TUpdateRole {}

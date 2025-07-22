import { PartialType, PickType } from '@nestjs/swagger';

import { RoleDto } from './role.dto';
import { TUpdateRole } from '@ap/shared/src/types';

export class UpdateRoleDto
  extends PartialType(
    PickType<RoleDto, keyof TUpdateRole>(RoleDto, [
      'name',
      'description',
      'enabled',
    ]),
  )
  implements TUpdateRole {}

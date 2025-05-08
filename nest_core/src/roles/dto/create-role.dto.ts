import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { TCreateRole } from '@ap/shared';
import { RoleDto } from './role.dto';

export class CreateRoleDto
  extends IntersectionType(
    PickType<RoleDto, keyof TCreateRole>(RoleDto, ['name', 'enabled']),
    PartialType(PickType<RoleDto, keyof TCreateRole>(RoleDto, ['description'])),
  )
  implements TCreateRole {}

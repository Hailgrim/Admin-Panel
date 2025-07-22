import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { RoleDto } from './role.dto';
import { TCreateRole } from '@ap/shared/src/types';

export class CreateRoleDto
  extends IntersectionType(
    PickType<RoleDto, keyof TCreateRole>(RoleDto, ['name', 'enabled']),
    PartialType(PickType<RoleDto, keyof TCreateRole>(RoleDto, ['description'])),
  )
  implements TCreateRole {}

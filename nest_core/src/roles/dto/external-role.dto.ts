import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { IRole } from '@ap/shared';
import { RoleDto } from './role.dto';

export class ExternalRoleDto
  extends IntersectionType(
    PickType(RoleDto, ['id', 'name', 'enabled', 'admin', 'default']),
    PartialType(
      PickType(RoleDto, ['description', 'resources', 'UsersRolesModel']),
    ),
  )
  implements IRole {}

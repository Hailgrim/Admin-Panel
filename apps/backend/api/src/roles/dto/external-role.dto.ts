import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { RoleDto } from './role.dto';
import { IRole } from '@ap/shared/src/types';

export class ExternalRoleDto
  extends IntersectionType(
    PickType(RoleDto, ['id', 'name', 'enabled', 'admin', 'default']),
    PartialType(PickType(RoleDto, ['description', 'rights'])),
  )
  implements IRole {}

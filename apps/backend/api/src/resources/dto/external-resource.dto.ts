import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { IResource } from '@ap/shared';
import { ResourceDto } from './resource.dto';

export class ExternalResourceDto
  extends IntersectionType(
    PickType(ResourceDto, ['id', 'name', 'path', 'enabled', 'default']),
    PartialType(PickType(ResourceDto, ['description'])),
  )
  implements IResource {}

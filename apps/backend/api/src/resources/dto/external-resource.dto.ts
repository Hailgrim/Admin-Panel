import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { ResourceDto } from './resource.dto';
import { IResource } from '@ap/shared/src/types';

export class ExternalResourceDto
  extends IntersectionType(
    PickType(ResourceDto, ['id', 'name', 'path', 'enabled', 'default']),
    PartialType(PickType(ResourceDto, ['description'])),
  )
  implements IResource {}

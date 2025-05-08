import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { TCreateResource } from '@ap/shared';
import { ResourceDto } from './resource.dto';

export class CreateResourceDto
  extends IntersectionType(
    PickType<ResourceDto, keyof TCreateResource>(ResourceDto, [
      'name',
      'path',
      'enabled',
    ]),
    PartialType(
      PickType<ResourceDto, keyof TCreateResource>(ResourceDto, [
        'description',
      ]),
    ),
  )
  implements TCreateResource {}

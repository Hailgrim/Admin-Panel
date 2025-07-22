import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { ResourceDto } from './resource.dto';
import { TCreateResource } from '@ap/shared/src/types';

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

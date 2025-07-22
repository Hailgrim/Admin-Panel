import { PartialType, PickType } from '@nestjs/swagger';

import { ResourceDto } from './resource.dto';
import { TUpdateResource } from '@ap/shared/src/types';

export class UpdateResourceDto
  extends PartialType(
    PickType<ResourceDto, keyof TUpdateResource>(ResourceDto, [
      'name',
      'path',
      'description',
      'enabled',
    ]),
  )
  implements TUpdateResource {}

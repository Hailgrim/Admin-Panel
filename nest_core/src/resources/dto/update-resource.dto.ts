import { PartialType, PickType } from '@nestjs/swagger';

import { TUpdateResource } from '@ap/shared';
import { ResourceDto } from './resource.dto';

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

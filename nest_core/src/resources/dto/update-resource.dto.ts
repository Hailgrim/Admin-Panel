import { PartialType, PickType } from '@nestjs/swagger';

import { TUpdateResource } from '../resources.types';
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

import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { TGetResources } from '../resources.types';
import { GetListRequestDto } from 'src/database/dto/get-list-request.dto';
import { TGetListRequest } from 'src/database/database.types';
import { ResourceDto } from './resource.dto';

export class GetResourcesDto
  extends IntersectionType(
    GetListRequestDto,
    PartialType(
      PickType<ResourceDto, keyof TGetResources>(ResourceDto, [
        'name',
        'path',
        'description',
        'enabled',
      ]),
    ),
  )
  implements TGetListRequest<TGetResources> {}

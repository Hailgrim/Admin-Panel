import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { TGetResources, TGetListRequest } from '@ap/shared';
import { GetListRequestDto } from 'src/database/dto/get-list-request.dto';
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

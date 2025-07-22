import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { GetListRequestDto } from 'src/database/dto/get-list-request.dto';
import { ResourceDto } from './resource.dto';
import { TGetListRequest, TGetResources } from '@ap/shared/src/types';

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

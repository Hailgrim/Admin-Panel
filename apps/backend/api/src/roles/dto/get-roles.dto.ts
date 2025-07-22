import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { GetListRequestDto } from 'src/database/dto/get-list-request.dto';
import { RoleDto } from './role.dto';
import { TGetListRequest, TGetRoles } from '@ap/shared/src/types';

export class GetRolesDto
  extends IntersectionType(
    GetListRequestDto,
    PartialType(
      PickType<RoleDto, keyof TGetRoles>(RoleDto, [
        'name',
        'description',
        'enabled',
      ]),
    ),
  )
  implements TGetListRequest<TGetRoles> {}

import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { TGetRoles } from '../roles.types';
import { GetListRequestDto } from 'src/database/dto/get-list-request.dto';
import { TGetListRequest } from 'src/database/database.types';
import { RoleDto } from './role.dto';

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

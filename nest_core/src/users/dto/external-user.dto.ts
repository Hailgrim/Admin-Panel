import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { IUser } from '../users.types';
import { UserDto } from './user.dto';

export class ExternalUserDto
  extends IntersectionType(
    PickType(UserDto, ['id', 'name', 'enabled', 'verified']),
    PartialType(PickType(UserDto, ['email', 'googleId', 'roles'])),
  )
  implements IUser {}

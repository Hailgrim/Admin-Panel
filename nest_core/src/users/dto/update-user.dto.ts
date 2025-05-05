import { PartialType, PickType } from '@nestjs/swagger';

import { TUpdateUser } from '../users.types';
import { UserDto } from './user.dto';

export class UpdateUserDto
  extends PartialType(
    PickType<UserDto, keyof TUpdateUser>(UserDto, ['email', 'name', 'enabled']),
  )
  implements TUpdateUser {}

import { PartialType, PickType } from '@nestjs/swagger';

import { TUpdateUser } from '@ap/shared';
import { UserDto } from './user.dto';

export class UpdateUserDto
  extends PartialType(
    PickType<UserDto, keyof TUpdateUser>(UserDto, ['email', 'name', 'enabled']),
  )
  implements TUpdateUser {}

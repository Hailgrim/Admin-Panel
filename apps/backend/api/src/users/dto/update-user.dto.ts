import { PartialType, PickType } from '@nestjs/swagger';

import { UserDto } from './user.dto';
import { TUpdateUser } from '@ap/shared/src/types';

export class UpdateUserDto
  extends PartialType(
    PickType<UserDto, keyof TUpdateUser>(UserDto, ['email', 'name', 'enabled']),
  )
  implements TUpdateUser {}

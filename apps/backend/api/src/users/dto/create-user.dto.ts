import { PickType } from '@nestjs/swagger';

import { TCreateUser } from '@ap/shared';
import { UserDto } from './user.dto';

export class CreateUserDto
  extends PickType<UserDto, keyof TCreateUser>(UserDto, [
    'email',
    'password',
    'name',
    'enabled',
  ])
  implements TCreateUser {}

import { PickType } from '@nestjs/swagger';

import { UserDto } from './user.dto';
import { TCreateUser } from '@ap/shared/src/types';

export class CreateUserDto
  extends PickType<UserDto, keyof TCreateUser>(UserDto, [
    'email',
    'password',
    'name',
    'enabled',
  ])
  implements TCreateUser {}

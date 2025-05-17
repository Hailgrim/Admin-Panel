import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { IUser } from '@ap/shared';
import { UserDto } from './user.dto';

export class ExternalUserDto
  extends IntersectionType(
    PickType(UserDto, ['id', 'name', 'enabled', 'verified']),
    PartialType(PickType(UserDto, ['email', 'googleId', 'roles'])),
  )
  implements IUser
{
  @Exclude()
  password?: string | null | undefined;

  @Exclude()
  verificationCode?: string | null | undefined;

  @Exclude()
  resetPasswordCode?: string | null | undefined;

  @Exclude()
  changeEmailCode?: string | null | undefined;

  @Exclude()
  temporaryEmail?: string | null | undefined;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsString,
  IsUUID,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Exclude, Type } from 'class-transformer';

import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX, IUser } from '@ap/shared';
import { ExternalRoleDto } from 'src/roles/dto/external-role.dto';

export class UserDto implements IUser {
  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String, example: 'example@mail.com' })
  @Matches(EMAIL_REGEX)
  email: string;

  @ApiProperty({ type: String, example: '!Q1q2w3e4r' })
  @Matches(PASSWORD_REGEX)
  password: string;

  @ApiProperty({ type: String, example: 'Linus Torvalds' })
  @Matches(NAME_REGEX)
  name: string;

  @ApiProperty({ type: String, example: '000000000000000000000' })
  @IsString()
  googleId: string;

  @ApiProperty({ type: Boolean, example: true })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ type: Boolean, example: true })
  @IsBoolean()
  verified: boolean;

  @Exclude()
  verificationCode: string | null;

  @Exclude()
  resetPasswordCode: string | null;

  @Exclude()
  changeEmailCode: string | null;

  @Exclude()
  temporaryEmail: string | null;

  @ApiProperty({ type: [ExternalRoleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExternalRoleDto)
  roles: ExternalRoleDto[];
}

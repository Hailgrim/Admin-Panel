import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsString,
  IsUUID,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ExternalRoleDto } from 'src/roles/dto/external-role.dto';
import { IUser } from '@ap/shared/src/types';
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from '@ap/shared/src/libs';

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

  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  verificationCode: string | null;

  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  resetPasswordCode: string | null;

  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  changeEmailCode: string | null;

  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  temporaryEmail: string | null;

  @ApiProperty({ type: [ExternalRoleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExternalRoleDto)
  roles: ExternalRoleDto[];
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import d from 'locales/dictionary';
import { GetUsersFields } from '../users.types';
import { GetListDto } from 'src/database/dto/get-list.dto';

export class GetUsersDto extends GetListDto implements GetUsersFields {
  @ApiPropertyOptional({
    example: 'example@mail.com',
    description: d['en'].email,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'Linus Torvalds', description: d['en'].name })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: true, description: d['en'].status })
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  enabled?: boolean;
}

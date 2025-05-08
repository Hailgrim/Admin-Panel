import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

import { IExternalSession } from '@ap/shared';

export class ExternalSessionDto implements IExternalSession {
  @ApiProperty({
    type: String,
    example:
      'sessions:00000000-0000-0000-0000-000000000000:00000000-0000-0000-0000-000000000000',
  })
  @IsString()
  id: string;

  @ApiProperty({ type: Boolean, example: true })
  @IsBoolean()
  current: boolean;

  @ApiPropertyOptional({
    type: String,
    example:
      'Mozilla/5.0 (<system-information>) <platform> (<platform-details>) <extensions>',
  })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({ type: String, example: '127.0.0.1' })
  @IsString()
  ip: string;

  @ApiProperty({ type: Date, example: new Date() })
  @IsDate()
  updatedAt: Date;
}

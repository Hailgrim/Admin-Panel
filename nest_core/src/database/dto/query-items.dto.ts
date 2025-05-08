import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateIf } from 'class-validator';

import { IQueryItems } from '@ap/shared';

export class QueryItemsDto<T> implements IQueryItems<T> {
  @ApiProperty({
    type: Array,
    items: {
      oneOf: [{ type: 'string' }, { type: 'number' }],
    },
    example: [1, 2, 3],
  })
  @IsArray()
  @ValidateIf((o: unknown) => {
    if (
      !(o instanceof Object) ||
      !('items' in o) ||
      !(o.items instanceof Array)
    )
      return true;
    return o.items.every((v) => typeof v === 'string');
  })
  @IsString({ each: true })
  @ValidateIf((o: unknown) => {
    if (
      !(o instanceof Object) ||
      !('items' in o) ||
      !(o.items instanceof Array)
    )
      return true;
    return o.items.every((v) => typeof v === 'number');
  })
  @IsNumber({ allowNaN: false }, { each: true })
  items: T[];
}

import { Injectable } from '@nestjs/common';
import { FindOptions } from 'sequelize';

import { GetListDto } from './dto/get-list.dto';

@Injectable()
export class DatabaseService {
  preparePaginationOptions(getListDto?: GetListDto): FindOptions {
    const options: FindOptions = { offset: 0, limit: 25 };

    if (
      getListDto?.quantity &&
      getListDto.quantity > 0 &&
      getListDto.quantity <= 100
    ) {
      options.limit = getListDto.quantity;
    }

    if (getListDto?.page && getListDto.page > 0 && options.limit) {
      options.offset = (getListDto.page - 1) * options?.limit;
    }

    return options;
  }
}

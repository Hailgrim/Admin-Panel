import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource, FindManyOptions, ILike, Like } from 'typeorm';

import { TGetListRequest } from '@ap/shared';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  public iLike: typeof Like | typeof ILike = ILike;

  async onModuleInit() {
    if (this.dataSource.options.type === 'sqlite') {
      await this.dataSource.query('PRAGMA case_sensitive_like = OFF;');
      this.iLike = Like;
    }
  }

  preparePaginationOptions<T = unknown, U = unknown>(
    fields?: TGetListRequest<U>,
  ): FindManyOptions<T> {
    const options: FindManyOptions<T> = { skip: 0, take: 25 };

    if (fields?.reqLimit && fields.reqLimit > 0 && fields.reqLimit <= 100) {
      options.take = fields.reqLimit;
    }

    if (fields?.reqPage && fields.reqPage > 0 && options.take) {
      options.skip = (fields.reqPage - 1) * options.take;
    }

    return options;
  }
}

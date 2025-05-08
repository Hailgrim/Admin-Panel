import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { FindOptions, Op, Sequelize } from 'sequelize';

import { TGetListRequest } from '@ap/shared';
import { SEQUELIZE } from 'libs/constants';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @Inject(SEQUELIZE)
    private sequelize: Sequelize,
  ) {}

  public iLike: symbol = Op.iLike;

  async onModuleInit() {
    if (this.sequelize.getDialect() === 'sqlite') {
      await this.sequelize.query('PRAGMA case_sensitive_like = OFF;');
      this.iLike = Op.like;
    }
  }

  preparePaginationOptions<T = unknown, U = unknown>(
    fields?: TGetListRequest<U>,
  ): FindOptions<T> {
    const options: FindOptions<T> = { offset: 0, limit: 25 };

    if (fields?.reqLimit && fields.reqLimit > 0 && fields.reqLimit <= 100) {
      options.limit = fields.reqLimit;
    }

    if (fields?.reqPage && fields.reqPage > 0 && options.limit) {
      options.offset = (fields.reqPage - 1) * options.limit;
    }

    return options;
  }
}

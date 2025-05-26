import { FindManyOptions } from 'typeorm';

export type TDatabaseGetList<T> = Required<
  Pick<FindManyOptions, 'skip' | 'take'>
> &
  Pick<FindManyOptions<T>, 'where'>;

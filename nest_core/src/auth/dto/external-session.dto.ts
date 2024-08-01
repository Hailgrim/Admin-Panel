import { Exclude } from 'class-transformer';
import { ISession } from '../auth.types';

export class ExternalSessionDto implements ISession {
  id: string;
  ip: string;
  userAgent?: string;
  updatedAt: Date;
  current: boolean;

  @Exclude()
  userId: string;

  @Exclude()
  hash: string;

  @Exclude()
  expires: Date;

  constructor(partial: Partial<ISession>) {
    Object.assign(this, partial);
  }
}

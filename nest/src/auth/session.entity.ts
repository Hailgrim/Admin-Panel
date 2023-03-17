import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from '../users/user.entity';
import { ISession } from 'libs/types';

@Table({ tableName: 'sessions' })
export class Session extends Model<Session, ISession> implements ISession {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  hash: string;

  @Column({ type: DataType.DATE, allowNull: false })
  expires: Date;
}

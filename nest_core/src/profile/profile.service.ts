import { ConflictException, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { CacheService } from 'src/cache/cache.service';
import { QueueService } from 'src/queue/queue.service';
import { generateCode, verifyHash } from 'libs/utils';
import { MAIL_CHANGE_EMAIL } from 'libs/config';
import { TUpdateUser } from 'src/users/users.types';
import { IExternalSession, ISession } from './profile.types';

@Injectable()
export class ProfileService {
  constructor(
    private queueService: QueueService,
    private usersService: UsersService,
    private cacheService: CacheService,
  ) {}

  updateProfile(userId: string, fields: TUpdateUser): Promise<boolean> {
    return this.usersService.updateFields(userId, fields);
  }

  async updatePassword(
    userId: string,
    newPassword: string,
    oldPassword?: string,
  ): Promise<boolean> {
    const user = await this.usersService
      .findOneProfile(userId)
      .then((result) => result.get({ plain: true }));

    if (
      user.password &&
      (!oldPassword || !(await verifyHash(user.password, oldPassword)))
    ) {
      throw new ConflictException();
    }

    return this.usersService.updatePassword(userId, newPassword);
  }

  async changeEmailRequest(userId: string, newEmail: string): Promise<boolean> {
    const code = generateCode();

    if (await this.usersService.updateChangeEmailCode(userId, code, newEmail)) {
      this.queueService.sendEmail(
        { method: MAIL_CHANGE_EMAIL },
        { email: newEmail, code },
      );
    }

    return true;
  }

  changeEmail(userId: string, code: string): Promise<boolean> {
    return this.usersService.updateEmailWithCode(userId, code);
  }

  async getSessions(
    userId: string,
    currentSessionId?: string,
  ): Promise<IExternalSession[]> {
    const keys = await this.cacheService.keys(`sessions:${userId}:*`);
    const current = `sessions:${userId}:${currentSessionId}`;
    const sessions = await this.cacheService
      .mget<ISession>(keys)
      .then((result) =>
        result.map((session, index) => ({
          ...session,
          id: keys[index],
          current: current === keys[index],
        })),
      );
    return sessions;
  }

  async deleteSessions(userId: string, sessions: string[]): Promise<boolean> {
    const keys = await this.cacheService.keys(`sessions:${userId}:*`);
    await this.cacheService.mdel(sessions.filter((key) => keys.includes(key)));
    return true;
  }
}

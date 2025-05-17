import { ConflictException, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { CacheService } from 'src/cache/cache.service';
import { QueueService } from 'src/queue/queue.service';
import { generateCode, verifyHash } from 'libs/utils';
import { MAIL_CHANGE_EMAIL } from 'libs/config';
import { TUpdateUser, IExternalSession, ISession } from '@ap/shared';

@Injectable()
export class ProfileService {
  constructor(
    private queueService: QueueService,
    private usersService: UsersService,
    private cacheService: CacheService,
  ) {}

  async updateProfile(userId: string, fields: TUpdateUser): Promise<void> {
    await this.usersService.updateFields(userId, fields);
  }

  async updatePassword(
    userId: string,
    newPassword: string,
    oldPassword?: string,
  ): Promise<void> {
    const user = await this.usersService.getOneFlat(userId);

    if (
      user.password &&
      (!oldPassword || !(await verifyHash(user.password, oldPassword)))
    ) {
      throw new ConflictException();
    }

    await this.usersService.updatePassword(userId, newPassword);
  }

  async changeEmailRequest(userId: string, newEmail: string): Promise<void> {
    const code = generateCode();

    await this.usersService.updateChangeEmailCode(userId, code, newEmail);
    this.queueService.sendEmail(
      { method: MAIL_CHANGE_EMAIL },
      { email: newEmail, code },
    );
  }

  async changeEmailConfirm(userId: string, code: string): Promise<void> {
    await this.usersService.updateEmailWithCode(userId, code);
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

  async deleteSessions(userId: string, sessions: string[]): Promise<void> {
    const keys = await this.cacheService.keys(`sessions:${userId}:*`);
    await this.cacheService.mdel(sessions.filter((key) => keys.includes(key)));
  }
}

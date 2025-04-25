import { ConflictException, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CacheService } from 'src/cache/cache.service';
import { IExternalSession, ISession } from 'src/auth/auth.types';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { QueueService } from 'src/queue/queue.service';
import { generateCode, verifyHash } from 'libs/utils';
import { MAIL_CHANGE_EMAIL } from 'libs/config';

@Injectable()
export class ProfileService {
  constructor(
    private queueService: QueueService,
    private usersService: UsersService,
    private cacheService: CacheService,
  ) {}

  updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<boolean> {
    return this.usersService.updateFields(userId, updateProfileDto);
  }

  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<boolean> {
    const user = (await this.usersService.findOneProfile(userId)).get({
      plain: true,
    });

    if (
      user.password &&
      (!updatePasswordDto.oldPassword ||
        !(await verifyHash(user.password, updatePasswordDto.oldPassword)))
    ) {
      throw new ConflictException();
    }

    return this.usersService.updatePassword(
      userId,
      updatePasswordDto.newPassword,
    );
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

  changeEmailConfirm(userId: string, code: string): Promise<boolean> {
    return this.usersService.updateEmailWithCode(userId, code);
  }

  async getSessions(
    userId: string,
    currentSessionId?: string,
  ): Promise<IExternalSession[]> {
    const keys = await this.cacheService.keys(`sessions:${userId}:*`);
    const current = `sessions:${userId}:${currentSessionId}`;
    const sessions = await this.cacheService.mget<ISession>(keys);
    return sessions.map((session, index) => ({
      ...session,
      id: keys[index],
      current: current === keys[index],
    }));
  }

  async deleteSessions(userId: string, remove: string[]): Promise<boolean> {
    const keys = await this.cacheService.keys(`sessions:${userId}:*`);
    await this.cacheService.mdel(remove.filter((key) => keys.includes(key)));
    return true;
  }
}

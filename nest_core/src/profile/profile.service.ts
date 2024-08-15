import { ConflictException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { UsersService } from '../users/users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RedisService } from 'src/redis/redis.service';
import { ExternalSessionDto } from './dto/external-session.dto';
import { ISession, IToken } from 'src/auth/auth.types';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { generateCode } from 'src/auth/auth.utils';
import { RmqService } from 'src/rmq/rmq.service';

@Injectable()
export class ProfileService {
  constructor(
    private rmqService: RmqService,
    private usersService: UsersService,
    private redisService: RedisService,
  ) {}

  updateProfile(
    token: IToken,
    updateProfileDto: UpdateProfileDto,
  ): Promise<boolean> {
    return this.usersService.updateFields(token.userId, updateProfileDto);
  }

  async updatePassword(
    token: IToken,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<boolean> {
    const user = await this.usersService.findOneProfile(token.userId);

    if (
      user.password &&
      (!updatePasswordDto.oldPassword ||
        !(await argon2.verify(user.password, updatePasswordDto.oldPassword)))
    ) {
      throw new ConflictException();
    }

    return this.usersService.updatePassword(
      token.userId,
      updatePasswordDto.newPassword,
    );
  }

  async changeEmailRequest(token: IToken, newEmail: string): Promise<boolean> {
    const code = generateCode();

    if (
      await this.usersService.updateChangeEmailCode(
        token.userId,
        code,
        newEmail,
      )
    ) {
      this.rmqService.sendEmail(
        { method: 'changeEmail' },
        { email: newEmail, code },
      );
    }

    return true;
  }

  changeEmailConfirm(token: IToken, code: string): Promise<boolean> {
    return this.usersService.updateEmailWithCode(token.userId, code);
  }

  async getSessions(token: IToken): Promise<ExternalSessionDto[]> {
    const keys = await this.redisService.keys(`sessions:${token.userId}:*`);
    const current = `sessions:${token.userId}:${token.sessionId}`;
    return (await this.redisService.mget<ISession>(keys)).map(
      (session, index) => ({
        ...session,
        id: keys[index],
        current: current === keys[index],
      }),
    );
  }

  async deleteSessions(token: IToken, remove: string[]): Promise<boolean> {
    const keys = await this.redisService.keys(`sessions:${token.userId}:*`);
    await this.redisService.mdel(remove.filter((key) => keys.includes(key)));
    return true;
  }
}

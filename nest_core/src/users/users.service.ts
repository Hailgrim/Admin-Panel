import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { FindOptions, UpdateOptions } from 'sequelize';

import { User } from './user.entity';
import { USERS_REPOSITORY, PUBLIC, WITH_ROLES } from 'libs/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/roles/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UsersRolesDto } from 'src/database/dto/users-roles.dto';
import { IFindAndCount } from 'src/database/database.types';
import { UpdateUserFields } from './users.types';
import { CacheService } from 'src/cache/cache.service';
import { DatabaseService } from 'src/database/database.service';
import { createHash } from 'libs/utils';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: typeof User,
    private cacheService: CacheService,
    private databaseService: DatabaseService,
  ) {}

  private prepareSearchOptions(getUsersDto?: GetUsersDto): FindOptions<User> {
    const options: FindOptions<User> = {
      ...this.databaseService.preparePaginationOptions(getUsersDto),
    };

    if (getUsersDto?.enabled !== undefined) {
      options.where = { ...options.where, enabled: getUsersDto.enabled };
    }

    return options;
  }

  private prepareGetOptions(getUsersDto?: GetUsersDto): FindOptions<User> {
    return {
      ...this.prepareSearchOptions(getUsersDto),
      ...this.databaseService.preparePaginationOptions(getUsersDto),
    };
  }

  async create(createUserDto: CreateUserDto, roles?: Role[]): Promise<User> {
    let user: User;
    let created: boolean;
    const password = await createHash(createUserDto.password);

    try {
      [user, created] = await this.usersRepository
        .scope([PUBLIC, WITH_ROLES])
        .findOrCreate({
          where: { email: createUserDto.email },
          defaults: { ...createUserDto, password },
        });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!created) {
      throw new ConflictException();
    }

    try {
      if (roles && roles.length > 0) {
        await user.$set('roles', roles);
        user.roles = roles;
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    return user;
  }

  async createByGoogle(
    googleId: string,
    name: string,
    roles?: Role[],
  ): Promise<User> {
    let user: User;
    let created: boolean;

    try {
      [user, created] = await this.usersRepository
        .scope([WITH_ROLES])
        .findOrCreate({
          where: { googleId },
          defaults: { googleId, name, enabled: true, verified: true },
        });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    try {
      if (roles && roles.length > 0 && created) {
        await user.$set('roles', roles);
        user.roles = roles;
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    return user;
  }

  private async findOne(
    options: FindOptions<User>,
    scope?: string | string[],
  ): Promise<User> {
    let user: User | null;

    try {
      user = await this.usersRepository.scope(scope).findOne(options);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  findOneAuth(email: string): Promise<User> {
    return this.findOne({ where: { email } }, WITH_ROLES);
  }

  findOneProfile(id: string): Promise<Omit<User, 'roles'>> {
    return this.findOne({ where: { id } });
  }

  findOnePublic(id: string): Promise<User> {
    return this.findOne({ where: { id } }, [PUBLIC, WITH_ROLES]);
  }

  async findAllPublic(getUsersDto?: GetUsersDto): Promise<User[]> {
    const options = this.prepareGetOptions(getUsersDto);

    try {
      return await this.usersRepository
        .scope([PUBLIC, WITH_ROLES])
        .findAll(options);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findAndCountAllPublic(
    getUsersDto?: GetUsersDto,
  ): Promise<IFindAndCount<User>> {
    const options = this.prepareGetOptions(getUsersDto);

    try {
      return await this.usersRepository
        .scope([PUBLIC, WITH_ROLES])
        .findAndCountAll(options);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async countByRole(roleId: string): Promise<number> {
    try {
      return await this.usersRepository.count({
        include: {
          model: Role,
          where: { id: roleId },
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  private async update(
    fields: UpdateUserFields,
    options: UpdateOptions<User>,
  ): Promise<boolean> {
    let affectedCount = 0;

    try {
      [affectedCount] = await this.usersRepository.update(fields, options);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (affectedCount === 0) {
      throw new NotFoundException();
    }

    return true;
  }

  updateFields(id: string, updateUserDto: UpdateUserDto): Promise<boolean> {
    return this.update(updateUserDto, { where: { id } });
  }

  updateVerificationCode(
    email: string,
    verificationCode: string,
  ): Promise<boolean> {
    return this.update({ verificationCode }, { where: { email } });
  }

  updateVerificationStatus(
    email: string,
    verificationCode: string,
  ): Promise<boolean> {
    return this.update(
      { verificationCode: null, verified: true },
      { where: { email, verificationCode } },
    );
  }

  updateResetPasswordCode(
    email: string,
    resetPasswordCode: string,
  ): Promise<boolean> {
    return this.update({ resetPasswordCode }, { where: { email } });
  }

  async updatePasswordWithCode(
    email: string,
    resetPasswordCode: string,
    newPassword: string,
  ): Promise<boolean> {
    return this.update(
      {
        resetPasswordCode: null,
        password: await createHash(newPassword),
      },
      { where: { email, resetPasswordCode } },
    );
  }

  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    return this.update(
      { password: await createHash(newPassword) },
      { where: { id } },
    );
  }

  updateChangeEmailCode(
    id: string,
    changeEmailCode: string,
    newEmail: string,
  ): Promise<boolean> {
    return this.update(
      { changeEmailCode, temporaryEmail: newEmail },
      { where: { id } },
    );
  }

  async updateEmailWithCode(
    id: string,
    changeEmailCode: string,
  ): Promise<boolean> {
    const user = await this.findOne({ where: { id, changeEmailCode } });

    try {
      await user.update({
        email: user.get('temporaryEmail'),
        changeEmailCode: null,
        temporaryEmail: null,
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    return true;
  }

  async updateRoles(
    id: string,
    usersRolesDtoArr: UsersRolesDto[],
  ): Promise<boolean> {
    const user = await this.findOne({ where: { id } });

    try {
      await user.$set(
        'roles',
        usersRolesDtoArr.map((value) => value.roleId),
      );
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    return true;
  }

  async delete(id: string[]): Promise<boolean> {
    let destroyedCount = 0;

    try {
      destroyedCount = await this.usersRepository.destroy({ where: { id } });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (destroyedCount === 0) {
      throw new NotFoundException();
    }

    for (const userId of id) {
      const keys = await this.cacheService.keys(`sessions:${userId}:*`);
      if (keys.length > 0) {
        await this.cacheService.mdel(keys);
      }
    }

    return true;
  }
}

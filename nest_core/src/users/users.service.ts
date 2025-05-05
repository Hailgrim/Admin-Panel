import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { FindOptions, UpdateOptions } from 'sequelize';

import { UserModel } from './user.entity';
import { USERS_REPOSITORY, PUBLIC, WITH_ROLES } from 'libs/constants';
import { RoleModel } from 'src/roles/role.entity';
import {
  IGetListResponse,
  IUsersRoles,
  TGetListRequest,
} from 'src/database/database.types';
import { TCreateUser, TGetUsers, TUpdateUser } from './users.types';
import { CacheService } from 'src/cache/cache.service';
import { DatabaseService } from 'src/database/database.service';
import { createHash } from 'libs/utils';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: typeof UserModel,
    private cacheService: CacheService,
    private databaseService: DatabaseService,
  ) {}

  async create(fields: TCreateUser, roles?: RoleModel[]): Promise<UserModel> {
    let user: UserModel;
    let created: boolean;

    try {
      [user, created] = await this.usersRepository.findOrCreate({
        where: { email: fields.email },
        defaults: {
          ...fields,
          password: fields.password ? await createHash(fields.password) : null,
        },
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
        user.setDataValue('roles', roles);
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
    roles?: RoleModel[],
  ): Promise<UserModel> {
    let user: UserModel;
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
        user.setDataValue('roles', roles);
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    return user;
  }

  private async findOne(
    options: FindOptions<UserModel>,
    scope?: string | string[],
  ): Promise<UserModel> {
    let user: UserModel | null;

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

  findOneAuth(email: string): Promise<UserModel> {
    return this.findOne({ where: { email } }, WITH_ROLES);
  }

  findOneProfile(id: string): Promise<Omit<UserModel, 'roles'>> {
    return this.findOne({ where: { id } });
  }

  findOnePublic(id: string): Promise<UserModel> {
    return this.findOne({ where: { id } }, [PUBLIC, WITH_ROLES]);
  }

  prepareFindAllOptions(
    fields?: TGetListRequest<TGetUsers>,
  ): FindOptions<UserModel> {
    const options: FindOptions<UserModel> =
      this.databaseService.preparePaginationOptions<UserModel, TGetUsers>(
        fields,
      );

    options.where = {};

    if (fields?.email !== undefined) {
      options.where.email = {
        [this.databaseService.iLike]: `%${fields.email}%`,
      };
    }

    if (fields?.name !== undefined) {
      options.where.name = { [this.databaseService.iLike]: `%${fields.name}%` };
    }

    if (fields?.enabled !== undefined) {
      options.where.enabled = fields.enabled;
    }

    return options;
  }

  async findAllPublic(
    fields?: TGetListRequest<TGetUsers>,
  ): Promise<IGetListResponse<UserModel>> {
    const options = this.prepareFindAllOptions(fields);

    try {
      if (fields?.reqCount) {
        return await this.usersRepository
          .scope([PUBLIC, WITH_ROLES])
          .findAndCountAll(options);
      } else {
        return {
          rows: await this.usersRepository
            .scope([PUBLIC, WITH_ROLES])
            .findAll(options),
        };
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async countByRole(roleId: string): Promise<number> {
    try {
      return await this.usersRepository.count({
        include: {
          model: RoleModel,
          where: { id: roleId },
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  private async update(
    fields: TUpdateUser,
    options: UpdateOptions<UserModel>,
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

  updateFields(id: string, fields: TUpdateUser): Promise<boolean> {
    return this.update(fields, { where: { id } });
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

  async updateRoles(id: string, usersRoles: IUsersRoles[]): Promise<boolean> {
    const user = await this.findOne({ where: { id } });

    try {
      await user.$set(
        'roles',
        usersRoles
          .filter((value) => value.userId === id)
          .map((value) => value.roleId),
      );
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    return true;
  }

  async delete(ids: string[]): Promise<boolean> {
    let destroyedCount = 0;

    try {
      destroyedCount = await this.usersRepository.destroy({
        where: { id: ids },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (destroyedCount === 0) {
      throw new NotFoundException();
    }

    for (const userId of ids) {
      const keys = await this.cacheService.keys(`sessions:${userId}:*`);

      if (keys.length > 0) {
        await this.cacheService.mdel(keys);
      }
    }

    return true;
  }
}

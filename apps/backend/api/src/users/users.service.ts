import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
  UpdateResult,
} from 'typeorm';

import { UserEntity } from './user.entity';
import {
  IGetListResponse,
  IUsersRoles,
  TGetListRequest,
  TCreateUser,
  TGetUsers,
  TUpdateUser,
} from '@ap/shared';
import { CacheService } from 'src/cache/cache.service';
import { DatabaseService } from 'src/database/database.service';
import { createHash } from 'libs/utils';
import { RoleEntity } from 'src/roles/role.entity';
import { UsersRolesEntity } from 'src/database/users-roles.entity';
import { TDatabaseGetList } from 'src/database/database.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private databaseService: DatabaseService,
    private cacheService: CacheService,
  ) {}

  async create(fields: TCreateUser, roles?: RoleEntity[]): Promise<UserEntity> {
    let user: UserEntity | null;

    try {
      user = await this.usersRepository.findOne({
        where: { email: fields.email },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (user) {
      throw new ConflictException();
    }

    try {
      user = this.usersRepository.create({
        ...fields,
        password: await createHash(fields.password),
        roles,
      });
      await this.usersRepository.save(user);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    return user;
  }

  async createByGoogle(
    googleId: string,
    name: string,
    roles?: RoleEntity[],
  ): Promise<UserEntity> {
    let user: UserEntity | null;

    try {
      user = await this.usersRepository.findOne({
        where: { googleId },
        relations: { roles: { rights: { resource: true } } },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!user) {
      try {
        user = this.usersRepository.create({
          googleId,
          name,
          enabled: true,
          verified: true,
          roles,
        });
        await this.usersRepository.save(user);
      } catch (error) {
        Logger.error(error);
        throw new InternalServerErrorException();
      }
    }

    return user;
  }

  private async getOne(
    options: FindOneOptions<UserEntity>,
  ): Promise<UserEntity> {
    let user: UserEntity | null;

    try {
      user = await this.usersRepository.findOne(options);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  getOneAuth(email: string): Promise<UserEntity> {
    return this.getOne({
      where: { email },
      relations: { roles: { rights: { resource: true } } },
    });
  }

  getOneProfile(id: string): Promise<UserEntity> {
    return this.getOne({
      where: { id },
      relations: { roles: { rights: { resource: true } } },
    });
  }

  getOnePublic(id: string): Promise<UserEntity> {
    return this.getOne({
      where: { id },
      relations: { roles: true },
    });
  }

  getOneFlat(id: string): Promise<UserEntity> {
    return this.getOne({ where: { id } });
  }

  prepareGetListOptions(
    fields?: TGetListRequest<TGetUsers>,
  ): TDatabaseGetList<UserEntity> {
    const options = this.databaseService.preparePaginationOptions<
      UserEntity,
      TGetUsers
    >(fields);

    options.where = {};

    if (fields?.email !== undefined) {
      options.where.email = this.databaseService.iLike(`%${fields.email}%`);
    }

    if (fields?.name !== undefined) {
      options.where.name = this.databaseService.iLike(`%${fields.name}%`);
    }

    if (fields?.enabled !== undefined) {
      options.where.enabled = fields.enabled;
    }

    return options;
  }

  async getList(
    fields?: TGetListRequest<TGetUsers>,
  ): Promise<IGetListResponse<UserEntity>> {
    const options = {
      ...this.prepareGetListOptions(fields),
      relations: { roles: true },
    };

    try {
      if (fields?.reqCount) {
        const result = await this.usersRepository.findAndCount(options);
        return {
          rows: result[0],
          page: options.skip / options.take + 1,
          limit: options.take,
          count: result[1],
        };
      } else {
        return {
          rows: await this.usersRepository.find(options),
          page: options.skip / options.take + 1,
          limit: options.take,
        };
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async countByRole(roleId: string): Promise<number> {
    try {
      return await this.usersRepository
        .createQueryBuilder('user')
        .innerJoin('user.roles', 'role')
        .where('role.id = :roleId', { roleId })
        .getCount();
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  private async update(
    fields: TUpdateUser,
    options: FindOptionsWhere<UserEntity>,
  ): Promise<void> {
    let result: UpdateResult;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestException();
    }

    try {
      result = await this.usersRepository.update(options, fields);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async updateFields(id: string, fields: TUpdateUser): Promise<void> {
    await this.update(fields, { id });
  }

  async updateVerificationCode(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    await this.update({ verificationCode }, { email });
  }

  async updateVerificationStatus(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    await this.update(
      { verificationCode: null, verified: true },
      { email, verificationCode },
    );
  }

  async updateResetPasswordCode(
    email: string,
    resetPasswordCode: string,
  ): Promise<void> {
    await this.update({ resetPasswordCode }, { email });
  }

  async updatePasswordWithCode(
    email: string,
    resetPasswordCode: string,
    newPassword: string,
  ): Promise<void> {
    await this.update(
      {
        resetPasswordCode: null,
        password: await createHash(newPassword),
      },
      { email, resetPasswordCode },
    );
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    await this.update({ password: await createHash(newPassword) }, { id });
  }

  async updateChangeEmailCode(
    id: string,
    changeEmailCode: string,
    newEmail: string,
  ): Promise<void> {
    await this.update({ changeEmailCode, temporaryEmail: newEmail }, { id });
  }

  async updateEmailWithCode(
    id: string,
    changeEmailCode: string,
  ): Promise<void> {
    let user: UserEntity | null;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      user = await queryRunner.manager.findOne(UserEntity, {
        where: { id, changeEmailCode },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!user) {
      await queryRunner.commitTransaction();
      await queryRunner.release();
      throw new NotFoundException();
    }

    try {
      await queryRunner.manager.update(
        UserEntity,
        { id },
        {
          email: user.temporaryEmail,
          changeEmailCode: null,
          temporaryEmail: null,
        },
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.error(error);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async updateRoles(id: string, usersRoles: IUsersRoles[]): Promise<void> {
    let user: UserEntity | null;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      user = await queryRunner.manager.findOne(UserEntity, {
        where: { id },
        relations: ['roles'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!user) {
      await queryRunner.commitTransaction();
      await queryRunner.release();
      throw new NotFoundException();
    }

    let newAdminRoles: RoleEntity[];

    try {
      newAdminRoles = await queryRunner.manager.find(RoleEntity, {
        where: {
          id: In(usersRoles.map((userRole) => userRole.roleId)),
          admin: true,
        },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    // Remove new admin roles
    const newUsersRoles = usersRoles.filter(
      (userRole) =>
        userRole.userId === id &&
        !newAdminRoles.some((role) => role.id === userRole.roleId),
    );

    // Add old admin roles
    if (user.roles) {
      newUsersRoles.push(
        ...user.roles
          .filter((role) => role.admin === true)
          .map(
            (role) => ({ roleId: role.id, userId: id }) satisfies IUsersRoles,
          ),
      );
    }

    try {
      await queryRunner.manager.delete(UsersRolesEntity, { userId: id });
      await queryRunner.manager.insert(UsersRolesEntity, newUsersRoles);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.error(error);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async delete(ids: string[]): Promise<void> {
    let result: DeleteResult;

    try {
      result = await this.usersRepository.delete({
        id: In(ids),
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    for (const userId of ids) {
      const keys = await this.cacheService.keys(`sessions:${userId}:*`);

      if (keys.length > 0) {
        await this.cacheService.mdel(keys);
      }
    }
  }
}

import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { FindOptions, UpdateOptions } from 'sequelize';
import * as argon2 from 'argon2';

import { User } from './user.entity';
import { USERS_REPOSITORY, PUBLIC, WITH_ROLES } from 'libs/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/roles/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UsersRolesDto } from 'src/database/dto/users-roles.dto';
import { IFindAndCount } from 'src/database/database.types';
import { UpdateUserFields } from './users.types';
import { preparePaginationOptions } from 'src/database/database.utils';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: typeof User,
  ) {}

  private prepareSearchOptions(getUsersDto?: GetUsersDto): FindOptions<User> {
    const options: FindOptions<User> = {
      ...preparePaginationOptions(getUsersDto),
    };
    if (getUsersDto?.enabled !== undefined) {
      options.where = { ...options.where, enabled: getUsersDto.enabled };
    }
    return options;
  }

  private prepareGetOptions(getUsersDto?: GetUsersDto): FindOptions<User> {
    return {
      ...this.prepareSearchOptions(getUsersDto),
      ...preparePaginationOptions(getUsersDto),
    };
  }

  private async createPasswordHash(password: string): Promise<string> {
    try {
      return argon2.hash(password);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async create(createUserDto: CreateUserDto, roles?: Role[]): Promise<User> {
    let user: User;
    let created = false;
    const password = await this.createPasswordHash(createUserDto.password);

    try {
      [user, created] = await this.usersRepository.findOrCreate({
        where: { email: createUserDto.email },
        defaults: { ...createUserDto, password },
      });
    } catch (error) {
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
      throw new InternalServerErrorException();
    }

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findOneAuth(email: string): Promise<User> {
    return this.findOne({ where: { email } }, WITH_ROLES);
  }

  async findOnePublic(id: number): Promise<User> {
    return this.findOne({ where: { id } }, [PUBLIC, WITH_ROLES]);
  }

  async findAllPublic(getUsersDto?: GetUsersDto): Promise<User[]> {
    const options = this.prepareGetOptions(getUsersDto);
    try {
      return this.usersRepository.scope([PUBLIC, WITH_ROLES]).findAll(options);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAndCountAllPublic(
    getUsersDto?: GetUsersDto,
  ): Promise<IFindAndCount<User>> {
    const options = this.prepareGetOptions(getUsersDto);
    try {
      return this.usersRepository
        .scope([PUBLIC, WITH_ROLES])
        .findAndCountAll(options);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async countByRole(roleId: number): Promise<number> {
    try {
      return await this.usersRepository.count({
        include: {
          model: Role,
          where: { id: roleId },
        },
      });
    } catch (error) {
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
      throw new InternalServerErrorException();
    }

    if (affectedCount == 0) {
      const user = await this.usersRepository.findOne(options);
      if (!user) {
        throw new NotFoundException();
      } else {
        return false;
      }
    }

    return true;
  }

  async updateFields(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    return this.update(updateUserDto, { where: { id } });
  }

  async updateVerificationCode(
    email: string,
    verificationCode: string,
    check?: boolean,
  ): Promise<boolean> {
    if (check) {
      return this.update(
        { verificationCode: null, verified: true },
        { where: { email, verificationCode } },
      );
    } else {
      return this.update({ verificationCode }, { where: { email } });
    }
  }

  async updateResetPasswordCode(
    email: string,
    resetPasswordCode: string,
  ): Promise<boolean> {
    return this.update({ resetPasswordCode }, { where: { email } });
  }

  async updatePassword(
    email: string,
    resetPasswordCode: string,
    newPassword?: string,
  ): Promise<boolean> {
    if (newPassword) {
      return this.update(
        {
          resetPasswordCode: null,
          password: await this.createPasswordHash(newPassword),
        },
        { where: { email, resetPasswordCode } },
      );
    } else {
      return this.update({ resetPasswordCode }, { where: { email } });
    }
  }

  async updateRoles(
    id: number,
    usersRolesDtoArr: UsersRolesDto[],
  ): Promise<boolean> {
    const user = await this.findOne({ where: { id } });
    await user.$set(
      'roles',
      usersRolesDtoArr.map((value) => value.roleId),
    );
    return true;
  }

  async delete(id: number | number[]) {
    let destroyedCount = 0;

    try {
      destroyedCount = await this.usersRepository.destroy({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (destroyedCount == 0) {
      throw new NotFoundException();
    }

    return true;
  }
}

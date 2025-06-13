import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  In,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { RoleEntity } from './role.entity';
import { RightsEntity } from '../database/rights.entity';
import {
  IGetListResponse,
  IRights,
  TGetListRequest,
  TCreateRole,
  TGetRoles,
  TUpdateRole,
} from '@ap/shared';
import { DatabaseService } from 'src/database/database.service';
import { TDatabaseGetList } from 'src/database/database.types';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>,
    private dataSource: DataSource,
    private databaseService: DatabaseService,
  ) {}

  async create(fields: TCreateRole): Promise<RoleEntity> {
    try {
      const role = this.rolesRepository.create(fields);
      return this.rolesRepository.save(role);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findOrCreateDefault(
    name: string,
    description?: string,
    isAdmin?: boolean,
  ): Promise<RoleEntity> {
    let role: RoleEntity;

    try {
      const result = await this.rolesRepository.findOne({
        where: { name, default: true, admin: Boolean(isAdmin) },
        relations: { rights: { resource: true } },
      });

      if (result) {
        role = result;
      } else {
        role = this.rolesRepository.create({
          name,
          description,
          default: true,
          admin: Boolean(isAdmin),
          enabled: true,
        });
        await this.rolesRepository.save(role);
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    return role;
  }

  async getOne(id: string): Promise<RoleEntity> {
    let role: RoleEntity | null;

    try {
      role = await this.rolesRepository.findOne({
        where: { id },
        relations: { rights: { resource: true } },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!role) {
      throw new NotFoundException();
    }

    return role;
  }

  prepareGetListOptions(
    fields?: TGetListRequest<TGetRoles>,
    isAdmin?: boolean,
  ): TDatabaseGetList<RoleEntity> {
    const options = this.databaseService.preparePaginationOptions<
      RoleEntity,
      TGetRoles
    >(fields);

    options.where = {};

    if (fields?.name !== undefined) {
      options.where.name = this.databaseService.iLike(`%${fields.name}%`);
    }

    if (fields?.description !== undefined) {
      options.where.description = this.databaseService.iLike(
        `%${fields.description}%`,
      );
    }

    if (fields?.enabled !== undefined) {
      options.where.enabled = fields.enabled;
    }

    if (isAdmin !== undefined) {
      options.where.admin = isAdmin;
    }

    return options;
  }

  async getList(
    fields?: TGetListRequest<TGetRoles>,
    isAdmin?: boolean,
  ): Promise<IGetListResponse<RoleEntity>> {
    const options = this.prepareGetListOptions(fields, isAdmin);

    try {
      if (fields?.reqCount) {
        const result = await this.rolesRepository.findAndCount(options);
        return {
          rows: result[0],
          page: options.skip / options.take + 1,
          limit: options.take,
          count: result[1],
        };
      } else {
        return {
          rows: await this.rolesRepository.find(options),
          page: options.skip / options.take + 1,
          limit: options.take,
        };
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, fields: TUpdateRole): Promise<boolean> {
    let result: UpdateResult;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestException();
    }

    try {
      result = await this.rolesRepository.update(
        { id, default: false },
        fields,
      );
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return true;
  }

  async updateRights(
    id: string,
    rights: IRights[],
    defaultResource?: boolean,
  ): Promise<void> {
    let role: RoleEntity | null;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      role = await queryRunner.manager.findOne(RoleEntity, {
        where: { id, default: Boolean(defaultResource) },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!role) {
      await queryRunner.commitTransaction();
      await queryRunner.release();
      throw new NotFoundException();
    }

    try {
      await queryRunner.manager.delete(RightsEntity, { roleId: id });
      await queryRunner.manager.insert(
        RightsEntity,
        rights
          .filter((value) => value.roleId === id)
          .map((value) => ({ ...value, roleId: id })),
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

  async delete(ids: string[]): Promise<boolean> {
    let result: DeleteResult;

    try {
      result = await this.rolesRepository.delete({
        id: In(ids),
        default: false,
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return true;
  }
}

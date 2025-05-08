import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FindOptions } from 'sequelize';

import {
  PUBLIC,
  ROLES_REPOSITORY,
  ROLES_RESOURCES_REPOSITORY,
  WITH_RESOURCES,
} from 'libs/constants';
import { RoleModel } from './role.entity';
import { RightsModel } from '../database/rights.entity';
import {
  IGetListResponse,
  IRights,
  TGetListRequest,
  TCreateRole,
  TGetRoles,
  TUpdateRole,
} from '@ap/shared';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RolesService {
  constructor(
    @Inject(ROLES_REPOSITORY)
    private rolesRepository: typeof RoleModel,
    @Inject(ROLES_RESOURCES_REPOSITORY)
    private rolesResourcesRepository: typeof RightsModel,
    private databaseService: DatabaseService,
  ) {}

  async create(fields: TCreateRole): Promise<RoleModel> {
    try {
      return await this.rolesRepository.create(fields);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findOrCreateDefault(
    name: string,
    description?: string,
    isAdmin?: boolean,
  ): Promise<RoleModel> {
    let role: RoleModel;

    try {
      [role] = await this.rolesRepository.scope(WITH_RESOURCES).findOrCreate({
        where: { name, default: true, admin: Boolean(isAdmin) },
        defaults: {
          name,
          description,
          default: true,
          admin: Boolean(isAdmin),
          enabled: true,
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    return role;
  }

  async getOnePublic(id: string): Promise<RoleModel> {
    let role: RoleModel | null;

    try {
      role = await this.rolesRepository
        .scope([PUBLIC, WITH_RESOURCES])
        .findOne({ where: { id } });
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
  ): FindOptions<RoleModel> {
    const options: FindOptions<RoleModel> =
      this.databaseService.preparePaginationOptions<RoleModel, TGetRoles>(
        fields,
      );

    options.where = {};

    if (fields?.name !== undefined) {
      options.where.name = { [this.databaseService.iLike]: `%${fields.name}%` };
    }

    if (fields?.description !== undefined) {
      options.where.description = {
        [this.databaseService.iLike]: `%${fields.description}%`,
      };
    }

    if (fields?.enabled !== undefined) {
      options.where.enabled = fields.enabled;
    }

    if (isAdmin !== undefined) {
      options.where.admin = isAdmin;
    }

    return options;
  }

  async getListPublic(
    fields?: TGetListRequest<TGetRoles>,
    isAdmin?: boolean,
  ): Promise<IGetListResponse<RoleModel>> {
    const options = this.prepareGetListOptions(fields, isAdmin);

    if (isAdmin !== undefined) {
      options.where = { ...options.where, admin: isAdmin };
    }

    try {
      if (fields?.reqCount) {
        return await this.rolesRepository
          .scope(PUBLIC)
          .findAndCountAll(options);
      } else {
        return {
          rows: await this.rolesRepository.scope(PUBLIC).findAll(options),
        };
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updateFields(id: string, fields: TUpdateRole): Promise<boolean> {
    let affectedCount = 0;

    try {
      [affectedCount] = await this.rolesRepository.update(fields, {
        where: { id, default: false },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (affectedCount === 0) {
      throw new NotFoundException();
    }

    return true;
  }

  async updateResources(
    id: string,
    rights: IRights[],
    defaultResource?: boolean,
  ): Promise<boolean> {
    let role: RoleModel | null;

    try {
      role = await this.rolesRepository.scope(WITH_RESOURCES).findOne({
        where: { id, default: Boolean(defaultResource) },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!role) {
      throw new NotFoundException();
    }

    const deletedResources: string[] = [];
    role.get('resources')?.forEach((resource) => {
      if (!rights.some((value) => value.roleId === resource.get('id'))) {
        deletedResources.push(resource.id);
      }
    });

    if (deletedResources.length > 0) {
      try {
        await this.rolesResourcesRepository.destroy({
          where: { roleId: id, resourceId: deletedResources },
        });
      } catch (error) {
        Logger.error(error);
        throw new InternalServerErrorException();
      }
    }

    try {
      await this.rolesResourcesRepository.bulkCreate(
        rights.filter((value) => value.roleId === role.get('id')),
        {
          updateOnDuplicate: ['creating', 'reading', 'updating', 'deleting'],
        },
      );
    } catch (error) {
      Logger.error(error);
    }

    return true;
  }

  async delete(ids: string[]): Promise<boolean> {
    let destroyedCount = 0;

    try {
      destroyedCount = await this.rolesRepository.destroy({
        where: { id: ids, default: false },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (destroyedCount === 0) {
      throw new NotFoundException();
    }

    return true;
  }
}

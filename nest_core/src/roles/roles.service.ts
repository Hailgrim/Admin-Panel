import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FindOptions, Op } from 'sequelize';

import {
  PUBLIC,
  ROLES_REPOSITORY,
  ROLES_RESOURCES_REPOSITORY,
  WITH_RESOURCES,
} from 'libs/constants';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.entity';
import { GetRolesDto } from './dto/get-roles.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesResources } from '../database/roles-resources.entity';
import { IFindAndCount } from 'src/database/database.types';
import { RolesResourcesDto } from 'src/database/dto/roles-resources.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RolesService {
  constructor(
    @Inject(ROLES_REPOSITORY)
    private rolesRepository: typeof Role,
    @Inject(ROLES_RESOURCES_REPOSITORY)
    private rolesResourcesRepository: typeof RolesResources,
    private databaseService: DatabaseService,
  ) {}

  private prepareSearchOptions(getRolesDto?: GetRolesDto): FindOptions<Role> {
    const options: FindOptions<Role> = {
      ...this.databaseService.preparePaginationOptions(getRolesDto),
    };

    if (getRolesDto?.name !== undefined) {
      options.where = { ...options.where, name: getRolesDto.name };
    }

    if (getRolesDto?.description !== undefined) {
      options.where = {
        ...options.where,
        description: getRolesDto.description,
      };
    }

    return options;
  }

  private prepareGetOptions(getRolesDto?: GetRolesDto): FindOptions<Role> {
    return {
      ...this.prepareSearchOptions(getRolesDto),
      ...this.databaseService.preparePaginationOptions(getRolesDto),
    };
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      return await this.rolesRepository.create({
        ...createRoleDto,
        default: false,
        admin: false,
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findOrCreateDefault(
    name: string,
    description?: string,
    isAdmin?: boolean,
  ): Promise<Role> {
    let role: Role;

    try {
      [role] = await this.rolesRepository.findOrCreate({
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

  async findOnePublic(id: string): Promise<Role> {
    let role: Role | null;

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

  async findAllPublic(
    getRolesDto?: GetRolesDto,
    isAdmin?: boolean,
  ): Promise<Role[]> {
    const options = this.prepareGetOptions(getRolesDto);
    if (isAdmin) {
      options.where = { ...options.where, admin: true };
    }

    try {
      return await this.rolesRepository.scope(PUBLIC).findAll(options);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findAndCountAllPublic(
    getRolesDto?: GetRolesDto,
  ): Promise<IFindAndCount<Role>> {
    const options = this.prepareGetOptions(getRolesDto);

    try {
      return await this.rolesRepository.scope(PUBLIC).findAndCountAll(options);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updateFields(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<boolean> {
    let affectedCount = 0;

    try {
      [affectedCount] = await this.rolesRepository.update(updateRoleDto, {
        where: { id, default: { [Op.ne]: true } },
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
    rolesResourcesDtoArr: RolesResourcesDto[],
  ): Promise<boolean> {
    let role: Role | null;

    try {
      role = await this.rolesRepository
        .scope(WITH_RESOURCES)
        .findOne({ where: { id, admin: { [Op.ne]: true } } });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!role) {
      throw new NotFoundException();
    }

    const deleteAllows: string[] = [];
    role.resources?.forEach((resource) => {
      if (
        !rolesResourcesDtoArr.some(
          (value) => value.roleId === resource.get('id'),
        )
      ) {
        deleteAllows.push(resource.id);
      }
    });

    if (deleteAllows.length > 0) {
      try {
        await this.rolesResourcesRepository.destroy({
          where: { roleId: id, resourceId: deleteAllows },
        });
      } catch (error) {
        Logger.error(error);
        throw new InternalServerErrorException();
      }
    }

    try {
      await Promise.all(
        rolesResourcesDtoArr.map(async (roleResource) => {
          const [, created] = await this.rolesResourcesRepository.findOrCreate({
            where: {
              roleId: roleResource.roleId,
              resourceId: roleResource.resourceId,
            },
            defaults: roleResource,
          });

          if (!created) {
            await this.rolesResourcesRepository.update(roleResource, {
              where: {
                roleId: roleResource.roleId,
                resourceId: roleResource.resourceId,
              },
            });
          }
        }),
      );
    } catch (error) {
      Logger.error(error);
    }

    return true;
  }

  async delete(id: string[]): Promise<boolean> {
    let destroyedCount = 0;

    try {
      destroyedCount = await this.rolesRepository.destroy({
        where: { id, default: { [Op.ne]: true } },
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

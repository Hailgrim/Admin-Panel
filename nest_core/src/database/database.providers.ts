import { Sequelize } from 'sequelize-typescript';

import { SEQUELIZE } from 'libs/constants';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from 'libs/config';
import { User } from 'src/users/user.entity';
import { Role } from 'src/roles/role.entity';
import { UsersRoles } from './users-roles.entity';
import { Resource } from 'src/resources/resource.entity';
import { RolesResources } from './roles-resources.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
      });
      sequelize.addModels([User, Role, UsersRoles, Resource, RolesResources]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

import { Module } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

import { DatabaseService } from './database.service';
import { SEQUELIZE } from 'libs/constants';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from 'libs/config';
import { UserModel } from 'src/users/user.entity';
import { RoleModel } from 'src/roles/role.entity';
import { UsersRolesModel } from './users-roles.entity';
import { ResourceModel } from 'src/resources/resource.entity';
import { RightsModel } from './rights.entity';

@Module({
  providers: [
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
        sequelize.addModels([
          UserModel,
          RoleModel,
          UsersRolesModel,
          ResourceModel,
          RightsModel,
        ]);
        await sequelize.sync();
        return sequelize;
      },
    },
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

import { DatabaseService } from 'src/database/database.service';
import { SEQUELIZE } from 'libs/constants';
import { UserModel } from 'src/users/user.entity';
import { RoleModel } from 'src/roles/role.entity';
import { UsersRolesModel } from 'src/database/users-roles.entity';
import { ResourceModel } from 'src/resources/resource.entity';
import { RightsModel } from 'src/database/rights.entity';

@Module({
  providers: [
    {
      provide: SEQUELIZE,
      useFactory: async () => {
        const sequelize = new Sequelize({
          dialect: 'sqlite',
          storage: ':memory:',
          logging: false,
        });
        sequelize.addModels([
          UserModel,
          RoleModel,
          UsersRolesModel,
          ResourceModel,
          RightsModel,
        ]);
        await sequelize.sync({ force: true });
        return sequelize;
      },
    },
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseTestModule {}

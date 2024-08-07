import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { usersProviders } from 'src/users/users.providers';
import { RolesService } from 'src/roles/roles.service';
import { rolesProviders } from 'src/roles/roles.providers';
import { ResourcesService } from 'src/resources/resources.service';
import { resourcesProviders } from 'src/resources/resources.providers';
import { rolesResourcesProviders } from 'src/database/roles-resources.providers';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { rmqProviders } from 'src/rmq.providers';

@Module({
  imports: [
    RedisModule,
    UsersModule,
    PassportModule.register({
      session: false,
    }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    UsersService,
    ...usersProviders,
    RolesService,
    ...rolesProviders,
    ResourcesService,
    ...resourcesProviders,
    ...rolesResourcesProviders,
    RedisService,
    ...rmqProviders,
  ],
  exports: [AuthService],
})
export class AuthModule {}

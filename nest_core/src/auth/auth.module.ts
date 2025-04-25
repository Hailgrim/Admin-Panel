import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { AuthController } from './auth.controller';
import { CacheModule } from 'src/cache/cache.module';
import { RolesModule } from 'src/roles/roles.module';
import { ResourcesModule } from 'src/resources/resources.module';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [
    CacheModule,
    QueueModule,
    UsersModule,
    RolesModule,
    ResourcesModule,
    PassportModule.register({
      session: false,
    }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}

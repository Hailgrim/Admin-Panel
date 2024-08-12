import {
  Controller,
  UseGuards,
  Body,
  Req,
  Get,
  HttpStatus,
  Delete,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Rights } from 'libs/constants';
import { RolesGuard } from 'src/roles/roles.guard';
import d from 'locales/dictionary';
import { IUser } from 'src/users/users.types';
import { ExternalSessionDto } from './dto/external-session.dto';
import { FastifyRequestWithToken, ISession } from 'src/auth/auth.types';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ProfileService } from './profile.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

const route = 'profile';

@ApiTags(d['en'].profile)
@Controller(route)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiOperation({ summary: d['en'].profile })
  @ApiResponse({ status: HttpStatus.OK, type: IUser })
  @Roles({ path: route, action: Rights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  getProfile(@Req() req: FastifyRequestWithToken): Promise<IUser> {
    return this.profileService.getProfile(req.user);
  }

  @ApiOperation({ summary: d['en'].updateProfile })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch()
  updateProfile(
    @Req() req: FastifyRequestWithToken,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<boolean> {
    return this.profileService.updateProfile(req.user, updateProfileDto);
  }

  @ApiOperation({ summary: d['en'].updatePassword })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('update-password')
  updatePassword(
    @Req() req: FastifyRequestWithToken,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<boolean> {
    return this.profileService.updatePassword(req.user, updatePasswordDto);
  }

  @ApiOperation({ summary: d['en'].changeEmailRequest })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post('change-email')
  changeEmailRequest(
    @Req() req: FastifyRequestWithToken,
    @Body() newEmail: string,
  ): Promise<boolean> {
    return this.profileService.changeEmailRequest(req.user, newEmail);
  }

  @ApiOperation({ summary: d['en'].changeEmailConfirm })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('change-email')
  changeEmailConfirm(
    @Req() req: FastifyRequestWithToken,
    @Body() code: string,
  ): Promise<boolean> {
    return this.profileService.changeEmailConfirm(req.user, code);
  }

  @ApiOperation({ summary: d['en'].sessions })
  @ApiResponse({ status: HttpStatus.OK, type: [ISession] })
  @Roles({ path: route, action: Rights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('sessions')
  async getSessions(
    @Req() req: FastifyRequestWithToken,
  ): Promise<ExternalSessionDto[]> {
    const sessions = await this.profileService.getSessions(req.user);
    return sessions.map((session) => new ExternalSessionDto(session));
  }

  @ApiOperation({ summary: d['en'].deleteSessions })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('sessions')
  deleteSessions(
    @Req() req: FastifyRequestWithToken,
    @Body() keys: string[],
  ): Promise<boolean> {
    return this.profileService.deleteSessions(req.user, keys);
  }
}

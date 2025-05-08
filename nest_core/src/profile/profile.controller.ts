import {
  Controller,
  UseGuards,
  Body,
  Req,
  Get,
  HttpStatus,
  Delete,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from 'src/roles/roles.decorator';
import { ERights } from 'libs/constants';
import { RolesGuard } from 'src/roles/roles.guard';
import { TFastifyRequestWithToken } from 'src/auth/auth.types';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ProfileService } from './profile.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ChangeEmailRequestDto } from './dto/change-email-request.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { QueryItemsDto } from 'src/database/dto/query-items.dto';
import { d, IExternalSession, IUser, ROUTES } from '@ap/shared';
import { ExternalUserDto } from 'src/users/dto/external-user.dto';
import { ExternalSessionDto } from './dto/external-session.dto';

const route = ROUTES.api.profile.substring(1);

@ApiTags(d['en'].profile)
@Controller(route)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiOperation({ summary: d['en'].getProfileFields })
  @ApiResponse({ status: HttpStatus.OK, type: ExternalUserDto })
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  getProfile(@Req() req: TFastifyRequestWithToken): IUser {
    return req.originalUser;
  }

  @ApiOperation({ summary: d['en'].updateProfile })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch()
  updateProfile(
    @Req() req: TFastifyRequestWithToken,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<boolean> {
    return this.profileService.updateProfile(req.user.userId, updateProfileDto);
  }

  @ApiOperation({ summary: d['en'].updatePassword })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('update-password')
  updatePassword(
    @Req() req: TFastifyRequestWithToken,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<boolean> {
    return this.profileService.updatePassword(
      req.user.userId,
      updatePasswordDto.newPassword,
      updatePasswordDto.oldPassword,
    );
  }

  @ApiOperation({ summary: d['en'].changeEmailRequest })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post('change-email')
  changeEmailRequest(
    @Req() req: TFastifyRequestWithToken,
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() dhangeEmailRequestDto: ChangeEmailRequestDto,
  ): Promise<boolean> {
    res.status(HttpStatus.OK);
    return this.profileService.changeEmailRequest(
      req.user.userId,
      dhangeEmailRequestDto.newEmail,
    );
  }

  @ApiOperation({ summary: d['en'].changeEmailConfirm })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('change-email')
  changeEmail(
    @Req() req: TFastifyRequestWithToken,
    @Body() changeEmailDto: ChangeEmailDto,
  ): Promise<boolean> {
    return this.profileService.changeEmail(
      req.user.userId,
      changeEmailDto.code,
    );
  }

  @ApiOperation({ summary: d['en'].getSessions })
  @ApiResponse({ status: HttpStatus.OK, type: [ExternalSessionDto] })
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('sessions')
  getSessions(
    @Req() req: TFastifyRequestWithToken,
  ): Promise<IExternalSession[]> {
    return this.profileService.getSessions(req.user.userId, req.user.sessionId);
  }

  @ApiOperation({ summary: d['en'].deleteSessions })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: ERights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('sessions')
  deleteSessions(
    @Req() req: TFastifyRequestWithToken,
    @Body() QueryItemsDto: QueryItemsDto<IExternalSession['id']>,
  ): Promise<boolean> {
    return this.profileService.deleteSessions(
      req.user.userId,
      QueryItemsDto.items,
    );
  }
}

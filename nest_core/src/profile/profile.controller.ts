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
import { plainToInstance } from 'class-transformer';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from 'src/roles/roles.decorator';
import { ERights } from 'libs/constants';
import { RolesGuard } from 'src/roles/roles.guard';
import { TFastifyRequestWithToken } from 'src/auth/auth.types';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ProfileService } from './profile.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ChangeEmailRequestDto } from './dto/change-email-request.dto';
import { ChangeEmailConfirmDto } from './dto/change-email-confirm.dto';
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
  getProfile(
    @Req() req: TFastifyRequestWithToken,
    @Res({ passthrough: true }) res: FastifyReply,
  ): IUser {
    res.status(HttpStatus.OK);
    return plainToInstance(ExternalUserDto, req.originalUser);
  }

  @ApiOperation({ summary: d['en'].updateProfile })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch()
  async updateProfile(
    @Req() req: TFastifyRequestWithToken,
    @Body() updateProfileDto: UpdateProfileDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    res.status(HttpStatus.NO_CONTENT);
    await this.profileService.updateProfile(req.user.userId, updateProfileDto);
  }

  @ApiOperation({ summary: d['en'].updatePassword })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('update-password')
  async updatePassword(
    @Req() req: TFastifyRequestWithToken,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    res.status(HttpStatus.NO_CONTENT);
    await this.profileService.updatePassword(
      req.user.userId,
      updatePasswordDto.newPassword,
      updatePasswordDto.oldPassword,
    );
  }

  @ApiOperation({ summary: d['en'].changeEmailRequest })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post('change-email')
  async changeEmailRequest(
    @Req() req: TFastifyRequestWithToken,
    @Body() dhangeEmailRequestDto: ChangeEmailRequestDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    res.status(HttpStatus.NO_CONTENT);
    await this.profileService.changeEmailRequest(
      req.user.userId,
      dhangeEmailRequestDto.newEmail,
    );
  }

  @ApiOperation({ summary: d['en'].changeEmailConfirm })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('change-email')
  async changeEmailConfirm(
    @Req() req: TFastifyRequestWithToken,
    @Body() changeEmailConfirmDto: ChangeEmailConfirmDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    res.status(HttpStatus.NO_CONTENT);
    await this.profileService.changeEmailConfirm(
      req.user.userId,
      changeEmailConfirmDto.code,
    );
  }

  @ApiOperation({ summary: d['en'].getSessions })
  @ApiResponse({ status: HttpStatus.OK, type: [ExternalSessionDto] })
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('sessions')
  getSessions(
    @Req() req: TFastifyRequestWithToken,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<IExternalSession[]> {
    res.status(HttpStatus.OK);
    return this.profileService.getSessions(req.user.userId, req.user.sessionId);
  }

  @ApiOperation({ summary: d['en'].deleteSessions })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Roles({ path: route, action: ERights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('sessions')
  async deleteSessions(
    @Req() req: TFastifyRequestWithToken,
    @Body() QueryItemsDto: QueryItemsDto<IExternalSession['id']>,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    res.status(HttpStatus.NO_CONTENT);
    await this.profileService.deleteSessions(
      req.user.userId,
      QueryItemsDto.items,
    );
  }
}

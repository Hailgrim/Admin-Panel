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
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { TExternalSession, IUser, ROUTES, getT } from '@ap/shared';
import { ExternalUserDto } from 'src/users/dto/external-user.dto';
import { ExternalSessionDto } from './dto/external-session.dto';

const route = ROUTES.api.profile.substring(1);

@ApiTags(getT().profile)
@Controller(route)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiOperation({ summary: getT().getProfileFields })
  @ApiResponse({ status: HttpStatus.OK, type: ExternalUserDto })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  getProfile(@Req() req: TFastifyRequestWithToken): IUser {
    return plainToInstance(ExternalUserDto, req.originalUser);
  }

  @ApiOperation({ summary: getT().updateProfile })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch()
  async updateProfile(
    @Req() req: TFastifyRequestWithToken,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<void> {
    await this.profileService.updateProfile(req.user.userId, updateProfileDto);
  }

  @ApiOperation({ summary: getT().updatePassword })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('update-password')
  async updatePassword(
    @Req() req: TFastifyRequestWithToken,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    await this.profileService.updatePassword(
      req.user.userId,
      updatePasswordDto.newPassword,
      updatePasswordDto.oldPassword,
    );
  }

  @ApiOperation({ summary: getT().changeEmailRequest })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post('change-email')
  async changeEmailRequest(
    @Req() req: TFastifyRequestWithToken,
    @Body() dhangeEmailRequestDto: ChangeEmailRequestDto,
  ): Promise<void> {
    await this.profileService.changeEmailRequest(
      req.user.userId,
      dhangeEmailRequestDto.newEmail,
    );
  }

  @ApiOperation({ summary: getT().changeEmailConfirm })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('change-email')
  async changeEmailConfirm(
    @Req() req: TFastifyRequestWithToken,
    @Body() changeEmailConfirmDto: ChangeEmailConfirmDto,
  ): Promise<void> {
    await this.profileService.changeEmailConfirm(
      req.user.userId,
      changeEmailConfirmDto.code,
    );
  }

  @ApiOperation({ summary: getT().getSessions })
  @ApiResponse({ status: HttpStatus.OK, type: [ExternalSessionDto] })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('sessions')
  async getSessions(
    @Req() req: TFastifyRequestWithToken,
  ): Promise<TExternalSession[]> {
    const sessions = await this.profileService.getSessions(
      req.user.userId,
      req.user.sessionId,
    );
    return plainToInstance(ExternalSessionDto, sessions);
  }

  @ApiOperation({ summary: getT().deleteSessions })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('sessions')
  async deleteSessions(
    @Req() req: TFastifyRequestWithToken,
    @Body() QueryItemsDto: QueryItemsDto<TExternalSession['id']>,
  ): Promise<void> {
    await this.profileService.deleteSessions(
      req.user.userId,
      QueryItemsDto.items,
    );
  }
}

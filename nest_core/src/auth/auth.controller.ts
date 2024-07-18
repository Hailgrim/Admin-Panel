import {
  Controller,
  Post,
  UseGuards,
  Body,
  Res,
  Req,
  Get,
  HttpStatus,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtGuard } from './jwt.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { SignInDto } from './dto/sign-in-auth.dto';
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from 'libs/config';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { SignUpDto } from './dto/sign-up.dts';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Rights } from 'libs/constants';
import { RolesGuard } from 'src/roles/roles.guard';
import d from 'locales/dictionary';
import { FastifyRequestWithToken, FastifyRequestWithUser } from './auth.types';
import { IUser } from 'src/users/users.types';
import { getCookies } from './auth.utils';

@ApiTags(d['en'].authorization)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: d['en'].signUp })
  @ApiResponse({ status: HttpStatus.CREATED, type: IUser })
  @Post('sign-up')
  async signUp(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() signUpDto: SignUpDto,
  ): Promise<IUser> {
    res.status(HttpStatus.CREATED);
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: d['en'].forgotPassword })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Post('forgot-password')
  async forgotPassword(@Body() email: string): Promise<boolean> {
    return this.authService.forgotPassword(email);
  }

  @ApiOperation({ summary: d['en'].resetPassword })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<boolean> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({ summary: d['en'].signIn })
  @ApiResponse({ status: HttpStatus.CREATED, type: IUser })
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @Req() req: FastifyRequestWithUser,
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() signInDto: SignInDto,
  ): Promise<IUser> {
    const sessionTtl = signInDto.rememberMe
      ? REFRESH_TOKEN_LIFETIME
      : ACCESS_TOKEN_LIFETIME * 2;
    const { accessToken, refreshToken } = await this.authService.signIn(
      req.user,
      sessionTtl,
    );

    res.cookie('accessToken', accessToken, this.authService.prepareCookie());
    res.cookie(
      'refreshToken',
      refreshToken,
      this.authService.prepareCookie(sessionTtl),
    );

    if (signInDto.rememberMe) {
      res.cookie(
        'rememberMe',
        'true',
        this.authService.prepareCookie(REFRESH_TOKEN_LIFETIME),
      );
    } else {
      res.clearCookie('rememberMe', this.authService.prepareCookie());
    }

    res.status(HttpStatus.CREATED);
    return req.user;
  }

  @ApiOperation({ summary: d['en'].confirmRegistration })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Post('verify-user')
  async verifyUser(@Body() verifyUserDto: VerifyUserDto): Promise<boolean> {
    return this.authService.verifyUser(verifyUserDto);
  }

  @ApiOperation({ summary: d['en'].refreshToken })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() req: FastifyRequestWithToken,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<boolean> {
    const rememberMe = 'rememberMe' in getCookies(req.headers.cookie);
    const sessionTtl = rememberMe
      ? REFRESH_TOKEN_LIFETIME
      : ACCESS_TOKEN_LIFETIME * 2;
    const { accessToken, refreshToken } = await this.authService.refresh(
      req.user,
      sessionTtl,
    );

    res.cookie('accessToken', accessToken, this.authService.prepareCookie());
    res.cookie(
      'refreshToken',
      refreshToken,
      this.authService.prepareCookie(sessionTtl),
    );

    if (rememberMe) {
      res.cookie(
        'rememberMe',
        'true',
        this.authService.prepareCookie(REFRESH_TOKEN_LIFETIME),
      );
    }

    return true;
  }

  @ApiOperation({ summary: d['en'].profile })
  @ApiResponse({ status: HttpStatus.OK, type: IUser })
  @Roles({ path: 'profile', action: Rights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('profile')
  async getProfile(@Req() req: FastifyRequestWithToken): Promise<IUser> {
    return this.authService.getProfile(req.user);
  }

  @ApiOperation({ summary: d['en'].updateProfile })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: 'profile', action: Rights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('profile')
  async updateProfile(
    @Req() req: FastifyRequestWithToken,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<boolean> {
    return this.authService.updateProfile(req.user, updateProfileDto);
  }

  @ApiOperation({ summary: d['en'].signOut })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @UseGuards(JwtGuard)
  @Delete('log-out')
  async signOut(
    @Req() req: FastifyRequestWithToken,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<boolean> {
    const result = await this.authService.signOut(req.user);
    res.clearCookie('accessToken', this.authService.prepareCookie());
    res.clearCookie('refreshToken', this.authService.prepareCookie());
    res.clearCookie('rememberMe', this.authService.prepareCookie());
    return result;
  }
}

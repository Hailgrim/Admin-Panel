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
  UseInterceptors,
  ClassSerializerInterceptor,
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
import {
  FastifyRequestWithToken,
  FastifyRequestWithUser,
  ISession,
} from './auth.types';
import { IUser } from 'src/users/users.types';
import { getCookies } from './auth.utils';
import { ExternalSessionDto } from './dto/external-session.dto';

const route = 'profile';

@ApiTags(d['en'].authorization)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: d['en'].signUp })
  @ApiResponse({ status: HttpStatus.CREATED, type: IUser })
  @Post('sign-up')
  signUp(
    @Res() res: FastifyReply,
    @Body() signUpDto: SignUpDto,
  ): Promise<IUser> {
    res.status(HttpStatus.CREATED);
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: d['en'].forgotPassword })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Post('forgot-password')
  forgotPassword(@Body() email: string): Promise<boolean> {
    return this.authService.forgotPassword(email);
  }

  @ApiOperation({ summary: d['en'].resetPassword })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<boolean> {
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
      req.ips?.length ? req.ips[0] : req.ip,
      req.headers['user-agent'],
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
  verifyUser(@Body() verifyUserDto: VerifyUserDto): Promise<boolean> {
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
      req.ips?.length ? req.ips[0] : req.ip,
      req.headers['user-agent'],
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
  @Roles({ path: route, action: Rights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get(route)
  getProfile(@Req() req: FastifyRequestWithToken): Promise<IUser> {
    return this.authService.getProfile(req.user);
  }

  @ApiOperation({ summary: d['en'].updateProfile })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(route)
  updateProfile(
    @Req() req: FastifyRequestWithToken,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<boolean> {
    return this.authService.updateProfile(req.user, updateProfileDto);
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
    const sessions = await this.authService.getSessions(req.user);
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
    return this.authService.deleteSessions(req.user, keys);
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
    const cookieOptions = this.authService.prepareCookie();
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.clearCookie('rememberMe', cookieOptions);
    return result;
  }
}

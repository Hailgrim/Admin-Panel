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

import lang from 'libs/lang';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import {
  FastifyRequestWithAuth,
  FastifyRequestWithUser,
  ITokensResponse,
  IUser,
} from 'libs/types';
import { JwtGuard } from './jwt.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { getCookies } from 'libs/functions';
import { SignInDto } from './dto/sign-in-auth.dto';
import {
  ACCESS_TOKEN_LIFETIME,
  PROJECT_TAG,
  REFRESH_TOKEN_LIFETIME,
} from 'libs/config';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { SignUpDto } from './dto/sign-up.dts';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Rights } from 'libs/constants';
import { RolesGuard } from 'src/roles/roles.guard';

const route = 'auth';

@ApiTags(String(lang.get('en')?.authorization))
@Controller(route)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: lang.get('en')?.signUp })
  @ApiResponse({ status: HttpStatus.CREATED, type: IUser })
  @Post('sign-up')
  async signUp(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() signUpDto: SignUpDto,
  ): Promise<IUser> {
    res.status(HttpStatus.CREATED);
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: lang.get('en')?.confirmRegistration })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Post('verify-user')
  async verifyUser(@Body() verifyUserDto: VerifyUserDto): Promise<boolean> {
    return this.authService.verifyUser(verifyUserDto);
  }

  @ApiOperation({ summary: lang.get('en')?.forgotPassword })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Post('forgot-password')
  async forgotPassword(@Body() email: string): Promise<boolean> {
    return this.authService.forgotPassword(email);
  }

  @ApiOperation({ summary: lang.get('en')?.resetPassword })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<boolean> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({ summary: lang.get('en')?.signIn })
  @ApiResponse({ status: HttpStatus.CREATED, type: IUser })
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @Req() req: FastifyRequestWithUser,
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() signInDto: SignInDto,
  ): Promise<IUser> {
    const oldSessionId = req.cookies[`${PROJECT_TAG}_sessionId`];
    const rememberMe = signInDto.rememberMe;
    const { accessToken, refreshToken, sessionId } =
      await this.authService.signIn(req.user, rememberMe, oldSessionId);

    res.cookie(`${PROJECT_TAG}_accessToken`, accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: ACCESS_TOKEN_LIFETIME,
    });
    res.cookie(`${PROJECT_TAG}_refreshToken`, refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: rememberMe ? REFRESH_TOKEN_LIFETIME : ACCESS_TOKEN_LIFETIME * 2,
    });
    res.cookie(`${PROJECT_TAG}_sessionId`, String(sessionId), {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: REFRESH_TOKEN_LIFETIME * 12,
    });

    if (rememberMe) {
      res.cookie(`${PROJECT_TAG}_rememberMe`, '', {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: REFRESH_TOKEN_LIFETIME,
      });
    } else {
      res.clearCookie(`${PROJECT_TAG}_rememberMe`);
    }

    res.status(HttpStatus.CREATED);
    return req.user;
  }

  @ApiOperation({ summary: lang.get('en')?.refreshToken })
  @ApiResponse({ status: HttpStatus.OK, type: ITokensResponse })
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() req: FastifyRequestWithAuth,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<ITokensResponse> {
    const rememberMe =
      `${PROJECT_TAG}_rememberMe` in getCookies(req.headers.cookie);
    const { accessToken, refreshToken } = await this.authService.refresh(
      req.user,
      rememberMe,
    );

    res.cookie(`${PROJECT_TAG}_accessToken`, accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: ACCESS_TOKEN_LIFETIME,
    });
    res.cookie(`${PROJECT_TAG}_refreshToken`, refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: rememberMe ? REFRESH_TOKEN_LIFETIME : ACCESS_TOKEN_LIFETIME * 2,
    });
    res.cookie(`${PROJECT_TAG}_sessionId`, String(req.user.sessionId), {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: REFRESH_TOKEN_LIFETIME * 12,
    });

    if (rememberMe) {
      res.cookie(`${PROJECT_TAG}_rememberMe`, '', {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: REFRESH_TOKEN_LIFETIME,
      });
    }

    return { accessToken, refreshToken };
  }

  @ApiOperation({ summary: lang.get('en')?.profile })
  @ApiResponse({ status: HttpStatus.OK, type: IUser })
  @Roles({ path: route, action: Rights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('profile')
  async getProfile(@Req() req: FastifyRequestWithAuth): Promise<IUser> {
    return this.authService.getProfile(req.user);
  }

  @ApiOperation({ summary: lang.get('en')?.updateProfile })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('profile')
  async updateProfile(
    @Req() req: FastifyRequestWithAuth,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<boolean> {
    return this.authService.updateProfile(req.user, updateProfileDto);
  }

  @ApiOperation({ summary: lang.get('en')?.signOut })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @UseGuards(JwtGuard)
  @Delete('log-out')
  async signOut(
    @Req() req: FastifyRequestWithAuth,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<boolean> {
    const result = await this.authService.signOut(req.user);
    res.clearCookie(`${PROJECT_TAG}_accessToken`);
    res.clearCookie(`${PROJECT_TAG}_refreshToken`);
    res.clearCookie(`${PROJECT_TAG}_rememberMe`);
    res.clearCookie(`${PROJECT_TAG}_sessionId`);
    return result;
  }
}

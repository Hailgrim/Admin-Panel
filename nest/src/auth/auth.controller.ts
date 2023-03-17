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
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from 'libs/config';
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
  @ApiResponse({ status: 201, type: IUser })
  @Post('sign-up')
  async signUp(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() signUpDto: SignUpDto,
  ): Promise<IUser> {
    res.status(HttpStatus.CREATED);
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: lang.get('en')?.confirmRegistration })
  @ApiResponse({ status: 200, type: Boolean })
  @Post('verify-user')
  async verifyUser(@Body() verifyUserDto: VerifyUserDto): Promise<boolean> {
    return this.authService.verifyUser(verifyUserDto);
  }

  @ApiOperation({ summary: lang.get('en')?.forgotPassword })
  @ApiResponse({ status: 200, type: Boolean })
  @Post('forgot-password')
  async forgotPassword(@Body() email: string): Promise<boolean> {
    return this.authService.forgotPassword(email);
  }

  @ApiOperation({ summary: lang.get('en')?.resetPassword })
  @ApiResponse({ status: 200, type: Boolean })
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<boolean> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({ summary: lang.get('en')?.signIn })
  @ApiResponse({ status: 201, type: IUser })
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @Req() req: FastifyRequestWithUser,
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() signInDto: SignInDto,
  ): Promise<IUser> {
    const rememberMe = signInDto.rememberMe;
    const { accessToken, refreshToken } = await this.authService.signIn(
      req.user,
      rememberMe,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: ACCESS_TOKEN_LIFETIME,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: rememberMe ? REFRESH_TOKEN_LIFETIME : ACCESS_TOKEN_LIFETIME * 2,
    });

    if (rememberMe) {
      res.cookie('rememberMe', '', {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
      });
    } else {
      res.clearCookie('rememberMe');
    }

    res.status(HttpStatus.CREATED);
    return req.user;
  }

  @ApiOperation({ summary: lang.get('en')?.refreshToken })
  @ApiResponse({ status: 200, type: ITokensResponse })
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() req: FastifyRequestWithAuth,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<ITokensResponse> {
    const rememberMe = 'rememberMe' in getCookies(req.headers.cookie);
    const { accessToken, refreshToken } = await this.authService.refresh(
      req.user,
      rememberMe,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: ACCESS_TOKEN_LIFETIME,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: rememberMe ? REFRESH_TOKEN_LIFETIME : ACCESS_TOKEN_LIFETIME * 2,
    });

    return { accessToken, refreshToken };
  }

  @ApiOperation({ summary: lang.get('en')?.profile })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles({ path: route, action: Rights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('profile')
  async getProfile(@Req() req: FastifyRequestWithAuth): Promise<IUser> {
    return this.authService.getProfile(req.user);
  }

  @ApiOperation({ summary: lang.get('en')?.refreshToken })
  @ApiResponse({ status: 200, type: IUser })
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
  @ApiResponse({ status: 200, type: Boolean })
  @UseGuards(JwtGuard)
  @Delete('log-out')
  async signOut(
    @Req() req: FastifyRequestWithAuth,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<boolean> {
    const result = await this.authService.signOut(req.user);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('rememberMe');
    return result;
  }
}

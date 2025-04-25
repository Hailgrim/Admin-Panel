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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtGuard } from './jwt.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { SignInDto } from './dto/sign-in.dto';
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from 'libs/config';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { SignUpDto } from './dto/sign-up.dts';
import d from 'locales/dictionary';
import { FastifyRequestWithToken, FastifyRequestWithUser } from './auth.types';
import { IUser } from 'src/users/users.types';
import { createCookieOptions, getIP } from 'libs/utils';

@ApiTags(d['en'].authorization)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: d['en'].signUp })
  @ApiResponse({ status: HttpStatus.CREATED, type: IUser })
  @Post('sign-up')
  signUp(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() signUpDto: SignUpDto,
  ): Promise<IUser> {
    res.status(HttpStatus.CREATED);
    return this.authService.signUp(signUpDto);
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
      getIP(req),
      req.headers['user-agent'],
    );

    res.cookie('accessToken', accessToken, createCookieOptions());
    res.cookie('refreshToken', refreshToken, createCookieOptions(sessionTtl));

    if (signInDto.rememberMe) {
      res.cookie('rememberMe', 'true', createCookieOptions(sessionTtl));
    } else {
      res.clearCookie('rememberMe', createCookieOptions());
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

  @ApiOperation({ summary: d['en'].signUp })
  @ApiResponse({ status: HttpStatus.CREATED, type: IUser })
  @Post('sign-in/google')
  async signInGoogle(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() googleAccessToken: string,
  ): Promise<IUser> {
    const { accessToken, refreshToken, user } =
      await this.authService.signInGoogle(
        googleAccessToken,
        REFRESH_TOKEN_LIFETIME,
        getIP(req),
        req.headers['user-agent'],
      );

    res.cookie('accessToken', accessToken, createCookieOptions());
    res.cookie(
      'refreshToken',
      refreshToken,
      createCookieOptions(REFRESH_TOKEN_LIFETIME),
    );
    res.cookie(
      'rememberMe',
      'true',
      createCookieOptions(REFRESH_TOKEN_LIFETIME),
    );

    res.status(HttpStatus.CREATED);
    return user;
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

  @ApiOperation({ summary: d['en'].refreshToken })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() req: FastifyRequestWithToken,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<boolean> {
    const rememberMe = req.cookies['rememberMe'] !== undefined;
    const sessionTtl = rememberMe
      ? REFRESH_TOKEN_LIFETIME
      : ACCESS_TOKEN_LIFETIME * 2;
    const { accessToken, refreshToken } = await this.authService.refresh(
      req.user.userId,
      req.user.sessionId,
      sessionTtl,
      getIP(req),
      req.headers['user-agent'],
    );

    res.cookie('accessToken', accessToken, createCookieOptions());
    res.cookie('refreshToken', refreshToken, createCookieOptions(sessionTtl));

    if (rememberMe) {
      res.cookie('rememberMe', 'true', createCookieOptions(sessionTtl));
    }

    return true;
  }

  @ApiOperation({ summary: d['en'].signOut })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @UseGuards(JwtGuard)
  @Delete('sign-out')
  async signOut(
    @Req() req: FastifyRequestWithToken,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<boolean> {
    const result = await this.authService.signOut(
      req.user.userId,
      req.user.sessionId,
    );
    const cookieOptions = createCookieOptions();
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.clearCookie('rememberMe', cookieOptions);
    return result;
  }
}

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
import { SignUpDto } from './dto/sign-up.dto';
import {
  TFastifyRequestWithToken,
  TFastifyRequestWithUser,
} from './auth.types';
import { createCookieOptions, getIP } from 'libs/utils';
import { SignInGoogleDto } from './dto/sign-in-google.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { d, IUser, ROUTES } from '@ap/shared';
import { ExternalUserDto } from 'src/users/dto/external-user.dto';

@ApiTags(d['en'].authorization)
@Controller(ROUTES.api.auth.substring(1))
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: d['en'].signUp })
  @ApiResponse({ status: HttpStatus.CREATED, type: ExternalUserDto })
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto): Promise<IUser> {
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: d['en'].forgotPassword })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Post('forgot-password')
  forgotPassword(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() ForgotPasswordDto: ForgotPasswordDto,
  ): Promise<boolean> {
    res.status(HttpStatus.OK);
    return this.authService.forgotPassword(ForgotPasswordDto.email);
  }

  @ApiOperation({ summary: d['en'].resetPassword })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Post('reset-password')
  resetPassword(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<boolean> {
    res.status(HttpStatus.OK);
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.code,
      resetPasswordDto.password,
    );
  }

  @ApiOperation({ summary: d['en'].signIn })
  @ApiResponse({ status: HttpStatus.CREATED, type: ExternalUserDto })
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @Req() req: TFastifyRequestWithUser,
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

    return req.user;
  }

  @ApiOperation({ summary: d['en'].confirmRegistration })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Post('verify-user')
  verifyUser(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() verifyUserDto: VerifyUserDto,
  ): Promise<boolean> {
    res.status(HttpStatus.OK);
    return this.authService.verifyUser(verifyUserDto.email, verifyUserDto.code);
  }

  @ApiOperation({ summary: d['en'].signUp })
  @ApiResponse({ status: HttpStatus.CREATED, type: ExternalUserDto })
  @Post('sign-in/google')
  async signInGoogle(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() signInGoogleDto: SignInGoogleDto,
  ): Promise<IUser> {
    const { accessToken, refreshToken, user } =
      await this.authService.signInGoogle(
        signInGoogleDto.googleAccessToken,
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

    return user;
  }

  @ApiOperation({ summary: d['en'].refreshToken })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() req: TFastifyRequestWithToken,
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
    @Req() req: TFastifyRequestWithToken,
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

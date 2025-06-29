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
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { plainToInstance } from 'class-transformer';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtGuard } from './jwt.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { SignInDto } from './dto/sign-in.dto';
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
import { getT, IUser, ROUTES } from '@ap/shared';
import { ExternalUserDto } from 'src/users/dto/external-user.dto';
import { cfg } from 'config/configuration';

@ApiTags(getT().authorization)
@Controller(ROUTES.api.auth.substring(1))
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: getT().signUp })
  @ApiResponse({ status: HttpStatus.CREATED, type: ExternalUserDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<IUser> {
    const user = await this.authService.signUp(signUpDto);
    return plainToInstance(ExternalUserDto, user);
  }

  @ApiOperation({ summary: getT().forgotPassword })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @ApiOperation({ summary: getT().resetPassword })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    await this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.code,
      resetPasswordDto.password,
    );
  }

  @ApiOperation({ summary: getT().signIn })
  @ApiResponse({ status: HttpStatus.CREATED, type: ExternalUserDto })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @Req() req: TFastifyRequestWithUser,
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<IUser> {
    const sessionTtl = signInDto.rememberMe
      ? cfg.tokens.refresh.lifetime
      : cfg.tokens.access.lifetime * 2;
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

    return plainToInstance(ExternalUserDto, req.user);
  }

  @ApiOperation({ summary: getT().confirmRegistration })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('verify-user')
  async verifyUser(@Body() verifyUserDto: VerifyUserDto): Promise<void> {
    await this.authService.verifyUser(verifyUserDto.email, verifyUserDto.code);
  }

  @ApiOperation({ summary: getT().signUp })
  @ApiResponse({ status: HttpStatus.CREATED, type: ExternalUserDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-in/google')
  async signInGoogle(
    @Req() req: FastifyRequest,
    @Body() signInGoogleDto: SignInGoogleDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<IUser> {
    const { accessToken, refreshToken, user } =
      await this.authService.signInGoogle(
        signInGoogleDto.googleAccessToken,
        cfg.tokens.refresh.lifetime,
        getIP(req),
        req.headers['user-agent'],
      );

    res.cookie('accessToken', accessToken, createCookieOptions());
    res.cookie(
      'refreshToken',
      refreshToken,
      createCookieOptions(cfg.tokens.refresh.lifetime),
    );
    res.cookie(
      'rememberMe',
      'true',
      createCookieOptions(cfg.tokens.refresh.lifetime),
    );

    return plainToInstance(ExternalUserDto, user);
  }

  @ApiOperation({ summary: getT().refreshToken })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() req: TFastifyRequestWithToken,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    const rememberMe = req.cookies['rememberMe'] !== undefined;
    const sessionTtl = rememberMe
      ? cfg.tokens.refresh.lifetime
      : cfg.tokens.access.lifetime * 2;
    const { accessToken, refreshToken } = await this.authService.refresh(
      req.user,
      sessionTtl,
      getIP(req),
      req.headers['user-agent'],
    );

    res.cookie('accessToken', accessToken, createCookieOptions());
    res.cookie('refreshToken', refreshToken, createCookieOptions(sessionTtl));

    if (rememberMe) {
      res.cookie('rememberMe', 'true', createCookieOptions(sessionTtl));
    }
  }

  @ApiOperation({ summary: getT().signOut })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  @Delete('sign-out')
  async signOut(
    @Req() req: TFastifyRequestWithToken,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    await this.authService.signOut(req.user.userId, req.user.sessionId);
    const cookieOptions = createCookieOptions();

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.clearCookie('rememberMe', cookieOptions);
  }
}

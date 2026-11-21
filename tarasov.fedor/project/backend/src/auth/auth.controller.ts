import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
  type SessionUser,
} from './auth.constants';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string; user: SessionUser }> {
    const { token, user } = await this.authService.login(dto);

    response.cookie(SESSION_COOKIE_NAME, token, sessionCookieOptions());

    return {
      message: 'Вы успешно вошли в систему',
      user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response): { message: string } {
    response.clearCookie(SESSION_COOKIE_NAME, { path: '/' });

    return {
      message: 'Вы вышли из системы',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: SessionUser): { user: SessionUser } {
    return { user };
  }
}

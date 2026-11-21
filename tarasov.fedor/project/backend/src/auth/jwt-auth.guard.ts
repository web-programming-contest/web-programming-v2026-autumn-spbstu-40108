import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AuthenticatedRequest } from './authenticated-request';
import {
  SESSION_COOKIE_NAME,
  type SessionTokenPayload,
  type SessionUser,
} from './auth.constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies?.[SESSION_COOKIE_NAME] as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Требуется авторизация');
    }

    try {
      const payload = await this.jwtService.verifyAsync<SessionTokenPayload>(token);

      if (!payload.sub || !payload.username) {
        throw new UnauthorizedException('Сессия истекла, войдите снова');
      }

      const user: SessionUser = {
        id: payload.sub,
        username: payload.username,
      };

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Сессия истекла, войдите снова');
    }
  }
}

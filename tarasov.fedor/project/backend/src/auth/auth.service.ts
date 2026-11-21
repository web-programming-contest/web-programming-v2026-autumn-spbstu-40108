import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { DATABASE, type Database } from '../database/database.module';
import { users } from '../database/schema';
import {
  LOGIN_ERROR_MESSAGE,
  type SessionUser,
} from './auth.constants';
import type { LoginDto } from './dto/login.dto';

export interface LoginResult {
  token: string;
  user: SessionUser;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResult> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, dto.username))
      .limit(1);

    if (!user || !(await compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException(LOGIN_ERROR_MESSAGE);
    }

    const sessionUser: SessionUser = {
      id: user.id,
      username: user.username,
    };

    const token = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });

    return {
      token,
      user: sessionUser,
    };
  }
}

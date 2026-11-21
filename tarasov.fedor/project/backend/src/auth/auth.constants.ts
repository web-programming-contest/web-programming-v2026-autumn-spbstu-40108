import type { CookieOptions } from 'express';

export const SESSION_COOKIE_NAME = 'gadget_hub_session';
export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const LOGIN_ERROR_MESSAGE =
  'Такого пользователя нет, возможно неправильный логин или пароль — проверьте данные';

export interface SessionUser {
  id: number;
  username: string;
}

export interface SessionTokenPayload {
  sub: number;
  username: string;
  iat?: number;
  exp?: number;
}

export function sessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_MS,
  };
}

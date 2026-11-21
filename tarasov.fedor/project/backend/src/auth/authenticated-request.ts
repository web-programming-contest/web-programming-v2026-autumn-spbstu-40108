import type { Request } from 'express';
import type { SessionUser } from './auth.constants';

export interface AuthenticatedRequest extends Request {
  user: SessionUser;
}

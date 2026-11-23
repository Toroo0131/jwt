import type { Request } from 'express';

export interface JwtPayload {
  sub: number;
  username: string;
  roles: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

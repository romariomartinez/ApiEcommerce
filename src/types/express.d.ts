import { Request } from 'express';

export interface AuthPayload {
  userId: string;
  roleId: number;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthPayload;
  }
}

import { Request, Response, NextFunction } from 'express';

export function requireRole(roles: number[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.roleId)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}
